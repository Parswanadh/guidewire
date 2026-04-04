import cors from 'cors';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { authRequired, requireRole } from './middleware/auth.js';
import { Hub } from './models/Hub.js';
import { Insurer } from './models/Insurer.js';
import { Rider } from './models/Rider.js';
import { seedDefaults } from './seed.js';
import { signAppToken } from './utils/auth.js';
import { haversineDistanceKm } from './utils/geo.js';
import { calculateDynamicQuote, generateTriggers } from './utils/pricing.js';
import { fetchWeatherSignals } from './utils/weather.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.API_PORT || 4000);
const MONGODB_MODE = (process.env.MONGODB_MODE || 'auto').toLowerCase();
const MONGODB_FALLBACK_MODE = (process.env.MONGODB_FALLBACK_MODE || 'off').toLowerCase();
const MONGODB_LOCAL_URI = process.env.MONGODB_LOCAL_URI || 'mongodb://127.0.0.1:27017/shieldride';
const MONGODB_ATLAS_URI = process.env.MONGODB_ATLAS_URI || '';
const API_JSON_LIMIT = process.env.API_JSON_LIMIT || '10mb';
const API_URLENCODED_LIMIT = process.env.API_URLENCODED_LIMIT || '10mb';
const NODE_ENV = (process.env.NODE_ENV || 'development').toLowerCase();
const AUTH_RATE_LIMIT_WINDOW_MS = Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const AUTH_RATE_LIMIT_MAX = Number(process.env.AUTH_RATE_LIMIT_MAX || 40);
const DEV_IMPLICIT_MEMORY_FALLBACK = (process.env.DEV_IMPLICIT_MEMORY_FALLBACK || 'on').toLowerCase();
const ALLOWED_CORS_ORIGINS = buildAllowedOrigins();

let memoryMongo = null;
const dbRuntime = {
  mode: 'uninitialized',
  target: 'none',
  persistent: false,
};

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (ALLOWED_CORS_ORIGINS.size === 0) {
        callback(new Error('CORS origin not allowed'));
        return;
      }

      if (ALLOWED_CORS_ORIGINS.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: API_JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: API_URLENCODED_LIMIT }));

const authLimiter = rateLimit({
  windowMs: AUTH_RATE_LIMIT_WINDOW_MS,
  max: AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ error: 'Too many authentication attempts. Please try again later.' });
  },
});

app.use('/api/auth/rider/signup', authLimiter);
app.use('/api/auth/rider/login', authLimiter);
app.use('/api/auth/insurer/login', authLimiter);

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'shieldride-api',
    db: {
      mode: dbRuntime.mode,
      target: dbRuntime.target,
      persistent: dbRuntime.persistent,
      readyState: mongoose.connection.readyState,
    },
  });
});

app.post('/api/auth/rider/signup', async (req, res) => {
  try {
    const { name, mobile, password, plan = 'standard', location, hubId, partnerId = '' } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ error: 'Name, mobile, and password are required' });
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password should be at least 6 characters' });
    }

    const exists = await Rider.findOne({ mobile });
    if (exists) {
      return res.status(409).json({ error: 'Rider already exists. Please sign in.' });
    }

    const weather = location?.lat && location?.lng
      ? await fetchWeatherSignals(location.lat, location.lng)
      : { rainProbability: 35, maxTempC: 31, maxWindKmh: 18, maxUv: 7 };

    const quote = calculateDynamicQuote({ plan, weather, hoursPerDay: 8 });

    let darkStore = '';
    let zone = '';
    if (hubId) {
      const hub = await Hub.findById(hubId);
      if (hub) {
        darkStore = `${hub.code}, ${hub.name}`;
        zone = hub.zone;
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const rider = await Rider.create({
      name,
      mobile,
      passwordHash,
      plan,
      dailyPremium: quote.dailyPremium,
      weeklyPremium: quote.weeklyPremium,
      dailyCoverage: quote.dailyCoverage,
      partnerId,
      hubId: hubId || null,
      darkStore,
      zone,
      location: {
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
      },
    });

    const token = signToken({ id: rider._id.toString(), role: 'rider' });
    return res.status(201).json({ token, user: serializeRider(rider) });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to sign up rider' });
  }
});

app.post('/api/auth/rider/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const rider = await Rider.findOne({ mobile });
    if (!rider) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, rider.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({ id: rider._id.toString(), role: 'rider' });
    return res.json({ token, user: serializeRider(rider) });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to sign in rider' });
  }
});

app.post('/api/auth/insurer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const insurer = await Insurer.findOne({ email: String(email).toLowerCase() });
    if (!insurer) {
      return res.status(401).json({ error: 'Invalid insurer credentials' });
    }

    const ok = await bcrypt.compare(password, insurer.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid insurer credentials' });
    }

    const token = signToken({ id: insurer._id.toString(), role: 'insurer' });
    return res.json({ token, user: serializeInsurer(insurer) });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to sign in insurer' });
  }
});

app.get('/api/auth/me', authRequired, async (req, res) => {
  try {
    if (req.auth.role === 'rider') {
      const rider = await Rider.findById(req.auth.id).populate('hubId');
      if (!rider) return res.status(404).json({ error: 'Rider not found' });
      return res.json({ user: serializeRider(rider) });
    }

    const insurer = await Insurer.findById(req.auth.id);
    if (!insurer) return res.status(404).json({ error: 'Insurer not found' });
    return res.json({ user: serializeInsurer(insurer) });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to fetch profile' });
  }
});

app.get('/api/hubs/nearby', async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const hubs = await Hub.find().lean();
    const sorted = hubs
      .map((hub) => ({
        ...hub,
        distanceKm: Number(haversineDistanceKm(lat, lng, hub.lat, hub.lng).toFixed(2)),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 6);

    return res.json({ hubs: sorted });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to fetch nearby hubs' });
  }
});

app.post('/api/rider/hub', authRequired, requireRole('rider'), async (req, res) => {
  try {
    const { hubId, lat, lng } = req.body;
    const rider = await Rider.findById(req.auth.id);
    if (!rider) return res.status(404).json({ error: 'Rider not found' });

    const hub = await Hub.findById(hubId);
    if (!hub) return res.status(404).json({ error: 'Hub not found' });

    rider.hubId = hub._id;
    rider.darkStore = `${hub.code}, ${hub.name}`;
    rider.zone = hub.zone;

    if (Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
      rider.location = { lat: Number(lat), lng: Number(lng) };
    }

    await rider.save();
    return res.json({ user: serializeRider(rider) });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to select hub' });
  }
});

app.post('/api/pricing/quote', async (req, res) => {
  try {
    const { plan = 'standard', lat, lng, hoursPerDay = 8 } = req.body;
    if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) {
      return res.status(400).json({ error: 'lat and lng are required for dynamic pricing' });
    }

    const weather = await fetchWeatherSignals(Number(lat), Number(lng));
    const quote = calculateDynamicQuote({
      plan,
      weather,
      hoursPerDay: Number(hoursPerDay) || 8,
    });

    return res.json({ quote });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to generate quote' });
  }
});

app.get('/api/dashboard/rider', authRequired, requireRole('rider'), async (req, res) => {
  try {
    const rider = await Rider.findById(req.auth.id).populate('hubId');
    if (!rider) return res.status(404).json({ error: 'Rider not found' });

    const lat = rider.location?.lat;
    const lng = rider.location?.lng;
    const weather = Number.isFinite(lat) && Number.isFinite(lng)
      ? await fetchWeatherSignals(lat, lng)
      : { rainProbability: 0, maxTempC: 0, maxWindKmh: 0, maxUv: 0 };

    const triggers = generateTriggers(weather);
    const claims = triggers
      .filter((t) => t.payout > 0)
      .map((t, idx) => ({
        id: `SHR-${Date.now()}-${idx + 1}`,
        triggerType: t.type,
        amount: t.payout,
        status: t.status === 'active' ? 'processing' : 'credited',
        date: new Date().toLocaleString(),
        description: t.description,
      }));

    return res.json({
      user: serializeRider(rider),
      weather,
      triggers,
      claims,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to load rider dashboard' });
  }
});

app.get('/api/dashboard/insurer', authRequired, requireRole('insurer'), async (_req, res) => {
  try {
    const riders = await Rider.find().populate('hubId').sort({ createdAt: -1 }).lean();

    let totalClaims = 0;
    let paidAmount = 0;

    const riderViews = await Promise.all(
      riders.map(async (rider) => {
        const lat = rider.location?.lat;
        const lng = rider.location?.lng;

        let weather = { rainProbability: 0, maxTempC: 0, maxWindKmh: 0, maxUv: 0 };
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          try {
            weather = await fetchWeatherSignals(lat, lng);
          } catch {
            // Keep fallback values if weather API fails for a rider.
          }
        }

        const triggers = generateTriggers(weather);
        const payouts = triggers.filter((t) => t.payout > 0).map((t) => t.payout);
        totalClaims += payouts.length;
        paidAmount += payouts.reduce((sum, amount) => sum + amount, 0);

        return {
          id: rider._id.toString(),
          name: rider.name,
          mobile: rider.mobile,
          plan: rider.plan,
          weeklyPremium: rider.weeklyPremium,
          darkStore: rider.darkStore,
          zone: rider.zone,
          createdAt: rider.createdAt,
          riskScore: Math.round((weather.rainProbability * 0.4 + weather.maxTempC + weather.maxWindKmh * 0.6) / 2),
        };
      }),
    );

    const totalPolicies = riderViews.length;
    const activePolicies = riderViews.filter((r) => r.plan).length;

    const claimsByTypeMap = new Map();
    for (const rider of riderViews) {
      const key = rider.plan || 'standard';
      const current = claimsByTypeMap.get(key) || { type: key, count: 0, amount: 0 };
      current.count += 1;
      current.amount += rider.weeklyPremium;
      claimsByTypeMap.set(key, current);
    }

    const metrics = {
      totalPolicies,
      activePolicies,
      totalClaims,
      pendingClaims: Math.max(0, Math.round(totalClaims * 0.1)),
      lossRatio: totalPolicies === 0 ? 0 : Number(((paidAmount / Math.max(1, riderViews.reduce((sum, r) => sum + r.weeklyPremium, 0))) * 100).toFixed(1)),
      reserveAmount: Math.round(paidAmount * 1.4),
      projectedReserve: Math.round(paidAmount * 1.9),
      fraudScoreAvg: riderViews.length === 0 ? 0 : Math.round(riderViews.reduce((sum, r) => sum + Math.min(95, Math.max(5, r.riskScore)), 0) / riderViews.length),
      claimsByType: Array.from(claimsByTypeMap.values()),
    };

    const fraudAlerts = riderViews
      .filter((r) => r.riskScore > 55)
      .slice(0, 8)
      .map((r, idx) => ({
        id: `F-${idx + 1}`,
        userName: r.name,
        riskLevel: r.riskScore > 75 ? 'high' : 'medium',
        score: r.riskScore,
        timestamp: new Date().toISOString(),
        reasons: [
          'High disruption score in active zone',
          'Frequent trigger window overlaps',
        ],
        claimId: `SHR-${new Date().getFullYear()}-${1000 + idx}`,
      }));

    return res.json({
      metrics,
      riders: riderViews,
      fraudAlerts,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to load insurer dashboard' });
  }
});

app.use((err, _req, res, _next) => {
  if (err?.type === 'entity.too.large' || err?.status === 413) {
    return res.status(413).json({
      error: 'Payload too large',
      maxJsonSize: API_JSON_LIMIT,
      maxUrlEncodedSize: API_URLENCODED_LIMIT,
    });
  }

  return res.status(500).json({ error: err.message || 'Unexpected server error' });
});

async function start() {
  const candidateUris = buildMongoCandidates();
  let connected = false;

  if (MONGODB_MODE !== 'memory') {
    for (const candidate of candidateUris) {
      try {
        await mongoose.connect(candidate.uri, { serverSelectionTimeoutMS: 5000 });
        dbRuntime.mode = candidate.mode;
        dbRuntime.target = candidate.target;
        dbRuntime.persistent = candidate.mode !== 'memory';
        console.log(`Connected to MongoDB (${candidate.target}).`);
        connected = true;
        break;
      } catch (error) {
        console.warn(`MongoDB connection failed for ${candidate.target}: ${error.message}`);
      }
    }
  }

  if (!connected) {
    const shouldUseMemoryFallback =
      MONGODB_MODE === 'memory' ||
      MONGODB_FALLBACK_MODE === 'memory' ||
      shouldUseImplicitMemoryFallback(candidateUris.length > 0);

    if (shouldUseMemoryFallback) {
      if (MONGODB_MODE !== 'memory' && MONGODB_FALLBACK_MODE !== 'memory') {
        console.warn(
          'Persistent MongoDB unavailable. Using in-memory MongoDB fallback for non-production runtime.',
        );
      }

      memoryMongo = await MongoMemoryServer.create({ instance: { dbName: 'shieldride' } });
      await mongoose.connect(memoryMongo.getUri());
      dbRuntime.mode = 'memory';
      dbRuntime.target = 'embedded-memory';
      dbRuntime.persistent = false;
      console.log('Connected to in-memory MongoDB fallback.');
      connected = true;
    }
  }

  if (!connected) {
    throw new Error(
      'Unable to connect to persistent MongoDB. Configure MONGODB_MODE with reachable local/Atlas URI or set MONGODB_FALLBACK_MODE=memory.',
    );
  }

  await seedDefaults();

  app.listen(PORT, () => {
    console.log(`ShieldRide API running at http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start API server:', error.message);
  process.exit(1);
});

async function shutdown() {
  await mongoose.connection.close();
  if (memoryMongo) {
    await memoryMongo.stop();
  }
}

process.on('SIGINT', async () => {
  await shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await shutdown();
  process.exit(0);
});

function signToken(payload) {
  return signAppToken(payload);
}

function buildAllowedOrigins() {
  const configuredOrigins = String(process.env.CORS_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (configuredOrigins.length > 0) {
    return new Set(configuredOrigins);
  }

  if (NODE_ENV === 'production') {
    return new Set();
  }

  return new Set([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ]);
}

function shouldUseImplicitMemoryFallback(hasPersistentCandidates) {
  if (NODE_ENV === 'production') {
    return false;
  }

  if (DEV_IMPLICIT_MEMORY_FALLBACK === 'off') {
    return false;
  }

  return hasPersistentCandidates || MONGODB_MODE === 'atlas';
}

function buildMongoCandidates() {
  const candidates = [];
  const overrideUri = process.env.MONGODB_URI;

  if (overrideUri) {
    candidates.push({
      mode: overrideUri.startsWith('mongodb+srv://') ? 'atlas' : 'local',
      target: 'override-uri',
      uri: overrideUri,
    });
  }

  if (MONGODB_MODE === 'auto' || MONGODB_MODE === 'local') {
    candidates.push({ mode: 'local', target: 'local-uri', uri: MONGODB_LOCAL_URI });
  }

  if ((MONGODB_MODE === 'auto' || MONGODB_MODE === 'atlas') && MONGODB_ATLAS_URI) {
    candidates.push({ mode: 'atlas', target: 'atlas-uri', uri: MONGODB_ATLAS_URI });
  }

  return dedupeCandidates(candidates.filter((candidate) => Boolean(candidate.uri)));
}

function dedupeCandidates(candidates) {
  const seen = new Set();
  const unique = [];

  for (const candidate of candidates) {
    if (seen.has(candidate.uri)) continue;
    seen.add(candidate.uri);
    unique.push(candidate);
  }

  return unique;
}

function serializeRider(riderDoc) {
  const rider = riderDoc.toObject ? riderDoc.toObject() : riderDoc;
  return {
    id: rider._id?.toString?.() || rider.id,
    role: 'rider',
    name: rider.name,
    mobile: rider.mobile,
    plan: rider.plan,
    dailyPremium: rider.dailyPremium,
    weeklyPremium: rider.weeklyPremium,
    coverageAmount: rider.dailyCoverage,
    darkStore: rider.darkStore,
    zone: rider.zone,
    partnerId: rider.partnerId,
    location: rider.location,
    shieldStatus: rider.shieldStatus,
    createdAt: rider.createdAt,
  };
}

function serializeInsurer(insurerDoc) {
  const insurer = insurerDoc.toObject ? insurerDoc.toObject() : insurerDoc;
  return {
    id: insurer._id?.toString?.() || insurer.id,
    role: 'insurer',
    name: insurer.name,
    email: insurer.email,
    createdAt: insurer.createdAt,
  };
}
