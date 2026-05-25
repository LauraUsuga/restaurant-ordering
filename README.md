# 🍔 Restaurant Ordering System + Order Timeline (Audit Trail)

Full-stack restaurant ordering system with server-side pricing, cart management, checkout flow, and immutable event-driven order timeline.

---

## 🧠 Architecture Overview

This project follows an **event-driven backend design** where every important user action is stored as an immutable event.

### Key Concepts:

- Server-side pricing (no client trust)
- Idempotent checkout requests
- Append-only timeline (audit log)
- Async order state simulation

---

## 🛠 Tech Stack

### Frontend

- React + TypeScript
- Vite
- Material UI
- React Router

### Backend

- Node.js + TypeScript
- Express
- Serverless Framework
- MongoDB Atlas

---

## 📦 Project Structure

```txt
apps/
 ├── frontend
 ├── backend
```

---

## 🚀 How to Run

### Backend

```bash
cd apps/backend
npm install
npm run dev
```

http://localhost:3001

---

### Frontend

```bash
cd apps/frontend
npm install
npm run dev
```

http://localhost:5173

---

## 🔐 Environment Variables

```
PORT=3001
MONGO_URI=your_mongodb_atlas_url
TAX_PERCENT=10
SERVICE_FEE_PERCENT=5
```

---

## 📡 API Overview

### Menu

GET `/menu`

### Cart

GET `/cart/:userId`
POST `/cart/items`
PATCH `/cart/items/:id`
DELETE `/cart/items/:id`

### Orders

POST `/orders`
GET `/orders/:orderId`
GET `/orders/:orderId/timeline`

---

## 🧾 Core Features

### 🛒 Cart System

- Add/update/remove items
- Modifier groups support
- Server-side pricing calculation

### 💰 Pricing Engine

- Tax applied server-side
- Service fee applied server-side
- Integer cents (no floats)

### 📦 Checkout

- Idempotency-Key support
- Async status simulation
- Returns 202 Accepted

### 📜 Order Timeline (Audit Trail)

Immutable event system:

- CART_ITEM_ADDED
- CART_ITEM_UPDATED
- CART_ITEM_REMOVED
- PRICING_CALCULATED
- ORDER_PLACED
- ORDER_STATUS_CHANGED
- VALIDATION_FAILED

---

## 🧪 Testing

```bash
cd apps/backend
npm test
```

---

## ⚠️ Notes

- MongoDB Atlas used for persistence
- Timeline is append-only (never updated)
- Pricing is always server-side authoritative
