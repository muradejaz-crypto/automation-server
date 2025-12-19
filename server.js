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
  // Check if running on Railway (cloud environment)
  const isRailway = !!(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_ENVIRONMENT_ID);
  // Check if running in Docker/container (common indicators)
  const isContainer = process.env.PWD === '/app' || __dirname.includes('/app') || process.env.HOME === '/root';
  
  // Only force headless on Railway/container, not on local Windows
  // Allow override via FORCE_HEADED environment variable
  const forceHeaded = process.env.FORCE_HEADED === 'true';
  const forceHeadless = (isRailway || isContainer) && !forceHeaded && !isWindows;
  const actualHeaded = forceHeadless ? false : headed;
  const npxCmd = isWindows ? 'npx.cmd' : 'npx';
  
  // Build command with explicit headed flag
  const cmdParts = [
    npxCmd,
    'playwright',
    'test',
    specPath,
    '--project=chromium',
    '--reporter=line'
  ];
  
  if (actualHeaded) {
    cmdParts.push('--headed');
  }
  
  const runCommand = cmdParts.join(' ');
  
  console.log(`Running Playwright test: ${specPath}`);
  console.log(`Headed mode: ${actualHeaded} (requested: ${headed}, Railway: ${!!isRailway})`);
  console.log(`Command: ${runCommand}`);

  // Prepare environment variables - explicitly unset CI for headed mode
  const envVars = { ...process.env };
  if (actualHeaded) {
    // For headed mode: remove CI completely and set HEADLESS=0
    delete envVars.CI;
    envVars.HEADLESS = '0';
    envVars.PWDEBUG = '0';
    // Don't set CI to undefined, just delete it
  } else {
    // For headless mode: set CI and HEADLESS=1
    envVars.CI = '1';
    envVars.HEADLESS = '1';
  }
  
  console.log(`Environment - CI: ${envVars.CI || 'not set'}, HEADLESS: ${envVars.HEADLESS}, Headed: ${actualHeaded}, Windows: ${isWindows}, Railway: ${isRailway}`);

  const child = spawn(runCommand, {
    cwd: projectRoot,
    env: envVars,
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
