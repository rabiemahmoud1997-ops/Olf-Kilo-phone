# OLF Landscape-Design Product — Implementation Plan (Slice 0 complete)

## Context
Empty repository (no commits, no tracked files, no code/config/tests). All spec requirements are **missing**. Node/npm available; python3 absent. No baseline checks runnable.

## Decision (default, reversible)
Stack: **TypeScript + Vitest + ESLint + tsc**, Node runtime. Assumed because node/npm present and python absent; user may override before Slice 1.

## Slices (execute in order; each has gate before next)

1. **Scaffold + baseline**: package.json, tsconfig, eslint, vitest; empty passing tests. Gate: `npm test`, `npm run lint`, `npm run typecheck` pass.
2. **Domain model/contracts/versioning**: entities Project, Site, AssetCatalog, DesignObject, Constraint, AnalysisRun, Variant, Metric, Schedule, ExportJob; stable IDs; provenance; serialization + migration tests; preserve sample old project.
3. **Site Analysis input validation**: CRS/units checks, clear diagnostics, reject/warn on missing CRS.
4. **Slope/aspect on small fixture**: reference comparison, legend, supported output only.
5. **User catalog adapter**: read/validate/save cycle.
6. **Disciplines (one slice each)**: Planting → Site/Hardscape+RefNotes → grading → Details → Irrigation. Irrigation construction-grade calc deferred if specs missing.
7. **Variant/constraint/metric/provenance contracts**: stable IDs, hard vs soft separation.
8. **First bounded deterministic generator**: plant/cover allocation in eligible zones.
9. **Ranking/comparison/Pareto**: two-objective trade-off tests; infeasible cannot outrank feasible.
10. **One supported export adapter**: round-trip, field-loss, unit, CRS tests.
11. **Further integrations**: one at a time, proven SDK/license/test env or recorded blocker.

## Commit policy (user requirement)
After each successful slice gate, create a git commit summarizing that slice (changed files, tests/results). No commits for failed/partial slices. Do not push unless explicitly requested. Never commit secrets. Use a concise commit message matching repo style. If commit hooks fail, fix and create a new commit (do not amend).
- No silent reproject/overwrite/drop fields; unknown units rejected.
- Missing data = `unknown`, never zero.
- Analytical results store algorithm version, source IDs, parameters, units/CRS, warnings, input hash.
- Variants separate until explicit acceptance.
- No proprietary Land F/X/Finch content or claimed integrations without proof.

## Validation per slice
Run slice tests + relevant lint/typecheck; compare with baseline; no new regressions. On failure, fix before next slice.

## Open questions
- Confirm stack choice (default TS).
- Jurisdiction/regulatory standards not provided → out of scope until user supplies source/version/geography.
- Network-dependent data sources deferred.
- Irrigation construction-grade calculations require verified specs + professional review.