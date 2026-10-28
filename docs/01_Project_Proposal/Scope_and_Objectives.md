# Scope and Objectives

## In scope
- User registration, login, and logout.
- Role-based access for users and administrators.
- Browse parking locations and view slot status.
- Reserve a slot for a defined time window.
- View and cancel eligible reservations.
- Admin management of parking locations and slots.
- Admin confirmation of vehicle entry and exit.
- Basic fee estimation based on duration and configured rate.
- Occupancy and reservation history.
- Validation, error messages, and basic audit information.

## Out of scope for the first version
- Physical gate/barrier control.
- Live IoT sensor connectivity.
- Automatic number-plate recognition.
- Real payment processing or storage of payment-card data.
- Native Android/iOS apps.
- Multi-city enterprise analytics.
- Guaranteed live availability from physical sensors.

## Success criteria
- A user can complete a reservation using valid input.
- The system rejects conflicting reservations for the same slot and time window.
- An unauthorized user cannot access administrator operations.
- Administrators can update slot status and record check-in/check-out.
- Core requirements have corresponding test cases in the traceability matrix.
- Setup instructions allow another student to run the application.

## Constraints and assumptions
- Users have a modern browser and network access.
- The database is reachable by the backend.
- Slot availability is based on application records, not physical sensor data.
- Parking rates and cancellation rules are configurable project assumptions.
- All dates and times are stored consistently (preferably UTC) and displayed in the configured local timezone.
