# Software Design Specification (SDS)

## 1. Purpose
This document translates the SRS into a proposed software structure. It describes components, API boundaries, data entities, security, and key workflows.

## 2. Architecture
Use a three-layer client-server architecture:
1. Presentation layer: React pages and reusable UI components.
2. Application/API layer: Express routes, middleware, validation, authorization, and business services.
3. Data layer: MongoDB collections accessed through a repository/model layer.

## 3. Components
| Component | Responsibility |
|---|---|
| Authentication module | Registration, login, password hashing, token/session validation |
| User module | User profile and role information |
| Parking module | Parking locations and slot configuration |
| Availability service | Determines whether a slot can be reserved in a time interval |
| Reservation service | Creates, lists, cancels, and updates reservation state |
| Operations module | Check-in, check-out, and fee calculation |
| Reporting module | Occupancy counts and reservation summaries |
| Audit module | Records key administrative actions |

## 4. Suggested folder structure
```text
smart-parking/
  client/
    src/
      components/
      pages/
      services/
      hooks/
      App.jsx
  server/
    src/
      config/
      middleware/
      models/
      routes/
      controllers/
      services/
      validators/
      app.js
      server.js
  docs/
  .env.example
  .gitignore
  README.md
```

## 5. API design (illustrative)
Base path: `/api/v1`

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/auth/register` | Create account | Public |
| POST | `/auth/login` | Authenticate | Public |
| GET | `/parking-lots` | List active lots | Authenticated or public by policy |
| GET | `/parking-lots/:lotId/slots` | List slots/status | Authenticated or public by policy |
| POST | `/reservations` | Create reservation | User |
| GET | `/reservations/me` | List current user's reservations | User |
| PATCH | `/reservations/:id/cancel` | Cancel eligible reservation | Owner/Admin |
| GET | `/admin/parking-lots` | List/manage lots | Admin |
| POST | `/admin/parking-lots` | Create lot | Admin |
| POST | `/admin/slots` | Create slot | Admin |
| PATCH | `/admin/slots/:id` | Update slot | Admin |
| POST | `/admin/reservations/:id/check-in` | Record entry | Admin |
| POST | `/admin/reservations/:id/check-out` | Record exit and fee | Admin |
| GET | `/admin/reports/occupancy` | Occupancy summary | Admin |

Return suitable HTTP status codes, validate all request data, and use a consistent JSON error format. This table is a design proposal; update it to match the actual implementation.

## 6. Reservation conflict rule
Two intervals overlap when `requestedStart < existingEnd` AND `requestedEnd > existingStart`. Ignore cancelled reservations. Perform this check on the server. Consider a transaction, lock, or database-enforced strategy appropriate to the selected database and concurrency needs; a simple read-then-write check alone can race under simultaneous requests.

## 7. Reservation state model
Proposed statuses: `CONFIRMED`, `CANCELLED`, `CHECKED_IN`, `COMPLETED`, `NO_SHOW`.
Valid transitions:
- CONFIRMED → CANCELLED
- CONFIRMED → CHECKED_IN
- CONFIRMED → NO_SHOW (after the defined grace period)
- CHECKED_IN → COMPLETED
Invalid transitions should be rejected with a clear response.

## 8. Security design
- Hash passwords with a suitable password-hashing algorithm/library.
- Validate and normalize user input.
- Enforce roles and record ownership on backend routes.
- Store secrets in environment variables and exclude `.env` from version control.
- Use HTTPS in production.
- Apply rate limits to authentication endpoints where practical.
- Avoid logging passwords, tokens, or sensitive request bodies.
- Configure CORS for known frontend origins in deployment.

## 9. Error handling
Use a central error handler. Responses should provide a safe message and suitable status code without stack traces or database internals in production.

## 10. Logging and monitoring
Log unexpected errors and important administrative events with timestamp and request correlation ID if available. Avoid personal or credential data in logs.

## 11. Design decisions
- MERN is a proposed implementation stack, not a hard requirement.
- Occupancy is application-derived until real sensors are integrated.
- Payments are simulated or excluded in version 1.
- Fee calculation policy must be configured and documented.
