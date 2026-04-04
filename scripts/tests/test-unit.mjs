import { calculateDynamicQuote, generateTriggers } from '../../server/utils/pricing.js';
import { haversineDistanceKm } from '../../server/utils/geo.js';
import { assert, assertIncludes } from './lib/assert.mjs';

async function main() {
  const distA = haversineDistanceKm(12.9352, 77.6245, 12.9352, 77.6245);
  const distB = haversineDistanceKm(12.9352, 77.6245, 12.9719, 77.6412);
  const distC = haversineDistanceKm(12.9719, 77.6412, 12.9352, 77.6245);

  assert(Math.abs(distA) < 0.001, 'Geo distance must be near-zero for identical points');
  assert(distB > 0, 'Geo distance must be positive for different points');
  assert(Math.abs(distB - distC) < 0.001, 'Geo distance must be symmetric');

  const lowRiskWeather = { rainProbability: 5, maxTempC: 28, maxWindKmh: 8, maxUv: 3 };
  const highRiskWeather = { rainProbability: 88, maxTempC: 42, maxWindKmh: 47, maxUv: 10 };

  const lowQuote = calculateDynamicQuote({ plan: 'standard', weather: lowRiskWeather, hoursPerDay: 8 });
  const highQuote = calculateDynamicQuote({ plan: 'standard', weather: highRiskWeather, hoursPerDay: 12 });

  assert(highQuote.dailyPremium > lowQuote.dailyPremium, 'High-risk quote must produce higher premium');
  assert(highQuote.dailyCoverage >= lowQuote.dailyCoverage, 'High-risk quote must not reduce coverage amount');
  assert(highQuote.riskScore > lowQuote.riskScore, 'Risk score must increase with weather severity');

  const calmTriggers = generateTriggers(lowRiskWeather);
  const stormTriggers = generateTriggers(highRiskWeather);

  assertIncludes(
    calmTriggers,
    (trigger) => trigger.status === 'resolved' && trigger.type === 'Platform',
    'Calm weather must generate a resolved platform trigger',
  );

  assertIncludes(
    stormTriggers,
    (trigger) => trigger.type === 'Rainfall' && trigger.payout > 0,
    'High-rain weather must generate payout-bearing rainfall trigger',
  );

  console.log(
    JSON.stringify(
      {
        suite: 'unit',
        status: 'passed',
        checks: 9,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
