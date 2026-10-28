# Test Cases and Results

**Important:** The expected results below are proposed. Fill the Actual Result and Status columns only after running the tests against your application.

| Test ID | Requirement | Test scenario / steps | Expected result | Actual result | Status |
|---|---|---|---|---|---|
| TC-01 | FR-01 | Register with valid unused email and valid fields | Account is created | [Fill after test] | Not Run |
| TC-02 | FR-01 | Register with an email already in use | Duplicate registration rejected | [Fill after test] | Not Run |
| TC-03 | FR-02 | Login with correct credentials | User is authenticated | [Fill after test] | Not Run |
| TC-04 | FR-02 | Login with incorrect password | Login rejected without revealing sensitive detail | [Fill after test] | Not Run |
| TC-05 | FR-03 | Normal user calls an admin endpoint | Request denied (e.g. 403) | [Fill after test] | Not Run |
| TC-06 | FR-04 | Open active parking lot and slots | Slot list and status are displayed | [Fill after test] | Not Run |
| TC-07 | FR-06 | Reserve active, available slot with start before end | Reservation is created | [Fill after test] | Not Run |
| TC-08 | FR-06 | Submit end time earlier than start time | Request rejected with validation error | [Fill after test] | Not Run |
| TC-09 | FR-07 | Create overlapping reservation for same slot | Second reservation rejected as conflict | [Fill after test] | Not Run |
| TC-10 | FR-07 | Reserve same slot for a non-overlapping time | Reservation may be accepted if all rules pass | [Fill after test] | Not Run |
| TC-11 | FR-08 | User attempts to view another user's reservation | Access denied or record not disclosed | [Fill after test] | Not Run |
| TC-12 | FR-09 | Owner cancels eligible reservation | Status changes to CANCELLED | [Fill after test] | Not Run |
| TC-13 | FR-10 | Admin deactivates a slot | Slot cannot receive new reservations | [Fill after test] | Not Run |
| TC-14 | FR-11 | Admin checks in a confirmed reservation | Check-in timestamp is saved | [Fill after test] | Not Run |
| TC-15 | FR-12 | Check out a checked-in reservation | Check-out and estimated fee are saved | [Fill after test] | Not Run |
| TC-16 | FR-12 | Check out before check-in | Invalid transition is rejected | [Fill after test] | Not Run |
| TC-17 | FR-13 | Open admin occupancy dashboard | Counts reflect current stored statuses | [Fill after test] | Not Run |
| TC-18 | NFR-03 | Inspect stored account record | Password is hashed, not plaintext | [Fill after test] | Not Run |
| TC-19 | NFR-03 | Submit malformed input to API | Request is safely validated/rejected | [Fill after test] | Not Run |
| TC-20 | NFR-04 | Simulate database unavailable | Safe error shown; no false reservation confirmation | [Fill after test] | Not Run |

## Execution record
- Tester: [Name]
- Date: [Date]
- Build/version: [Version or commit]
- Environment: [OS/browser/runtime/database]
- Evidence location: [Screenshot/log filename]

## Summary
- Total cases: 20
- Passed: [Count]
- Failed: [Count]
- Blocked: [Count]
- Not run: [Count]

Do not change `Not Run` to `Passed` without executing the case and recording evidence.
