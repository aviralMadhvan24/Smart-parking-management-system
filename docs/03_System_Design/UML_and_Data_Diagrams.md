# UML and Data Diagrams

The diagrams below are supplied as Mermaid source. Paste each code block into a Mermaid-compatible editor or Markdown preview to render it. If your college requires image files, export each diagram as PNG/SVG and include those exports in this folder.

## 1. Use case diagram (high-level)
```mermaid
flowchart LR
  Driver([Driver / User])
  Admin([Parking Administrator])
  Auth((Register / Login))
  Browse((Browse parking))
  Reserve((Reserve slot))
  Manage((View / Cancel own reservation))
  Configure((Manage lots and slots))
  Check((Record check-in / check-out))
  Report((View occupancy reports))
  Driver --- Auth
  Driver --- Browse
  Driver --- Reserve
  Driver --- Manage
  Admin --- Auth
  Admin --- Configure
  Admin --- Check
  Admin --- Report
```

## 2. System context diagram
```mermaid
flowchart TB
  User[Driver / User] -->|Browser requests| SPMS[Smart Parking Management System]
  Admin[Administrator] -->|Management actions| SPMS
  SPMS <-->|Read / write| DB[(Application Database)]
  SPMS -.->|Optional notifications| Notify[Email / SMS provider]
  Sensor[Future IoT sensors] -.->|Future integration| SPMS
```

## 3. Reservation sequence diagram
```mermaid
sequenceDiagram
  actor U as User
  participant UI as React UI
  participant API as Express API
  participant S as Reservation Service
  participant DB as MongoDB
  U->>UI: Select slot and time
  UI->>API: POST /reservations
  API->>API: Authenticate and validate input
  API->>S: Request reservation
  S->>DB: Check slot and overlapping reservations
  DB-->>S: Current slot/reservation records
  alt Slot available
    S->>DB: Persist reservation
    DB-->>S: Saved reservation
    S-->>API: Confirmed result
    API-->>UI: 201 Created
    UI-->>U: Show confirmation
  else Conflict or invalid slot
    S-->>API: Conflict/validation error
    API-->>UI: 409 Conflict or 400 Bad Request
    UI-->>U: Show reason
  end
```

## 4. Activity diagram: reservation
```mermaid
flowchart TD
  A([Start]) --> B[Login]
  B --> C[Choose lot, slot, start and end time]
  C --> D{Input valid?}
  D -- No --> E[Show validation message]
  E --> C
  D -- Yes --> F[Backend checks availability]
  F --> G{No overlapping reservation?}
  G -- No --> H[Show slot unavailable]
  H --> C
  G -- Yes --> I[Save reservation]
  I --> J[Show reservation confirmation]
  J --> K([End])
```

## 5. Class/domain model
```mermaid
classDiagram
  class User {
    +ObjectId id
    +String name
    +String email
    +String passwordHash
    +String role
  }
  class ParkingLot {
    +ObjectId id
    +String name
    +String address
    +Boolean active
  }
  class ParkingSlot {
    +ObjectId id
    +ObjectId lotId
    +String slotCode
    +String type
    +String status
    +Boolean active
  }
  class Reservation {
    +ObjectId id
    +ObjectId userId
    +ObjectId slotId
    +Date startTime
    +Date endTime
    +String status
    +Date checkInAt
    +Date checkOutAt
    +Number fee
  }
  class AuditLog {
    +ObjectId id
    +ObjectId actorId
    +String action
    +String entityType
    +ObjectId entityId
    +Date createdAt
  }
  User "1" --> "0..*" Reservation : creates
  ParkingLot "1" --> "1..*" ParkingSlot : contains
  ParkingSlot "1" --> "0..*" Reservation : assigned to
  User "1" --> "0..*" AuditLog : performs
```

## 6. Entity relationship overview
```mermaid
erDiagram
  USER ||--o{ RESERVATION : creates
  PARKING_LOT ||--|{ PARKING_SLOT : contains
  PARKING_SLOT ||--o{ RESERVATION : assigned_to
  USER ||--o{ AUDIT_LOG : performs
  USER {
    string id PK
    string name
    string email UK
    string passwordHash
    string role
  }
  PARKING_LOT {
    string id PK
    string name
    string address
    boolean active
  }
  PARKING_SLOT {
    string id PK
    string lotId FK
    string slotCode
    string type
    string status
    boolean active
  }
  RESERVATION {
    string id PK
    string userId FK
    string slotId FK
    datetime startTime
    datetime endTime
    string status
  }
  AUDIT_LOG {
    string id PK
    string actorId FK
    string action
    string entityType
    datetime createdAt
  }
```

## 7. Deployment diagram (academic setup)
```mermaid
flowchart LR
  Browser[User browser] -->|HTTP / HTTPS| Frontend[React frontend]
  Frontend -->|REST JSON API| Backend[Node.js / Express]
  Backend -->|Database driver| Mongo[(MongoDB)]
```
