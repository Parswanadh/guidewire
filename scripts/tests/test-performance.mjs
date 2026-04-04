import { performance } from 'node:perf_hooks';
import { assert } from './lib/assert.mjs';
import { requestJson } from './lib/http.mjs';
import { startTestServer } from './lib/testServer.mjs';

async function benchmarkRequests(baseUrl, path, count) {
  const durations = [];

  for (let i = 0; i < count; i += 1) {
    const start = performance.now();
    const response = await requestJson(baseUrl, path);
    const elapsed = performance.now() - start;
    durations.push(elapsed);

    if (!response.ok) {
      throw new Error(`${path} benchmark request failed with status ${response.status}`);
    }
  }

  return durations;
}

function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.max(0, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[index];
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

async function main() {
  const server = await startTestServer({ port: 4055 });

  try {
    const healthDurations = await benchmarkRequests(server.baseUrl, '/api/health', 30);
    const hubsDurations = await benchmarkRequests(
      server.baseUrl,
      '/api/hubs/nearby?lat=12.9352&lng=77.6245',
      20,
    );

    const healthP95 = Number(percentile(healthDurations, 95).toFixed(2));
    const hubsP95 = Number(percentile(hubsDurations, 95).toFixed(2));

    assert(healthP95 < 1200, `Health endpoint p95 latency too high: ${healthP95}ms`);
    assert(hubsP95 < 1500, `Hubs endpoint p95 latency too high: ${hubsP95}ms`);

    console.log(
      JSON.stringify(
        {
          suite: 'performance',
          status: 'passed',
          health: {
            count: healthDurations.length,
            avgMs: Number(average(healthDurations).toFixed(2)),
            p95Ms: healthP95,
          },
          hubs: {
            count: hubsDurations.length,
            avgMs: Number(average(hubsDurations).toFixed(2)),
            p95Ms: hubsP95,
          },
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
