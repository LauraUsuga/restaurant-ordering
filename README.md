# 🍴 Fork & Fire — Restaurant Ordering System

Restaurant ordering app with:

- Menu browsing
- Product customization (modifier groups)
- Cart management
- Server-side pricing
- Checkout flow
- Order tracking with immutable timeline (audit trail)

## Tech Stack

### Frontend
- React
- Vite
- TypeScript
- Material UI

### Backend
- Node.js
- TypeScript
- Serverless Framework
- MongoDB Atlas

## Project Structure

apps/
├── frontend/
└── backend/

## Prerequisites

Install:
- Node.js 20+
- npm

Check versions:
node -v
npm -v

Clone the repository:
git clone https://github.com/your-username/restaurant-ordering.git
cd restaurant-ordering

## Environment Variables

### Backend

Go to backend:

```bash
cd apps/backend
```

Create `.env` from the example:

```bash
cp .env.example .env
```

Add the following values:

```env
PORT=3001

MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.wprr1mp.mongodb.net/restaurant?retryWrites=true&w=majority

TAX_PERCENT=10
SERVICE_FEE_PERCENT=5
```

Replace:

- `<USERNAME>` → your MongoDB Atlas username
- `<PASSWORD>` → your MongoDB Atlas password

> ⚠️ Note: A ready-to-use MongoDB Atlas connection string is also included in the submission email attached to this repository for easier setup.

Example:

```env
MONGO_URI=mongodb+srv://myUser:myPassword@cluster0.wprr1mp.mongodb.net/restaurant?retryWrites=true&w=majority
```

### Frontend

Go to frontend:

```bash
cd apps/frontend
```

VITE_API_URL=http://localhost:3001

## Run the Project

### 1. Start Backend


```bash
cd apps/backend
npm install
npm run build
npm run dev
```

Backend runs on:
http://localhost:3001

---

### 2. Start Frontend

Open another terminal:

```bash
cd apps/frontend
npm install
npm run build
npm run dev
```

Frontend runs on:
http://localhost:5173

---

## Startup Order

1. Backend
2. Frontend

---

## Run Tests

### Backend

```bash
cd apps/backend
npm test
```

---

### Frontend

```bash
cd apps/frontend
npm test
```

---

## Seed Data

Seed inserts:

- 7 products
- Modifier groups:
  - Protein (required)
  - Toppings (optional)
  - Sauces (optional)

Run seed:

```bash
cd apps/backend
npm run seed
```

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/menu` | Get menu |
| POST | `/cart/items` | Add item to cart |
| GET | `/cart/:userId` | Get cart |
| PATCH | `/cart/items/:id` | Update quantity |
| DELETE | `/cart/items/:id` | Remove item |
| POST | `/orders` | Place order |
| GET | `/orders/:orderId` | Get order status |
| GET | `/orders/:orderId/timeline` | Get timeline |

---

## Key Decisions

- Pricing is calculated server-side
- Money uses integer cents
- Timeline events are append-only
- Checkout supports idempotency using `Idempotency-Key`
- Timeline events are sorted by timestamp
- Payload size is limited