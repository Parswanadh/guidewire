const BASE_PRICING = {
  basic: { dailyRate: 6, dailyCoverage: 150 },
  standard: { dailyRate: 9, dailyCoverage: 250 },
  premium: { dailyRate: 12, dailyCoverage: 400 },
};

export function calculateDynamicQuote({ plan, weather, hoursPerDay = 8 }) {
  const selected = BASE_PRICING[plan] || BASE_PRICING.standard;

  const rainRisk = clamp((weather.rainProbability || 0) / 100);
  const tempRisk = clamp(((weather.maxTempC || 0) - 30) / 20);
  const windRisk = clamp((weather.maxWindKmh || 0) / 60);
  const uvRisk = clamp((weather.maxUv || 0) / 12);

  const weightedRisk = rainRisk * 0.35 + tempRisk * 0.25 + windRisk * 0.2 + uvRisk * 0.2;
  const hourFactor = hoursPerDay > 8 ? 1 + (hoursPerDay - 8) * 0.02 : 1;

  const dynamicDaily = round2(selected.dailyRate * (1 + weightedRisk * 0.65) * hourFactor);
  const dynamicWeekly = round2(dynamicDaily * 7);
  const dynamicCoverage = Math.round(selected.dailyCoverage * (1 + weightedRisk * 0.35));

  return {
    plan,
    riskScore: Math.round(weightedRisk * 100),
    dailyPremium: dynamicDaily,
    weeklyPremium: dynamicWeekly,
    dailyCoverage: dynamicCoverage,
    weather,
  };
}

export function generateTriggers(weather) {
  const triggers = [];

  if (weather.rainProbability >= 65) {
    triggers.push({
      id: `TRG-RAIN-${Date.now()}`,
      type: 'Rainfall',
      status: 'active',
      intensity: `${Math.round(weather.rainProbability)}%`,
      payout: Math.round(weather.rainProbability * 2.4),
      timestamp: new Date().toLocaleTimeString(),
      description: 'High precipitation probability detected for your hub zone.',
    });
  }

  if (weather.maxTempC >= 38) {
    triggers.push({
      id: `TRG-HEAT-${Date.now()}`,
      type: 'Heat',
      status: 'warning',
      intensity: `${Math.round(weather.maxTempC)}°C`,
      payout: Math.round(weather.maxTempC * 3),
      timestamp: new Date().toLocaleTimeString(),
      description: 'Heat stress threshold crossed for riders in your service area.',
    });
  }

  if (weather.maxWindKmh >= 40) {
    triggers.push({
      id: `TRG-WIND-${Date.now()}`,
      type: 'Wind',
      status: 'warning',
      intensity: `${Math.round(weather.maxWindKmh)} km/h`,
      payout: Math.round(weather.maxWindKmh * 2),
      timestamp: new Date().toLocaleTimeString(),
      description: 'Wind speed trigger active for safety-based payout logic.',
    });
  }

  if (triggers.length === 0) {
    triggers.push({
      id: `TRG-CALM-${Date.now()}`,
      type: 'Platform',
      status: 'resolved',
      intensity: 'Normal operations',
      payout: 0,
      timestamp: new Date().toLocaleTimeString(),
      description: 'No extreme weather disruption currently detected.',
    });
  }

  return triggers;
}

function clamp(value) {
  return Math.max(0, Math.min(1, value));
}

function round2(value) {
  return Math.round(value * 100) / 100;
}
