# 🍴 fork & fire — Restaurant Ordering System

Full-stack restaurant ordering app with menu browsing, product customization, cart management, server-side pricing, and an immutable order timeline (audit trail).

---

## Architecture

```
restaurant-ordering/
├── backend/          # Node.js + Serverless Framework + MongoDB
└── frontend/         # React + Vite + MUI
```

| Layer | Tech |
|---|---|
| Backend | Node.js 20, TypeScript, Serverless Framework v3, Express (via serverless-http) |
| Database | MongoDB (local via Docker or Atlas) |
| Frontend | React 18, Vite, TypeScript, MUI v5 |
| Infra | AWS Lambda + API Gateway (local: serverless-offline) |

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20.x | Use nvm: `nvm use 20` |
| npm | 9+ | Comes with Node 20 |
| Docker | any recent | Only for local MongoDB |
| Serverless CLI | 3.x | `npm i -g serverless@3` |

---

## Environment Setup

### Backend — `backend/.env`
Copy from the example and fill in values:
```bash
cp backend/.env.example backend/.env
```

Required vars:
```
MONGODB_URI=mongodb://localhost:27017/restaurant
TAX_PERCENT=8
SERVICE_FEE_PERCENT=5
PORT=3001
```

### Frontend — `frontend/.env`
```bash
cp frontend/.env.example frontend/.env
```

Required vars:
```
VITE_API_URL=http://localhost:3001
```

---

## How to Run Locally

### 1. Start MongoDB
```bash
docker run -d --name mongo-restaurant -p 27017:27017 mongo:7
```

### 2. Backend
```bash
cd backend
npm install
npm run seed          # loads 7 products with modifiers
npm run dev           # starts serverless offline on port 3001
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev           # starts Vite dev server on port 5173
```

### Ports

| Service | URL |
|---|---|
| Backend API | http://localhost:3001 |
| Frontend | http://localhost:5173 |
| MongoDB | mongodb://localhost:27017 |

### Startup order
1. MongoDB → 2. Backend → 3. Frontend

---

## How to Test

### Backend tests
```bash
cd backend
npm test              # Jest — unit + integration
npm run test:watch    # watch mode
npm run test:coverage # coverage report
```

### Frontend tests
```bash
cd frontend
npm test              # Vitest
npm run test:ui       # Vitest UI
npm run test:coverage
```

---

## Seed Data

The seed script inserts 7 products — 2 of which have the full 3 modifier groups (Protein, Toppings, Sauces):

```bash
cd backend
npm run seed
```

To reset and re-seed:
```bash
npm run seed:reset
```

---

## API Reference

| Method | Route | Description |
|---|---|---|
| GET | /menu | All products |
| POST | /cart/items | Add item to cart |
| GET | /cart/:userId | Cart with pricing breakdown |
| PATCH | /cart/items/:id | Update item quantity |
| DELETE | /cart/items/:id | Remove item |
| POST | /orders | Create order (202 + orderId) |
| GET | /orders/:orderId | Order status |
| GET | /orders/user/:userId | Paginated order history |
| GET | /orders/:orderId/timeline | Paginated event timeline |
| PATCH | /orders/:orderId/status | Update order status (internal) |

---

## Key Design Decisions

- **Pricing is server-side only.** The frontend shows an estimate in the drawer for UX, but the final price is always recalculated on the backend before persisting.
- **Money in integer cents.** No floating-point arithmetic on monetary values.
- **Timeline is append-only.** `TimelineEvent` documents are never updated or deleted. Deduplication is enforced via `unique` index on `eventId`.
- **Idempotency on checkout.** `POST /orders` accepts an `Idempotency-Key` header; duplicate requests return the same `orderId`.
- **PII masking.** Before logging any timeline payload, `maskPII()` replaces sensitive fields (email, phone, etc.) with masked values.

---

## Timeline Event Types

| Event | Emitted by |
|---|---|
| `CART_ITEM_ADDED` | cart handler (POST /cart/items) |
| `CART_ITEM_UPDATED` | cart handler (PATCH /cart/items/:id) |
| `CART_ITEM_REMOVED` | cart handler (DELETE /cart/items/:id) |
| `PRICING_CALCULATED` | cart handler (GET /cart/:userId) |
| `ORDER_PLACED` | order handler (POST /orders) |
| `ORDER_STATUS_CHANGED` | order handler (auto status flow + PATCH /orders/:id/status) |
| `VALIDATION_FAILED` | any handler on validation error |