const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const WEATHER_TIMEOUT_MS = Number(process.env.WEATHER_TIMEOUT_MS || 5000);

export async function fetchWeatherSignals(lat, lng) {
  const url = `${OPEN_METEO_URL}?latitude=${lat}&longitude=${lng}&hourly=precipitation_probability,temperature_2m,wind_speed_10m,uv_index&forecast_days=1&timezone=auto`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEATHER_TIMEOUT_MS);
  let response;

  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(`Weather API timed out after ${WEATHER_TIMEOUT_MS}ms`);
    }
    throw new Error(`Weather API request failed: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Weather API failed with status ${response.status}`);
  }

  const data = await response.json();
  const hourly = data.hourly || {};

  const rain = maxOf(hourly.precipitation_probability);
  const temp = maxOf(hourly.temperature_2m);
  const wind = maxOf(hourly.wind_speed_10m);
  const uv = maxOf(hourly.uv_index);

  return {
    rainProbability: rain,
    maxTempC: temp,
    maxWindKmh: wind,
    maxUv: uv,
  };
}

function maxOf(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return 0;
  }
  return Math.max(...values.filter((v) => typeof v === 'number'));
}
