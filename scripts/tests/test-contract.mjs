import { assertEqual, assertObject, assertType } from './lib/assert.mjs';
import { requestJson } from './lib/http.mjs';
import { startTestServer } from './lib/testServer.mjs';

function assertRiderShape(user, label) {
  assertObject(user, `${label} user`);
  assertType(user.id, 'string', `${label}.id`);
  assertType(user.role, 'string', `${label}.role`);
  assertType(user.name, 'string', `${label}.name`);
  assertType(user.mobile, 'string', `${label}.mobile`);
  assertType(user.plan, 'string', `${label}.plan`);
  assertType(user.weeklyPremium, 'number', `${label}.weeklyPremium`);
}

function assertQuoteShape(quote) {
  assertObject(quote, 'Quote object');
  assertType(quote.plan, 'string', 'quote.plan');
  assertType(quote.riskScore, 'number', 'quote.riskScore');
  assertType(quote.dailyPremium, 'number', 'quote.dailyPremium');
  assertType(quote.weeklyPremium, 'number', 'quote.weeklyPremium');
  assertType(quote.dailyCoverage, 'number', 'quote.dailyCoverage');
  assertObject(quote.weather, 'quote.weather');
  assertType(quote.weather.rainProbability, 'number', 'quote.weather.rainProbability');
}

async function main() {
  const server = await startTestServer({ port: 4052 });

  try {
    const health = await requestJson(server.baseUrl, '/api/health');
    assertEqual(health.status, 200, 'Contract health status');
    assertType(health.data.ok, 'boolean', 'health.ok');
    assertType(health.data.service, 'string', 'health.service');
    assertObject(health.data.db, 'health.db');
    assertType(health.data.db.mode, 'string', 'health.db.mode');
    assertType(health.data.db.persistent, 'boolean', 'health.db.persistent');
    assertType(health.data.db.readyState, 'number', 'health.db.readyState');

    const mobile = `8${Math.floor(100000000 + Math.random() * 900000000)}`;
    const signup = await requestJson(server.baseUrl, '/api/auth/rider/signup', {
      method: 'POST',
      body: {
        name: 'Contract Rider',
        mobile,
        password: 'Rider@123',
        plan: 'basic',
        location: { lat: 12.9719, lng: 77.6412 },
      },
    });

    assertEqual(signup.status, 201, 'Contract signup status');
    assertType(signup.data.token, 'string', 'signup.token');
    assertRiderShape(signup.data.user, 'signup');

    const quote = await requestJson(server.baseUrl, '/api/pricing/quote', {
      method: 'POST',
      body: {
        plan: 'standard',
        lat: 12.9719,
        lng: 77.6412,
        hoursPerDay: 9,
      },
    });

    assertEqual(quote.status, 200, 'Contract quote status');
    assertQuoteShape(quote.data.quote);

    console.log(
      JSON.stringify(
        {
          suite: 'contract',
          status: 'passed',
          endpointsChecked: ['/api/health', '/api/auth/rider/signup', '/api/pricing/quote'],
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
