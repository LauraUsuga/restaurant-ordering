# Backend — fork & fire API

Node.js REST API built with Serverless Framework v3, TypeScript, and MongoDB.

---

## Stack

| Tech | Purpose |
|---|---|
| Node.js 20 + TypeScript | Runtime |
| Serverless Framework v3 | Lambda packaging + local dev |
| serverless-offline | Local HTTP server (port 3001) |
| Express + serverless-http | HTTP routing inside Lambda |
| Mongoose | MongoDB ODM |
| uuid | Event ID generation |
| Jest + ts-jest | Testing |

---

## Project Structure

```
backend/
├── serverless.yml              # Serverless config
├── package.json
├── tsconfig.json
├── jest.config.ts
├── .env.example
├── scripts/
│   └── seed.ts                 # Inserts 7 products into MongoDB
└── src/
    ├── server.ts               # Express app + serverless-http export
    ├── db.ts                   # MongoDB connection
    ├── handlers/
    │   ├── cart.ts             # GET|POST|PATCH|DELETE /cart/*
    │   ├── orders.ts           # POST|GET /orders
    │   └── timeline.ts         # GET /orders/:id/timeline
    ├── middleware/
    │   └── payload-limit.ts    # 400 if body > 16KB
    ├── models/
    │   ├── CartItem.ts
    │   ├── Idempotency.ts
    │   ├── Order.ts
    │   ├── Product.ts
    │   └── TimelineEvent.ts
    └── services/
        ├── maskPII.ts              # Masks email/phone before logging
        ├── order-pricing.service.ts # subtotal → tax + fee + total
        ├── pricing.service.ts       # item price with modifiers
        └── timeline.service.ts      # createTimelineEvent
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGODB_URI` | Yes | — | MongoDB connection string |
| `TAX_PERCENT` | No | `10` | Tax rate applied to subtotal |
| `SERVICE_FEE_PERCENT` | No | `5` | Service fee rate |
| `PORT` | No | `3001` | Local port (serverless-offline) |

Copy `.env.example` → `.env` and fill in `MONGODB_URI`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start serverless-offline (port 3001) |
| `npm run build` | Compile TypeScript |
| `npm run seed` | Insert 7 products (idempotent) |
| `npm run seed:reset` | Drop products collection and re-seed |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Jest in watch mode |
| `npm run test:coverage` | Coverage report |

---

## API Endpoints

### Menu
- `GET /menu` — Returns all products with modifier groups

### Cart
- `POST /cart/items` — Add item; emits `CART_ITEM_ADDED`
  - Body: `{ userId, productId, quantity, selectedModifiers[], correlationId }`
- `GET /cart/:userId` — Returns items + pricing breakdown; emits `PRICING_CALCULATED`
- `PATCH /cart/items/:id` — Update quantity; emits `CART_ITEM_UPDATED`
  - Body: `{ quantity }`
- `DELETE /cart/items/:id` — Remove item; emits `CART_ITEM_REMOVED`

### Orders
- `POST /orders` — Create order (202 Accepted); emits `ORDER_PLACED`
  - Header: `Idempotency-Key: <uuid>`
  - Body: `{ userId, correlationId }`
- `GET /orders/:orderId` — Current order status
- `GET /orders/user/:userId` — Paginated order history
  - Query: `?page=1&limit=5&sort=desc`
- `PATCH /orders/:orderId/status` — Update status (worker/internal); emits `ORDER_STATUS_CHANGED`

### Timeline
- `GET /orders/:orderId/timeline` — Paginated events sorted by timestamp
  - Query: `?page=1&pageSize=20` (max pageSize: 50)

---

## Data Models

### CartItem
```
userId, productId (ref: Product), productName, quantity,
selectedModifiers[], basePriceCents, totalPriceCents
```

### Order
```
userId, status, items[], subtotalCents, taxCents, serviceFeeCents, totalCents
```

### TimelineEvent
```
eventId (uuid, unique), timestamp (ISO 8601), orderId, userId,
type, source (web|api|worker), correlationId, payload (object, max 16KB)
```

### Idempotency
```
key (unique), orderId
```

---

## Business Rules

1. **Pricing is always server-side.** `calculateItemPrice` and `calculateOrderPricing` run in the backend; client totals are never trusted.
2. **All money in integer cents.** No `float` for prices anywhere.
3. **Timeline is append-only.** No update or delete on `TimelineEvent`.
4. **Payload size limit.** `payload-limit.ts` middleware rejects payloads > 16KB with `400`.
5. **PII masking.** `maskPII()` is called before logging any timeline payload. Stored payload is unmasked (for audit), log output is masked.
6. **Idempotency.** Duplicate `Idempotency-Key` on `POST /orders` returns existing `orderId` without creating a new order.
7. **Auto status flow.** After `ORDER_PLACED`, the order progresses automatically: PENDING → PREPARING (5s) → ON_THE_WAY (10s) → DELIVERED (15s), each emitting `ORDER_STATUS_CHANGED`.