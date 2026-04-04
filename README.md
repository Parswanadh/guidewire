# ShieldRide - AI Income Protection Platform

ShieldRide is a full-stack parametric insurance platform for delivery riders with:
- separate rider and insurer login flows
- GPS-based hub assignment
- dynamic weather-aware premium calculation
- MongoDB-backed rider onboarding and insurer operations dashboard
- multilingual voice assistant powered by Sarvam APIs

## Current Architecture

### Frontend
- Vite + React 19 + TypeScript
- Tailwind CSS + reusable UI components
- Mobile-first rider onboarding and dashboard UX

### Backend
- Express API server (`server/index.js`)
- JWT-based authentication
- Role-aware access control (`rider` and `insurer`)

### Database
- MongoDB (via Mongoose)
- Rider, Insurer, and Hub collections

### External APIs
- Open-Meteo API for live weather signals used in dynamic pricing and trigger generation
- Sarvam Saaras/Bulbul endpoints for STT/TTS in voice assistant

## Features Implemented

1. Rider signup + signin (with rider name capture)
2. Separate insurer signin route
3. Persistent login sessions via JWT + local storage
4. GPS detection and nearest local hub selection
5. Dynamic plan pricing (`basic`, `standard`, `premium`) based on weather and work hours
6. MongoDB persistence for rider onboarding data
7. Insurer dashboard receives newly signed-up riders from DB immediately
8. API-backed rider/insurer dashboards (no static auth or hardcoded onboarding)

## Local Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` from template values in `.env.example`.

3. Pick MongoDB runtime mode in `.env`:
```env
MONGODB_MODE=auto
MONGODB_LOCAL_URI=mongodb://127.0.0.1:27017/shieldride
MONGODB_ATLAS_URI=
MONGODB_FALLBACK_MODE=off
```

Recommended for persistent demo data:
- Use `MONGODB_MODE=local` if local MongoDB is installed and running.
- Use `MONGODB_MODE=atlas` and set `MONGODB_ATLAS_URI` for MongoDB Atlas.
- Keep `MONGODB_FALLBACK_MODE=off` to enforce persistent DB only.

Emergency fallback (non-persistent):
- Set `MONGODB_FALLBACK_MODE=memory` only if local/Atlas is unavailable during demo.

4. Start full stack (frontend + API server):
```bash
npm run dev
```

5. Open app:
- Frontend: `http://localhost:3000`
- API health: `http://localhost:4000/api/health`

## Environment Variables

### Frontend
- `VITE_API_BASE_URL`
- `VITE_SARVAM_API_KEY`
- `VITE_SARVAM_STT_URL`
- `VITE_SARVAM_TTS_URL`

### Backend
- `MONGODB_MODE` (`auto`, `local`, `atlas`, `memory`)
- `MONGODB_LOCAL_URI`
- `MONGODB_ATLAS_URI`
- `MONGODB_URI` (optional direct override)
- `MONGODB_FALLBACK_MODE` (`off` or `memory`)
- `DEV_IMPLICIT_MEMORY_FALLBACK` (`on` or `off` for non-production fallback behavior)
- `JWT_SECRET`
- `CORS_ORIGINS` (comma-separated allowlist for credentialed CORS)
- `AUTH_RATE_LIMIT_WINDOW_MS`
- `AUTH_RATE_LIMIT_MAX`
- `WEATHER_TIMEOUT_MS`
- `API_PORT`
- `API_JSON_LIMIT`
- `API_URLENCODED_LIMIT`
- `INSURER_EMAIL`
- `INSURER_PASSWORD`

## Default Insurer Login

If no insurer exists, one is auto-seeded on API startup:
- Email: `insurer@shieldride.ai`
- Password: `Insurer@123`

(Override with `INSURER_EMAIL` and `INSURER_PASSWORD` in `.env`.)

## API Surface (Key Endpoints)

- `POST /api/auth/rider/signup`
- `POST /api/auth/rider/login`
- `POST /api/auth/insurer/login`
- `GET /api/auth/me`
- `GET /api/hubs/nearby?lat=...&lng=...`
- `POST /api/rider/hub`
- `POST /api/pricing/quote`
- `GET /api/dashboard/rider`
- `GET /api/dashboard/insurer`

## MCP Configuration

Workspace MCP configuration is available at:
- `.vscode/mcp.json`
- `.vscode/mcp.env.example`

Included MCP servers now also include:
- Sequential Thinking MCP (`@modelcontextprotocol/server-sequential-thinking`)

PostgreSQL MCP is intentionally excluded as requested (no Docker/Postgres dependency in current setup).

## Test and Build

```bash
npm run build
npm run test:quality
npm run test:smoke:api
```

Optional Playwright suite (not required for regular backend smoke validation):

```bash
npm run test:smoke:ui
npm run test
```

## CI Quality Gates

GitHub Actions workflow is available at:
- `.github/workflows/quality.yml`

Pipeline stages:
1. Build + full quality suite (`test:quality`)
2. API smoke (`test:smoke:api`) + minimal UI smoke (`test:smoke:ui`)

CI uses a MongoDB service container with deterministic local-mode settings to keep runs stable and reproducible.

## Notes

- Dynamic pricing and dashboard triggers use live weather input where location is available.
- Health endpoint now reports DB mode and persistence status for demo verification (`/api/health`).
- Backend supports persistent local and Atlas MongoDB modes; memory mode is optional fallback only.
- For non-production resilience, startup can auto-fallback to in-memory MongoDB when persistent DB is unavailable (configurable via `DEV_IMPLICIT_MEMORY_FALLBACK`).
- API payload limits are configurable to reduce 413 issues (`API_JSON_LIMIT`, `API_URLENCODED_LIMIT`).
- Auth endpoints are rate-limited and CORS is allowlist-driven through environment configuration.
- Sarvam STT/TTS requires valid API credentials. If credentials are missing or endpoint payload format differs, voice transcription/synthesis will return runtime errors and should be validated against your Sarvam account configuration.
