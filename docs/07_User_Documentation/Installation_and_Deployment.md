# Installation and Deployment Guide

This guide assumes a MERN implementation. Replace commands and values to match the actual repository.

## 1. Prerequisites
- Node.js LTS and npm.
- MongoDB running locally or a valid hosted MongoDB URI.
- Git.

## 2. Clone the repository
```bash
git clone [YOUR_REPOSITORY_URL]
cd smart-parking
```

## 3. Install backend dependencies
```bash
cd server
npm install
```

Create `server/.env` using the variables listed in `../06_Implementation/Implementation_Guide.md`. Use a long random JWT secret and a valid database URI.

## 4. Install frontend dependencies
In a second terminal:
```bash
cd client
npm install
```
Configure the frontend API base URL using the mechanism supported by your frontend build tool (for Vite, a variable such as `VITE_API_BASE_URL` is commonly used).

## 5. Start the application
Use the scripts defined in your actual `package.json`. A typical development setup may run the API on port 5000 and the Vite frontend on port 5173:
```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```
These commands work only if the scripts exist in the package files.

## 6. Database setup
Ensure the database service is running. If seed data is supported, use the documented seed command. Create an administrator through a safe seed process or a controlled setup procedure; do not allow public registration to assign the `ADMIN` role.

## 7. Deployment checklist
- Configure production environment variables securely.
- Use HTTPS.
- Restrict CORS to the intended frontend origin.
- Use a production database with appropriate access controls.
- Enable database backups.
- Check authentication, authorization, and reservation-conflict tests.
- Do not deploy with default secrets or test administrator credentials.
- Verify logs do not contain passwords or tokens.
- Record deployed version and date.

## 8. Common issues
- **Database connection failure:** Check URI, network access, credentials, and database status.
- **CORS error:** Check backend allowed origin and frontend URL.
- **API 404:** Check route prefix and frontend API base URL.
- **Port in use:** Change the port or stop the conflicting process.
- **Missing environment variable:** Confirm `.env` is in the expected folder and the server is restarted.
