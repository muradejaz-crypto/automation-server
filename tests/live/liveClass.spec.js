// liveClass.spec.js - Validate live class API via automation server
const { test, expect } = require('@playwright/test');

const SERVER_URL = process.env.AUTOMATION_SERVER_URL || 'http://localhost:3001';

test.describe('Live Class API', () => {
  test('Create and fetch live class session', async ({ request }) => {
    test.setTimeout(60000);

    const payload = {
      title: `Live Class ${Date.now()}`,
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      durationMinutes: 45,
      description: 'Automation-created live class session',
    };

    console.log('Step 1: Create live class session');
    const createResp = await request.post(`${SERVER_URL}/api/live-class/sessions`, {
      data: payload,
    });
    expect(createResp.ok()).toBeTruthy();
    const session = await createResp.json();
    console.log('Created session:', session);

    console.log('Step 2: Fetch session by id');
    const fetchResp = await request.get(`${SERVER_URL}/api/live-class/sessions/${session.id}`);
    expect(fetchResp.ok()).toBeTruthy();
    const fetched = await fetchResp.json();
    expect(fetched.id).toBe(session.id);

    console.log('✅ Live class API flow verified');
  });
});
