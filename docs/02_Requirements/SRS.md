# Software Requirements Specification (SRS)
## Smart Parking Management System (SPMS)

**Version:** 1.0  
**Status:** Academic project baseline  
**Author:** [Name(s)]  
**Date:** [Date]

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements for SPMS. It is intended for students, developers, testers, reviewers, and the faculty evaluator.

### 1.2 Scope
SPMS is a web application for viewing parking availability, reserving parking slots, administering parking facilities, recording vehicle entry/exit, and viewing basic occupancy information. The first version uses application-managed availability rather than physical sensors.

### 1.3 Definitions
- **Slot:** A single parking space that can be assigned to a vehicle.
- **Reservation:** A time-bounded request to use a slot.
- **Check-in:** Recording that a vehicle has entered the parking area.
- **Check-out:** Recording that a vehicle has left the parking area.
- **Administrator:** A privileged user who manages parking facilities and operations.
- **Conflict:** Two active reservations assigned to the same slot for overlapping time periods.

### 1.4 References
- IEEE/ISO/IEC 29148 requirements-engineering guidance (consult the edition specified by your course).
- Course notes and institutional software engineering project guidelines.
- Actual framework documentation used by the implementation.

## 2. Overall description

### 2.1 Product perspective
SPMS is a client-server web application. The frontend communicates with a backend REST API. The backend validates requests, enforces access control and reservation rules, and reads/writes application data in a database.

### 2.2 Product functions
- Account creation and authentication.
- Parking location and slot browsing.
- Reservation creation, listing, and cancellation.
- Slot and parking-location administration.
- Check-in and check-out.
- Fee estimation and occupancy summaries.
- Input validation and error reporting.

### 2.3 User classes
| User class | Main permissions | Skill level |
|---|---|---|
| Driver/User | Browse, reserve, view own reservations, cancel eligible reservation | Basic web user |
| Administrator | Manage lots/slots, inspect reservations, check-in/out, view reports | Basic administrative training |
| Maintainer | Configure, deploy, back up, and troubleshoot application | Technical |

### 2.4 Operating environment
- Modern browser (current Chrome, Firefox, Edge, or equivalent).
- Backend runtime: Node.js for a MERN implementation.
- Database: MongoDB for a MERN implementation.
- OS: Windows, Linux, or macOS for development; deployment environment depends on hosting.

### 2.5 Constraints
- The backend must be the authority for reservation conflicts and permissions.
- Passwords must not be stored in plain text.
- Secrets must be supplied through environment variables.
- Real payment processing is excluded from the initial academic scope.
- The system must not claim sensor-verified occupancy unless sensors are actually integrated.

### 2.6 Assumptions and dependencies
- Users provide valid account and vehicle information.
- Administrators maintain accurate slot and rate records.
- Network and database services are available.
- A reservation is only confirmed after the backend successfully saves it.
- The project team chooses and documents the exact cancellation window and fee policy.

## 3. Functional requirements

### FR-01: Account registration
The system shall allow a new user to register using required fields and a unique email address. It shall reject invalid fields and duplicate email addresses.

### FR-02: Authentication
The system shall allow registered users to sign in using valid credentials and shall reject invalid credentials with a generic error message.

### FR-03: Authorization
The system shall restrict administrative API operations to authenticated administrator accounts. Hiding a button in the frontend alone shall not count as authorization.

### FR-04: Browse parking
The system shall display available parking locations and their slots, including each slot's identifier, type (if configured), and current application status.

### FR-05: Search/filter
The system should allow users to filter parking options by location, slot type, and requested time window where supported by the implementation.

### FR-06: Create reservation
The system shall allow an authenticated user to request a slot for a start and end time. The backend shall validate that the start precedes the end and that the slot is active and not already reserved for an overlapping interval.

### FR-07: Prevent conflicting reservations
The system shall prevent overlapping active reservations for the same slot. Conflict validation must occur on the backend and be safe against concurrent requests to the extent supported by the database design.

### FR-08: View reservations
The system shall allow users to view their own current and past reservations. Users shall not be able to view another user's private reservation details unless an administrator is authorized to do so.

### FR-09: Cancel reservation
The system shall allow a user to cancel their own eligible reservation according to the configured cancellation policy. The system shall record the resulting status.

### FR-10: Manage parking locations and slots
The administrator shall be able to create, edit, activate, deactivate, and inspect parking locations and slots. A slot with an active reservation shall not be deleted in a way that corrupts reservation history.

### FR-11: Check-in
The administrator shall be able to record vehicle entry for a valid reservation or authorized walk-in process. The system shall store the check-in timestamp and operator.

### FR-12: Check-out
The administrator shall be able to record vehicle exit for a checked-in vehicle. The system shall store the check-out timestamp and calculate an estimated fee using the configured rate policy.

### FR-13: Occupancy dashboard
The system shall display counts of available, reserved, occupied, and inactive slots based on stored application state.

### FR-14: Reservation history/report
The administrator shall be able to review reservation history and basic occupancy summaries for a selected period.

### FR-15: Notifications and messages
The system shall show success, validation, and failure messages for key actions. Email/SMS delivery is optional and shall be marked as not implemented if absent.

### FR-16: Audit information
The system should record key administrative changes and check-in/check-out actions with timestamps and actor identifiers.

## 4. Non-functional requirements

### NFR-01 Usability
A first-time user should be able to locate available slots and understand the reservation flow without specialist training.

### NFR-02 Performance
For the academic demo environment, common API requests should normally respond within 2 seconds under a small test load of 20 concurrent users, excluding network delays and cold starts. Record actual measurements rather than assuming this target has been met.

### NFR-03 Security
Passwords shall be hashed using a suitable password-hashing library. Protected endpoints shall verify authentication and authorization. Inputs shall be validated on the server. Secrets shall not be committed to source control.

### NFR-04 Reliability
The system shall return clear errors when the database or a dependent service is unavailable and shall not show a reservation as confirmed unless persistence succeeds.

### NFR-05 Data integrity
A reservation shall reference an existing slot and user. End time shall be later than start time. Status transitions shall follow documented rules.

### NFR-06 Maintainability
Code shall be separated into logical frontend, API, business logic, and data-access components. Environment-specific configuration shall be externalized.

### NFR-07 Compatibility
The user interface should work on current desktop and mobile browser sizes.

### NFR-08 Privacy
The application shall collect only fields required for the project and shall not expose passwords, authentication tokens, or private user data in logs or responses.

### NFR-09 Accessibility
Forms shall have labels, keyboard-accessible controls, visible validation feedback, and adequate contrast where practical.

### NFR-10 Backup and recovery
The team shall document a database backup/export and restore procedure appropriate to the chosen deployment.

## 5. External interface requirements

### 5.1 User interface
Pages may include: Register, Login, Parking Locations, Slot Details, Create Reservation, My Reservations, Admin Dashboard, Manage Lots/Slots, Check-in/Check-out, and Reports.

### 5.2 Software interfaces
- Frontend to backend through HTTPS REST API in deployment.
- Backend to MongoDB using a maintained driver/ODM.
- Optional notification provider, if implemented.

### 5.3 Communication interfaces
JSON request/response bodies over HTTP during local development and HTTPS in deployment.

## 6. Data requirements
Core entities: User, ParkingLot, ParkingSlot, Reservation, and AuditLog. A Payment entity is unnecessary unless a payment simulation is implemented. See `../03_System_Design/Database_Design.md`.

## 7. Business rules
- BR-01: Reservation end time must be later than start time.
- BR-02: A slot cannot have two overlapping active reservations.
- BR-03: Only the owner or an authorized administrator may access a reservation record.
- BR-04: Only an administrator may manage parking configuration.
- BR-05: Check-out is valid only after check-in.
- BR-06: Fee calculation uses the configured rate and rounding policy; the chosen policy must be documented.
- BR-07: Deactivated slots cannot receive new reservations.

## 8. Acceptance criteria
The project is acceptable when core user and administrator workflows operate, access controls are enforced server-side, overlapping reservations are rejected, the documented tests have been run and results recorded, and setup instructions are reproducible.

## 9. Requirements change process
Proposed changes shall be logged with a reason, impact on design/tests, approval, and version. Update the traceability matrix when a requirement changes.
