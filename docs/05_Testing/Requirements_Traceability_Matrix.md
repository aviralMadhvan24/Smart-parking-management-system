# Requirements Traceability Matrix (RTM)

This matrix connects requirements to test cases. Update IDs if the implementation or test suite changes.

| Requirement ID | Requirement summary | Design reference | Test case(s) | Coverage |
|---|---|---|---|---|
| FR-01 | Registration | SDS: Authentication | TC-01, TC-02 | Planned |
| FR-02 | Login | SDS: Authentication | TC-03, TC-04 | Planned |
| FR-03 | Role authorization | SDS: Security | TC-05, TC-11 | Planned |
| FR-04 | Browse parking | SDS: Parking module | TC-06 | Planned |
| FR-06 | Create valid reservation | SDS: Reservation service | TC-07, TC-08 | Planned |
| FR-07 | Prevent overlap | SDS: Conflict rule | TC-09, TC-10 | Planned |
| FR-08 | View own reservations | SDS: Reservation service | TC-11 | Planned |
| FR-09 | Cancel reservation | SDS: Reservation service | TC-12 | Planned |
| FR-10 | Manage slots | SDS: Parking module | TC-13 | Planned |
| FR-11 | Check-in | SDS: Operations module | TC-14 | Planned |
| FR-12 | Check-out and fee | SDS: Operations module | TC-15, TC-16 | Planned |
| FR-13 | Occupancy dashboard | SDS: Reporting module | TC-17 | Planned |
| NFR-03 | Security | SDS: Security design | TC-04, TC-05, TC-11, TC-18, TC-19 | Planned |
| NFR-04 | Reliability | SDS: Error handling | TC-20 | Planned |

## Coverage review
- **Forward traceability:** Every requirement should map to design elements and test cases.
- **Backward traceability:** Every major feature/test should map to an approved requirement.
- **Status:** Replace `Planned` with the real execution/coverage status after design review and test execution.
