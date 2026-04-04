import { assert, assertEqual } from './lib/assert.mjs';
import { requestJson } from './lib/http.mjs';
import { startTestServer } from './lib/testServer.mjs';

async function main() {
  const server = await startTestServer({
    port: 4053,
    env: {
      API_JSON_LIMIT: '12kb',
      API_URLENCODED_LIMIT: '12kb',
    },
  });

  try {
    const normalMobile = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    const normalSignup = await requestJson(server.baseUrl, '/api/auth/rider/signup', {
      method: 'POST',
      body: {
        name: 'Resilience Rider',
        mobile: normalMobile,
        password: 'Rider@123',
      },
    });

    assertEqual(normalSignup.status, 201, 'Under-limit payload must succeed');

    const oversizedName = 'X'.repeat(20 * 1024);
    const oversizedStatuses = [];

    for (let i = 0; i < 3; i += 1) {
      const oversizedMobile = `8${Math.floor(100000000 + Math.random() * 900000000)}`;
      const oversized = await requestJson(server.baseUrl, '/api/auth/rider/signup', {
        method: 'POST',
        body: {
          name: oversizedName,
          mobile: oversizedMobile,
          password: 'Rider@123',
        },
      });

      oversizedStatuses.push(oversized.status);
      assertEqual(oversized.status, 413, 'Oversized payload must return 413');
      assertEqual(oversized.data?.error, 'Payload too large', '413 error message contract');
      assert(typeof oversized.data?.maxJsonSize === 'string', '413 payload must include maxJsonSize');
    }

    const invalidHubs = await requestJson(server.baseUrl, '/api/hubs/nearby?lat=abc&lng=xyz');
    assertEqual(invalidHubs.status, 400, 'Invalid lat/lng must return 400');

    const healthAfterStorm = await requestJson(server.baseUrl, '/api/health');
    assertEqual(healthAfterStorm.status, 200, 'API health must remain available after oversized payload storm');
    assertEqual(healthAfterStorm.data?.ok, true, 'API health ok must stay true');

    console.log(
      JSON.stringify(
        {
          suite: 'resilience',
          status: 'passed',
          oversizedStatuses,
          healthReadyState: healthAfterStorm.data?.db?.readyState,
        },
        null,
        2,
      ),
    );
  } finally {
    await server.stop();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
