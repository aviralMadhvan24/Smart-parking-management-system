# Database Design

The following is a logical schema proposal for MongoDB. Adapt field names and validation rules to your actual models.

## 1. User collection
| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, normalized to lowercase |
| `passwordHash` | String | Required; never store plaintext password |
| `role` | String | `USER` or `ADMIN`; default `USER` |
| `createdAt` | Date | Required |
| `updatedAt` | Date | Required |

## 2. ParkingLot collection
| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `name` | String | Required |
| `address` | String | Required |
| `description` | String | Optional |
| `active` | Boolean | Default true |
| `createdAt` | Date | Required |

## 3. ParkingSlot collection
| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `lotId` | ObjectId | Required reference to ParkingLot |
| `slotCode` | String | Required, unique within lot |
| `type` | String | e.g. `STANDARD`, `ACCESSIBLE`, `EV`; only implement types you support |
| `status` | String | `AVAILABLE`, `MAINTENANCE`, `INACTIVE` as configuration state |
| `active` | Boolean | Default true |
| `hourlyRate` | Number | Non-negative; optional if rate is lot-level |
| `createdAt` | Date | Required |

Note: reservation-based availability is time-dependent. Do not treat a static `AVAILABLE` field alone as proof that a slot is free for every requested time window.

## 4. Reservation collection
| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `userId` | ObjectId | Required reference to User |
| `slotId` | ObjectId | Required reference to ParkingSlot |
| `vehicleNumber` | String | Required if vehicle identity is in scope |
| `startTime` | Date | Required |
| `endTime` | Date | Required; later than start |
| `status` | String | `CONFIRMED`, `CANCELLED`, `CHECKED_IN`, `COMPLETED`, `NO_SHOW` |
| `checkInAt` | Date | Optional |
| `checkOutAt` | Date | Optional |
| `feeAmount` | Number | Optional; non-negative |
| `createdAt` | Date | Required |
| `updatedAt` | Date | Required |

## 5. AuditLog collection
| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `actorId` | ObjectId | User/admin who performed action |
| `action` | String | Required action label |
| `entityType` | String | e.g. `SLOT`, `RESERVATION` |
| `entityId` | ObjectId/String | Identifier of affected entity |
| `metadata` | Object | Minimal non-sensitive context |
| `createdAt` | Date | Required |

## 6. Index recommendations
- `User.email`: unique index.
- `ParkingSlot.lotId + slotCode`: compound unique index.
- `Reservation.slotId + startTime + endTime`: index to support availability checks.
- `Reservation.userId + createdAt`: index for user history.
- `Reservation.status + startTime`: index for admin views.

Indexes improve query performance but do not by themselves prevent overlapping time ranges. The service must enforce the conflict rule using a concurrency-safe approach suitable for the chosen data model.

## 7. Fee calculation example
If the project uses an hourly rate, one possible policy is:
`billableHours = ceil((checkOutAt - checkInAt) / 3,600,000)`
`feeAmount = billableHours * hourlyRate`

This is only an example. State whether there is a minimum fee, grace period, daily cap, or rounding rule in your final implementation. Never present this example as the implemented policy unless it is.
