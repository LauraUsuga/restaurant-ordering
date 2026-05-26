# Frontend — fork & fire UI

React + Vite + TypeScript single-page application with MUI component library.

---

## Stack

| Tech | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Dev server + bundler |
| MUI v5 | Component library |
| React Router v6 | Client-side routing |
| Axios (via `api.ts`) | HTTP client |
| Vitest + Testing Library | Unit tests |

---

## Project Structure

```
frontend/
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── package.json
├── tsconfig.json
├── .env.example
└── src/
    ├── main.tsx                    # Entry point, ThemeProvider, Router
    ├── theme/
    │   └── theme.ts                # MUI dark theme (Playfair Display)
    ├── services/
    │   └── api.ts                  # Axios instance (VITE_API_URL base)
    ├── types/
    │   ├── product/
    │   │   └── product.ts          # Product, ModifierGroup, ModifierOption
    │   ├── order/
    │   │   └── order.ts            # Order, CartItem, Pricing
    │   └── timeline/
    │       └── timeline.ts         # TimelineEvent
    ├── hooks/
    │   └── useCart.ts              # Cart state, load, remove, update, checkout
    ├── pages/
    │   ├── MenuPage.tsx            # Product grid + category filter
    │   ├── CartPage.tsx            # Cart review + checkout
    │   ├── OrdersPage.tsx          # Paginated order history
    │   └── OrderTrackPage.tsx      # Live order status + timeline
    └── components/
        ├── Layout/
        │   └── Layout.tsx          # Header + footer wrapper
        ├── ModifierDrawer/
        │   └── ModifierDrawer.tsx  # Slide-in product customizer
        ├── Menu/
        │   ├── MenuPageHeader.tsx
        │   ├── CategoryFilter.tsx
        │   └── ProductCard.tsx
        ├── Cart/
        │   ├── CartItemRow.tsx
        │   └── CartSummary.tsx
        ├── Orders/
        │   ├── OrdersHeader.tsx
        │   ├── OrdersControls.tsx
        │   └── OrderCard.tsx
        └── OrderTrack/
            ├── OrderHeader.tsx
            ├── OrderSummaryCard.tsx
            └── TimelineItem.tsx    # Expand/collapse event details
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend base URL (e.g. `http://localhost:3001`) |

Copy `.env.example` → `.env`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server on port 5173 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm test` | Run Vitest |
| `npm run test:ui` | Vitest UI browser |
| `npm run test:coverage` | Coverage report |

---

## Routes

| Path | Page | Description |
|---|---|---|
| `/` | MenuPage | Browse products, filter by category |
| `/cart` | CartPage | Review items, pricing, checkout |
| `/orders` | OrdersPage | Paginated order history with search |
| `/orders/:orderId` | OrderTrackPage | Live status + collapsible timeline |

---

## Key Components

### ModifierDrawer
Slide-in drawer (right) for product customization.
- Tracks selected modifiers per group
- Enforces `min`/`max` per group
- Disables "Add to cart" until all `required` groups are satisfied
- Shows frontend price estimate (server recalculates on POST)

### CartPage / useCart hook
All cart logic is in `useCart.ts`:
- `loadCart()` — fetches items + server-side pricing
- `removeItem(id)` — DELETE + reload
- `updateQty(id, qty)` — PATCH + reload (qty < 1 triggers remove)
- `checkout()` — POST /orders with `Idempotency-Key`, navigates to tracking

### OrderTrackPage
- Loads order + timeline on mount
- Polls every 4s via `setInterval` (stopped on unmount via `stopRef`)
- Each `TimelineItem` is collapsible (expand to see payload + correlationId + source)

---

## Theme

Dark theme with warm amber (`#D4A373`) as primary color and Playfair Display serif font. Defined in `src/theme/theme.ts` and applied via `ThemeProvider` in `main.tsx`.