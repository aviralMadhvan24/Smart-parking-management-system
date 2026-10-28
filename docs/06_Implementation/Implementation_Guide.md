# Implementation Guide

This guide proposes a MERN implementation. It is not a claim that the application code has already been implemented.

## 1. Prerequisites
- Node.js LTS and npm.
- MongoDB local instance or hosted database.
- Git.
- Code editor and browser.

## 2. Suggested implementation order
1. Create the repository and frontend/backend folders.
2. Configure environment variables and database connection.
3. Implement User model and registration/login.
4. Add authentication middleware and administrator authorization.
5. Implement ParkingLot and ParkingSlot models and admin CRUD endpoints.
6. Implement availability and reservation service, including overlap checks.
7. Implement reservation listing and cancellation.
8. Implement check-in/check-out and fee policy.
9. Implement dashboard/report endpoints and frontend pages.
10. Add tests and update the RTM.
11. Add screenshots and verify installation from a clean checkout.

## 3. Environment variables
Create a local `.env` file in the server directory. Do not commit it.
```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smart_parking
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```
Use `.env.example` to document variable names with placeholder values only. Never put a real secret in the repository.

## 4. Recommended API response conventions
Success response example:
```json
{
  "success": true,
  "data": {
    "id": "example-id"
  }
}
```
Error response example:
```json
{
  "success": false,
  "error": {
    "code": "RESERVATION_CONFLICT",
    "message": "This slot is not available for the selected time."
  }
}
```
These are examples; match them to your actual API.

## 5. Important implementation notes
- Check reservation overlap on the backend, not only in React.
- Use authorization checks for both role and resource ownership.
- Validate ObjectIds, dates, required fields, and enum values.
- Store dates consistently and define timezone behavior.
- Do not return `passwordHash` in API responses.
- Keep `.env`, build outputs, `node_modules`, and local database dumps out of Git.
- Add tests for simultaneous reservation attempts if concurrency correctness is part of the demonstration.

## 6. Suggested `.gitignore`
```gitignore
node_modules/
.env
.env.*
!.env.example
dist/
build/
coverage/
.DS_Store
*.log
```

## 7. Implementation status
Before submission, add your actual source code and change this section to describe what is implemented, what is partial, and what remains out of scope.
