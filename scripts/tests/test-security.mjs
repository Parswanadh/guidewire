import { assertEqual } from './lib/assert.mjs';
import { requestJson } from './lib/http.mjs';
import { startTestServer } from './lib/testServer.mjs';

async function main() {
  const server = await startTestServer({ port: 4054 });

  try {
    const mobile = `9${Math.floor(100000000 + Math.random() * 900000000)}`;

    const signup = await requestJson(server.baseUrl, '/api/auth/rider/signup', {
      method: 'POST',
      body: {
        name: 'Security Rider',
        mobile,
        password: 'Rider@123',
      },
    });
    assertEqual(signup.status, 201, 'Security setup rider signup must pass');

    const riderToken = signup.data.token;

    const insurerLogin = await requestJson(server.baseUrl, '/api/auth/insurer/login', {
      method: 'POST',
      body: {
        email: 'insurer@shieldride.ai',
        password: 'Insurer@123',
      },
    });
    assertEqual(insurerLogin.status, 200, 'Security setup insurer login must pass');

    const insurerToken = insurerLogin.data.token;

    const riderToInsurerEndpoint = await requestJson(server.baseUrl, '/api/dashboard/insurer', {
      method: 'GET',
      headers: { Authorization: `Bearer ${riderToken}` },
    });
    assertEqual(riderToInsurerEndpoint.status, 403, 'Rider token must be forbidden on insurer dashboard');

    const insurerToRiderEndpoint = await requestJson(server.baseUrl, '/api/dashboard/rider', {
      method: 'GET',
      headers: { Authorization: `Bearer ${insurerToken}` },
    });
    assertEqual(insurerToRiderEndpoint.status, 403, 'Insurer token must be forbidden on rider dashboard');

    const invalidTokenMe = await requestJson(server.baseUrl, '/api/auth/me', {
      method: 'GET',
      headers: { Authorization: 'Bearer invalid.invalid.invalid' },
    });
    assertEqual(invalidTokenMe.status, 401, 'Invalid token must return 401 for auth/me');

    const missingTokenDashboard = await requestJson(server.baseUrl, '/api/dashboard/insurer', {
      method: 'GET',
    });
    assertEqual(missingTokenDashboard.status, 401, 'Missing token must return 401 on protected route');

    const badPassword = await requestJson(server.baseUrl, '/api/auth/rider/login', {
      method: 'POST',
      body: {
        mobile,
        password: 'WrongPassword',
      },
    });
    assertEqual(badPassword.status, 401, 'Invalid credentials must return 401');

    console.log(
      JSON.stringify(
        {
          suite: 'security',
          status: 'passed',
          checks: 6,
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
