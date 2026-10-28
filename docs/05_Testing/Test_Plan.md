# Software Test Plan

## 1. Purpose
Define how SPMS requirements will be verified and how test results will be recorded.

## 2. Scope
Test account management, authorization, slot browsing, reservation creation/conflict prevention, cancellation, admin configuration, check-in/check-out, fee calculation, reports, input validation, and error handling.

## 3. Test approach
- Unit tests: validation and fee-calculation functions.
- API/integration tests: endpoints, authentication, authorization, and database behavior.
- End-to-end/manual tests: major driver and administrator journeys.
- Security-focused tests: invalid credentials, role escalation, object ownership, malformed input.
- Regression tests: rerun critical cases after fixes.

## 4. Test environment
Record actual details:
- OS/browser: [Actual environment]
- Runtime/framework versions: [Actual versions]
- Database: [Actual database/version]
- Test dataset: [Description]
- Build/commit: [Commit hash or version]

## 5. Entry criteria
- Requirements and test cases reviewed.
- Test environment configured.
- Test accounts and parking slots available.
- Test build deploys without blocking errors.

## 6. Exit criteria
- All critical test cases executed.
- All critical/high-severity defects resolved or explicitly accepted.
- Results recorded with evidence where possible.
- Requirement traceability updated.
- Known limitations listed in the final report.

## 7. Test data
Use fictional names, emails, vehicle numbers, and reservation dates. Never use real passwords or sensitive personal information in test evidence.

## 8. Defect severity
- Critical: core system unavailable, major data loss, or severe security failure.
- High: core reservation or authorization workflow incorrect.
- Medium: feature partly fails with a workaround.
- Low: cosmetic or minor usability issue.

## 9. Test deliverables
Test case list, execution results, screenshots/logs, defect reports, and updated requirements traceability matrix.
