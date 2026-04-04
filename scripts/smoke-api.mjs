const API_BASE = process.env.SMOKE_API_BASE_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message = data?.error || `Request failed: ${response.status}`;
    throw new Error(`${path}: ${message}`);
  }

  return data;
}

async function main() {
  const health = await request('/health');

  const mobile = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
  const signup = await request('/auth/rider/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Smoke Rider',
      mobile,
      password: 'Rider@123',
      plan: 'standard',
      location: { lat: 12.9352, lng: 77.6245 },
    }),
  });

  const insurerLogin = await request('/auth/insurer/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'insurer@shieldride.ai',
      password: 'Insurer@123',
    }),
  });

  const dashboard = await request('/dashboard/insurer', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${insurerLogin.token}`,
    },
  });

  const result = {
    apiBase: API_BASE,
    dbMode: health?.db?.mode,
    persistent: health?.db?.persistent,
    createdRiderId: signup?.user?.id,
    totalPolicies: dashboard?.metrics?.totalPolicies,
    latestRider: dashboard?.riders?.[0]?.name,
  };

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
