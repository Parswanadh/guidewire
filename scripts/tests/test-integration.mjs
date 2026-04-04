import { assert, assertArray, assertEqual, assertObject, assertType } from './lib/assert.mjs';
import { requestJson } from './lib/http.mjs';
import { startTestServer } from './lib/testServer.mjs';

async function main() {
  const server = await startTestServer({ port: 4051 });

  try {
    const health = await requestJson(server.baseUrl, '/api/health');
    assertEqual(health.status, 200, 'Health endpoint must succeed');
    assertEqual(health.data?.ok, true, 'Health payload must report ok=true');

    const mobile = `9${Math.floor(100000000 + Math.random() * 900000000)}`;

    const signup = await requestJson(server.baseUrl, '/api/auth/rider/signup', {
      method: 'POST',
      body: {
        name: 'Integration Rider',
        mobile,
        password: 'Rider@123',
        plan: 'standard',
        location: { lat: 12.9352, lng: 77.6245 },
      },
    });

    assertEqual(signup.status, 201, 'Rider signup must return 201');
    assertType(signup.data?.token, 'string', 'Signup token');
    assertObject(signup.data?.user, 'Signup user');
    assertEqual(signup.data?.user?.role, 'rider', 'Signup role must be rider');

    const riderToken = signup.data.token;

    const riderMe = await requestJson(server.baseUrl, '/api/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${riderToken}` },
    });

    assertEqual(riderMe.status, 200, 'Rider auth/me must succeed');
    assertEqual(riderMe.data?.user?.mobile, mobile, 'Rider auth/me must match signed-up rider');

    const hubs = await requestJson(server.baseUrl, '/api/hubs/nearby?lat=12.9352&lng=77.6245');
    assertEqual(hubs.status, 200, 'Nearby hubs request must succeed');
    assertArray(hubs.data?.hubs, 'Nearby hubs');
    assert(hubs.data.hubs.length > 0, 'Nearby hubs must contain at least one hub');

    const hubSelect = await requestJson(server.baseUrl, '/api/rider/hub', {
      method: 'POST',
      headers: { Authorization: `Bearer ${riderToken}` },
      body: {
        hubId: hubs.data.hubs[0]._id,
        lat: 12.9352,
        lng: 77.6245,
      },
    });

    assertEqual(hubSelect.status, 200, 'Rider hub selection must succeed');
    assertType(hubSelect.data?.user?.darkStore, 'string', 'Rider darkStore after hub selection');

    const quote = await requestJson(server.baseUrl, '/api/pricing/quote', {
      method: 'POST',
      body: {
        plan: 'premium',
        lat: 12.9352,
        lng: 77.6245,
        hoursPerDay: 10,
      },
    });

    assertEqual(quote.status, 200, 'Dynamic quote endpoint must succeed');
    assertType(quote.data?.quote?.dailyPremium, 'number', 'Quote daily premium');

    const insurerLogin = await requestJson(server.baseUrl, '/api/auth/insurer/login', {
      method: 'POST',
      body: { email: 'insurer@shieldride.ai', password: 'Insurer@123' },
    });

    assertEqual(insurerLogin.status, 200, 'Insurer login must succeed');

    const dashboard = await requestJson(server.baseUrl, '/api/dashboard/insurer', {
      method: 'GET',
      headers: { Authorization: `Bearer ${insurerLogin.data.token}` },
    });

    assertEqual(dashboard.status, 200, 'Insurer dashboard must succeed');
    assertType(dashboard.data?.metrics?.totalPolicies, 'number', 'Insurer totalPolicies metric');
    assertArray(dashboard.data?.riders, 'Insurer riders list');
    assert(dashboard.data.metrics.totalPolicies >= 1, 'Insurer dashboard must include at least one policy');

    console.log(
      JSON.stringify(
        {
          suite: 'integration',
          status: 'passed',
          createdRider: signup.data.user.id,
          totalPolicies: dashboard.data.metrics.totalPolicies,
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
