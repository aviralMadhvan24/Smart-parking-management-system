# Smart Parking Management System (SPMS)

A runnable academic MVP with a React/Vite frontend, Express API, and MongoDB persistence.

## Implemented
- User registration and login with hashed passwords and JWT authentication.
- User/admin roles and server-side authorization.
- Parking lot/slot listing and admin slot creation.
- Time-window reservations and overlap checks.
- View own reservations and cancel confirmed reservations.
- Admin occupancy summary.
- Demo seed script for a sample lot, slots, and an administrator.
- Software engineering documents in `docs/`.

## Not implemented / limitations
- Real IoT sensors, ANPR, barrier control, email/SMS, and real payment gateway are not included.
- Availability is calculated from stored application records, not physical sensor data.
- Reservation overlap checks use a MongoDB transaction. This requires MongoDB to run as a replica set (a single-node replica set is sufficient). If your MongoDB setup does not support transactions, configure a replica set before using concurrent reservations.
- Check-in/check-out and fee management are documented as future/optional work, not implemented in this MVP.

## Requirements
- Node.js 20+ recommended
- MongoDB 6+ running as a replica set, local or hosted
- npm

## Setup
1. Copy `.env.example` to `.env` inside `server/`.
2. Set `MONGODB_URI` and replace `JWT_SECRET` with a long random secret.
3. In a terminal:
   ```bash
   cd server
   npm install
   npm run seed
   npm run dev
   ```
4. In a second terminal:
   ```bash
   cd client
   npm install
   npm run dev
   ```
5. Open the URL printed by Vite (usually `http://localhost:5173`).

## Demo credentials
The seed script creates:
- Email: `admin@smartparking.local`
- Password: `Admin123!`

Change this password before any shared or deployed demo. Do not use these credentials in production.

## Environment
See `server/.env.example` and `client/.env.example`. Do not commit real `.env` files.

## API overview
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/parking-lots`
- `GET /api/parking-lots/:lotId/slots`
- `POST /api/reservations` (authenticated user)
- `GET /api/reservations/me` (authenticated user)
- `PATCH /api/reservations/:id/cancel` (owner/admin)
- `POST /api/admin/parking-lots` (admin)
- `POST /api/admin/slots` (admin)
- `GET /api/admin/summary` (admin)

## Documentation
See `docs/` for proposal, SRS, design, diagrams, database design, project plan, risk plan, test cases, traceability matrix, user manual, installation guide, and final report template.

## Before submission
Run the tests and record real results. Update documents to match the implementation, add your details and screenshots, and disclose limitations honestly.
