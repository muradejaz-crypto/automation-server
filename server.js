const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const RUN_TIMEOUT_MS = Number(process.env.AUTOMATION_TIMEOUT_MS || 8 * 60 * 1000); // default 8 minutes

app.use(cors());
app.use(express.json());

let currentRun = null;

function runPlaywright(specPath, headed = true, res) {
  if (currentRun) {
    return res.status(409).json({
      success: false,
      message: 'A test run is already in progress. Please wait for it to finish.',
    });
  }

  const projectRoot = __dirname;
  const isWindows = process.platform === 'win32';
  const npxCmd = isWindows ? 'npx.cmd' : 'npx';
  const headFlag = headed ? '--headed' : '';
  const runCommand = `${npxCmd} playwright test ${specPath} --project=chromium --reporter=line ${headFlag}`.trim();

  const child = spawn(runCommand, {
    cwd: projectRoot,
    env: {
      ...process.env,
      HEADLESS: headed ? '0' : '1',
      CI: headed ? '0' : '1', // disable CI mode for headed so browser opens
    },
    shell: true,
  });

  currentRun = child;
  let stdout = '';
  let stderr = '';
  let settled = false;

  const timeout = setTimeout(() => {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }, RUN_TIMEOUT_MS);

  child.stdout.on('data', (data) => {
    const chunk = data.toString();
    stdout += chunk;
    console.log(chunk.trim());
  });

  child.stderr.on('data', (data) => {
    const chunk = data.toString();
    stderr += chunk;
    console.error(chunk.trim());
  });

  const finish = (statusCode, body) => {
    if (settled) return;
    settled = true;
    clearTimeout(timeout);
    currentRun = null;
    res.status(statusCode).json(body);
  };

  child.on('error', (error) => {
    finish(500, {
      success: false,
      message: 'Failed to start Playwright test run',
      error: error.message,
      output: stdout.trim() || null,
      errors: stderr.trim() || null,
    });
  });

  child.on('close', (code, signal) => {
    const timedOut = signal === 'SIGTERM';
    const success = !timedOut && code === 0;

    finish(success ? 200 : 500, {
      success,
      message: timedOut
        ? 'Playwright test timed out and was stopped'
        : success
          ? 'Playwright test completed successfully'
          : `Playwright test failed with exit code ${code}`,
      output: stdout.trim() || null,
      errors: stderr.trim() || null,
      timedOut,
    });
  });
}

/**
 * Basic health check to let the Angular app know the server is reachable.
 */
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Playwright automation server is running',
  });
});

/**
 * Starts the Playwright test that automates Test Creation.
 * Endpoint is kept identical to the Angular expectation.
 */
function buildHandler(defaultSpec) {
  return (req, res) => {
    const headed = req.body && typeof req.body.headed === 'boolean' ? req.body.headed : true;
    const spec =
      req.body && typeof req.body.spec === 'string' && req.body.spec.trim()
        ? req.body.spec.trim()
        : defaultSpec;
    console.log(`Request received - Spec: ${spec}, Headed requested: ${headed}`);
    return runPlaywright(spec, headed, res);
  };
}

app.post('/api/automation/run-test-creation', buildHandler('tests/instructor/createTest.spec.js'));
app.post('/api/automation/run-course-creation', buildHandler('tests/instructor/createCourse.spec.js'));
app.post('/api/automation/run-purchase', buildHandler('tests/student/purchasePremiumCourse.spec.js'));
app.post('/api/automation/run-login', buildHandler('tests/student/login.spec.js'));
app.post('/api/automation/run-social-signup', buildHandler('tests/student/socialSignup.spec.js'));
app.post('/api/automation/run-student-full-flow', buildHandler('tests/student/studentFullFlow.spec.js'));
app.post('/api/automation/run-live-class', buildHandler('tests/live/liveClass.spec.js'));

process.on('SIGINT', () => {
  if (currentRun && !currentRun.killed) {
    currentRun.kill('SIGTERM');
  }
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Automation server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Run Test Creation: http://localhost:${PORT}/api/automation/run-test-creation`);
  console.log(`Project root: ${path.resolve(__dirname)}`);
});
