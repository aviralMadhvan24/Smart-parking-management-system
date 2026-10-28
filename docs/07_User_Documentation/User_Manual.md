# User Manual

## 1. Introduction
This manual describes the intended workflows for the Smart Parking Management System. Screens and labels may differ in your final implementation.

## 2. Driver/User

### 2.1 Create an account
1. Open the application.
2. Select Register.
3. Enter the required name, email, and password.
4. Submit the form.
5. If registration succeeds, sign in.

### 2.2 Sign in
1. Enter your registered email and password.
2. Select Login.
3. If credentials are invalid, check the details and try again.

### 2.3 Find parking
1. Open the Parking Locations page.
2. Select a parking lot.
3. Choose a date/time window if supported.
4. Review slot status and any displayed rate.

### 2.4 Reserve a slot
1. Select an eligible slot.
2. Enter vehicle details and start/end times.
3. Review the details and submit.
4. Save the reservation reference shown by the application.
5. If the slot is unavailable, choose another slot or time.

### 2.5 View or cancel a reservation
1. Open My Reservations.
2. Select the relevant reservation.
3. Review status and time.
4. Select Cancel only if cancellation is permitted.
5. Confirm the status has changed.

## 3. Parking Administrator

### 3.1 Sign in
Use an administrator account provisioned by the project team. Do not expose admin credentials in public documentation.

### 3.2 Manage parking inventory
1. Open the admin dashboard.
2. Create or select a parking lot.
3. Add slots with unique slot codes.
4. Update status/type/rate where supported.
5. Deactivate slots that should not accept new reservations.

### 3.3 Record entry and exit
1. Find the correct reservation.
2. Confirm the vehicle/reservation details.
3. Record check-in when the vehicle enters.
4. Record check-out when the vehicle leaves.
5. Review the estimated fee and saved timestamps.

### 3.4 View reports
Open the occupancy/report page and select the available filters. Treat the numbers as application-recorded occupancy, not sensor-verified physical occupancy.

## 4. Troubleshooting
- **Cannot log in:** Verify the email/password and ensure the backend is running.
- **Slot appears unavailable:** Check the requested time window and active reservations.
- **Reservation request fails:** Review the validation message and confirm the end time is later than the start time.
- **Admin page is blocked:** Confirm the account has the administrator role.
- **Page cannot load data:** Check the frontend API URL, backend logs, database connection, and network.
- **Unexpected fee:** Check the documented hourly rate and rounding policy.

## 5. Safe use
Use fictional test data for demos. Never share passwords or tokens. Report incorrect reservation status to the administrator.
