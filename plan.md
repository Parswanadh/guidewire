# ShieldRide Master Execution Plan (DevTrails 2026)

Date: 2026-04-04
Status: Active Delivery Plan
Scope: Product quality, humane SOTA design, reliability hardening, and demo readiness.

## 1) Executive Status

ShieldRide has crossed the MVP threshold and is now in polish-and-proof phase.

Current truth:
1. Backend auth, role separation, dynamic pricing, and hub assignment are implemented.
2. MongoDB Atlas is connected and persistent runtime is active.
3. API payload controls and explicit 413 handling are implemented.
4. Terminal-only smoke testing is in place and passing.

Primary objective now:
1. Upgrade the experience from functional MVP to premium, humane, judge-ready product quality.

## 2) Product Positioning

Working one-liner:
1. ShieldRide is a dual-persona parametric income protection system that gives riders confidence and gives insurers operational clarity.

Differentiation priority:
1. Not just trigger payouts.
2. Explainable, auditable, multilingual insurer operations with human-centered rider UX.

## 3) Hard Requirement Scorecard

Completed:
1. Separate rider and insurer login.
2. Rider signup captures name and persists account.
3. GPS-based nearest hub selection.
4. Dynamic pricing based on location/weather context.
5. Rider data appears on insurer dashboard.
6. Persistent MongoDB runtime on Atlas.
7. Controlled 413 behavior for oversized payloads.

In progress (quality layer):
1. Advanced humane visual language.
2. Decision-grade insurer cockpit information architecture.
3. Explainability overlays for trigger/payout decisions.
4. P1 shared-primitives tokenization implemented and validated via build + quality suite.
5. Rider explainability panel and insurer provenance/action framing implemented and validated.

## 4) Technical Baseline

Frontend:
1. React + TypeScript + Vite + Tailwind + Framer Motion.

Backend:
1. Express + Mongoose + JWT + bcrypt + role middleware.

Persistence:
1. Atlas mode enabled.
2. Local and memory modes still available by env for fallback scenarios.

Operational safety:
1. API size limits configured via env.
2. Explicit JSON response for 413 errors.

## 5) SOTA Humane Design Blueprint

### 5.1 North Star Principles

1. Human confidence first: every critical state answers what happened, why, and what next.
2. Calm precision: insurer surfaces should feel credible, not flashy.
3. Intentional motion: animation communicates hierarchy/state, never decoration alone.
4. Role-specific empathy: rider copy reassures; insurer copy supports decisions.

### 5.2 Anti-Generic Guardrails

1. No repetitive template cards without semantic purpose.
2. No default monotone gradient treatment across all screens.
3. No jargon-only copy in rider journey.
4. No ambiguous error states without recovery guidance.
5. No analytics block without operational implication.

### 5.3 Design System Targets

1. Tokenized color system by semantic state (normal, warning, critical, resolved).
2. Typography pair with clear display/body scale for mobile and dense dashboards.
3. Unified spacing/elevation/radius conventions.
4. Motion durations standardized:
   - micro transitions: 120-180ms
   - context transitions: 220-300ms
5. Accessibility baseline:
   - visible focus states
   - contrast-safe text surfaces
   - keyboard path sanity for core flows

## 6) Phased Delivery Plan

### Phase P0: Baseline Lock (0.5 day)

Tasks:
1. Freeze current screenshots and API outputs.
2. Finalize token map and component inventory.
3. Define acceptance metrics per screen.

Exit criteria:
1. Baseline documented and reproducible.

### Phase P1: Foundation Refactor (1 day)

Tasks:
1. Apply semantic tokens across shared UI primitives.
2. Standardize typography hierarchy.
3. Normalize spacing/density and component rhythm.

Exit criteria:
1. Shared components consume semantic tokens only.
2. Visual consistency improved across all key screens.

### Phase P2: Rider Humane Journey (1-1.5 days)

Tasks:
1. Improve onboarding language and confidence cues.
2. Make location/hub step clearer with rationale and editability.
3. Redesign rider home for rapid trust scan:
   - shield status
   - active risk context
   - payout timeline clarity

Exit criteria:
1. New rider can complete flow with minimal confusion.
2. Policy status readability under 5 seconds.

### Phase P3: Insurer Cockpit Upgrade (1.5-2 days)

Tasks:
1. Recompose dashboard into decision modules:
   - portfolio health
   - rider stream
   - anomaly/fraud feed
   - reserve intelligence
2. Add module-level provenance labels.
3. Add clearer action hints from each metric block.

Exit criteria:
1. Each module answers a concrete decision question.
2. Risk-to-action path is concise and obvious.

### Phase P4: Explainability and Trust Layer (1 day)

Tasks:
1. Add why-trigger-fired panel.
2. Add why-payout-calculated panel.
3. Add confidence and fallback notes when external signals are partial.

Exit criteria:
1. No critical payout/trigger state is opaque.

### Phase P5: Demo Polish and Hardening (0.5-1 day)

Tasks:
1. Copy polish pass for all primary screens.
2. Motion reduction pass on high-risk states.
3. Performance sanity pass on mobile profile.
4. Final demo flow rehearsal.

Exit criteria:
1. End-to-end demo runs cleanly without manual hacks.

### Phase P6: SOTA Quality Engineering Track (Parallel, 1.5-2 days)

Tasks:
1. Establish layered testing architecture across static, unit, integration, contract, resilience, performance, accessibility, and security scopes.
2. Create deterministic fixtures and seeded data profiles for repeatable runs.
3. Define PR, merge, and release quality gates with auditable pass/fail criteria.
4. Publish evidence bundle artifacts for demo and judge credibility.

Exit criteria:
1. Quality gates pass consistently across two consecutive runs.
2. Release evidence bundle is complete and reproducible.

## 7) SOTA Testing and Reliability Program

### 7.1 Layered Testing Architecture

L0: Static quality and correctness
1. ESLint and TypeScript strict checks.
2. Dependency vulnerability scan and license sanity checks.

L1: Unit tests
1. Backend domain logic: pricing, trigger generation, geo distance, auth helpers.
2. Frontend UI logic: form validation, role guards, tab state transitions.

L2: Integration and contract tests
1. API integration tests with deterministic fixtures and isolated database profile.
2. Contract assertions for request/response schemas on auth, hubs, pricing, and dashboards.
3. Backward compatibility checks for critical response fields consumed by frontend.

L3: Workflow smoke tests
1. Terminal-first API smoke remains the primary fast gate.
2. Browser automation stays intentionally minimal:
   - insurer login -> home
   - rider login/signup critical path
   - no Playwright-heavy exploratory matrix by default

L4: Non-functional quality tests
1. Resilience and chaos-lite scenarios.
2. Performance budget checks on API and client bundle.
3. Accessibility automation for critical paths.
4. Security regression checks.

### 7.2 Gate Model (PR -> Merge -> Release)

PR gates (fast, mandatory):
1. L0 checks must pass.
2. L1 suites must pass.
3. L2 contract smoke must pass for changed endpoints.

Merge gates (stability, mandatory):
1. API smoke suite must pass.
2. Atlas health gate must pass (db.mode=atlas, persistent=true).
3. Accessibility checks for changed screens must pass.
4. Security baseline must not introduce new high severity issues.

Release gates (demo-grade, mandatory):
1. Resilience suite pass for predefined failure scenarios.
2. Performance budgets pass (API p95 and client load budget).
3. Minimal Playwright sanity pass with zero HTTP 413 observations.
4. End-to-end demo rehearsal pass from clean startup.

### 7.3 Minimal Playwright Policy (Constraint Aware)

1. Playwright is limited to deterministic, high-value smoke flows.
2. Heavy browser matrices are excluded from default release path.
3. Every Playwright run records:
   - console error count
   - HTTP 413 count
   - final route and role-state confirmation

### 7.4 Payload and 413 Robustness Suite

1. Positive test: under-limit payloads must succeed.
2. Negative test: oversized payloads must return deterministic JSON 413.
3. Abuse test: repeated oversized payloads must not degrade API health endpoint behavior.
4. Regression evidence must capture status code and exact response shape.

### 7.5 Resilience and Chaos-Lite Matrix

1. Weather API unavailable: pricing and dashboard fallback behavior remains clear.
2. Temporary Mongo connectivity issue: API returns deterministic error semantics.
3. Token expiry and invalid token: auth endpoints reject correctly and safely.
4. Partial external data: explainability surfaces confidence/fallback notes.

### 7.6 Security Test Layer

1. Auth boundary tests for role misuse (rider attempting insurer endpoints and vice versa).
2. JWT tampering and expiration checks.
3. Input validation tests for auth and pricing payloads.
4. Dependency vulnerability checks tracked with remediation SLAs.

### 7.7 Performance and Accessibility Budgets

1. API target budget: stable p95 response for critical endpoints under smoke load.
2. Frontend target budget: maintain responsive first interaction on mid-tier mobile profile.
3. Accessibility target: zero critical violations in rider and insurer critical journeys.

### 7.8 Quality KPIs

1. Flaky test rate under 1% across CI runs.
2. Critical-path test pass rate at 100% before release.
3. Zero unresolved critical accessibility findings.
4. Zero unresolved high-severity security findings at release cut.
5. Controlled 413 behavior verified in every release candidate.

### 7.9 Operating Command Set

Current operating commands:
1. npm run build
2. npm run start:server
3. npm run test:smoke:api

Implemented command additions for SOTA track:
1. npm run test:unit
2. npm run test:integration
3. npm run test:contract
4. npm run test:resilience
5. npm run test:a11y
6. npm run test:security
7. npm run test:performance
8. npm run test:quality
9. npm run test:smoke:ui

## 8) Demo Script Plan (3 Minutes)

1. Problem framing (15s): delivery riders face unpredictable risk and income shocks.
2. Rider flow (45s): signup, hub detection, policy confidence, live trigger context.
3. Insurer flow (60s): portfolio view, rider feed, reserve/fraud insights.
4. Explainability (30s): why-trigger and why-payout clarity.
5. Technical credibility (20s): Atlas persistence, API resilience, 413-safe behavior.
6. Outcome close (10s): faster trust decisions for both riders and insurers.

## 9) Risks and Mitigations

Risk 1: UI still feels template-like.
1. Mitigation: enforce anti-generic guardrails and module-level copy ownership.

Risk 2: Demo inconsistency due to environment drift.
1. Mitigation: use fixed env profile and terminal smoke checks before demo.

Risk 3: External API variability.
1. Mitigation: graceful fallback messaging and confidence indicators.

Risk 4: Payload spikes causing noisy failures.
1. Mitigation: keep parser limits explicit and return deterministic 413 JSON.

Risk 5: False confidence from narrow test coverage.
1. Mitigation: enforce layered gates and evidence bundle before release approval.

## 10) Definition of Done

A release candidate is considered done when all conditions below are true:
1. Atlas mode is active and stable.
2. Rider and insurer critical journeys are fully functional.
3. Humane design pass is visible and consistent.
4. Explainability layer exists for trigger/payout trust.
5. Build and static quality checks pass.
6. Unit, integration, and contract suites pass for changed surfaces.
7. Resilience and accessibility gates pass for critical journeys.
8. Security baseline has no unresolved high severity findings.
9. 413 behavior is controlled, tested, and documented.
10. Minimal Playwright smoke shows zero console errors and zero 413 responses on critical flow.
11. Evidence bundle is attached (health output, smoke output, payload test output, and test summary).
12. Demo can be run from a clean startup sequence without emergency fixes.

## 11) Next 72-Hour Execution Queue

Day 1:
1. Complete P1 foundation refactor.
2. Start P2 onboarding and rider home polish.
3. Establish testing baseline harness (L0/L1/L2 skeleton + CI gate definition).

Day 2:
1. Complete P2.
2. Execute P3 insurer cockpit restructure.
3. Implement resilience, accessibility, and security baseline checks.

Day 3:
1. Complete P4 explainability overlays.
2. Run P5 polish, hardening, and final demo rehearsal.
3. Run P6 release-gate suite and publish evidence bundle.

## 12) MCP Stack Alignment

Active priority tools:
1. Filesystem MCP for safe refactors.
2. Git MCP for change tracking.
3. Sequential Thinking MCP for deep, iterative planning and test strategy synthesis.
4. Shell/Terminal-driven validation over Playwright-heavy workflows.

Note:
1. Playwright remains optional and non-blocking for this plan.

## 13) Sequential Thinking Synthesis (Maximum-Depth Pass)

Method executed:
1. 12-step sequential analysis pass was used to derive testing architecture and release governance.

Key outputs integrated into this plan:
1. Layered testing architecture (L0-L4) with explicit ownership.
2. Risk-tiered gate model (PR, merge, release).
3. Constraint-aware Playwright policy (minimal critical-path smoke only).
4. Dedicated payload robustness and deterministic 413 regression suite.
5. Resilience, security, accessibility, and performance tracks with measurable KPIs.
6. Expanded definition of done with auditable evidence requirements.

## 14) Execution Update (2026-04-04, Final Hardening Pass)

Completed in this pass:
1. Added GitHub Actions quality pipeline at `.github/workflows/quality.yml` with two gates:
   - build + full `test:quality` suite
   - API smoke + minimal Playwright UI smoke
2. Added MongoDB service wiring in CI so tests run on persistent local-mode Mongo (`MONGODB_MODE=local`) without memory fallback drift.
3. Upgraded typography system to a display/body split with locale-aware fonts:
   - English: Sora + Manrope
   - Hindi: Noto Sans Devanagari + Mukta
   - Kannada: Noto Sans Kannada + Tiro Kannada
4. Applied atmosphere and visual token uplift across rider/insurer auth and dashboard shells.
5. Removed deprecated and broken PWA metadata/assets that produced browser warnings:
   - replaced deprecated mobile meta usage
   - aligned icon/manifest references to existing SVG assets
   - refreshed PWA icon palette to current brand direction
6. Improved form semantics to reduce autofill/accessibility warnings:
   - label-input linking
   - sensible `autocomplete` defaults and explicit auth field hints

Validation evidence (this pass):
1. `npm run build` passed.
2. `npm run test:quality` passed (unit/integration/contract/resilience/security/performance/a11y).
3. `npm run test:smoke:api` passed.
4. `npm run test:smoke:ui` passed (2/2).
