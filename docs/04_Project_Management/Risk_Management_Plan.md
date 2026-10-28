# Risk Management Plan

Use probability and impact ratings of Low, Medium, or High. Review this register weekly.

| ID | Risk | Probability | Impact | Mitigation | Contingency |
|---|---|---|---|---|---|
| R-01 | Scope grows beyond available time | Medium | High | Keep sensors, real payments, and mobile app out of v1 | Deliver core reservation workflow first |
| R-02 | Duplicate/conflicting reservations | Medium | High | Backend conflict validation and concurrency testing | Disable reservation creation until corrected |
| R-03 | Unauthorized admin access | Medium | High | Server-side role checks and negative tests | Revoke affected sessions and fix authorization |
| R-04 | Database connection/configuration failure | Medium | Medium | Document environment variables and health checks | Use local database and restore from backup |
| R-05 | Data loss during development | Low | High | Regular database exports and Git commits | Restore latest backup |
| R-06 | Team member unavailable | Medium | Medium | Share documentation and review code | Reassign tasks and reduce optional features |
| R-07 | Testing left until the end | Medium | High | Write tests alongside features and track requirement coverage | Prioritize critical-path regression tests |
| R-08 | Demo internet or hosting failure | Medium | Medium | Rehearse demo and keep local setup ready | Demonstrate locally with prepared test data |
| R-09 | Credentials committed to repository | Low | High | `.env` in `.gitignore`; use `.env.example` | Rotate exposed credentials immediately |
| R-10 | Diagrams/docs differ from code | Medium | Medium | Update traceability and docs during changes | Run a final consistency review |

## Risk response process
1. Identify and describe the risk.
2. Rate probability and impact.
3. Assign an owner.
4. Select mitigation and contingency actions.
5. Review status at each project meeting.
