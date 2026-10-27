# LBOSS SHOP 👑

> **"Shop like a boss."** — A modern, high-performance, production-quality e-commerce storefront built with Vite, React 18/19, TypeScript, Redux Toolkit, RTK Query, and Tailwind CSS.

Powered by the public [DummyJSON API](https://dummyjson.com).

---

## ✨ Features

- **👑 Premium Luxury "Boss" Design System**:
  - Dark theme by default with Electric Gold accents (`#F59E0B`), plus a polished light theme toggle that syncs with `localStorage` and system preferences.
  - Rounded-2xl card geometry, glassmorphism headers, subtle micro-interactions, and skeleton shimmer loaders.
  - Fully responsive from mobile devices to ultrawide desktops.

- **⚡ Fast Product Discovery**:
  - **Live Search**: Debounced autocomplete suggestions (300ms) with instant image preview dropdown in the sticky header.
  - **Department Categories**: Direct categorization and dynamic category browsing.
  - **Shop Page with Sidebar / Mobile Drawer**: Multi-parameter filters including price range sliders, minimum rating filter (4★, 3★, 2★), in-stock toggle, and sorting (Price low/high, highest rated, biggest discount, name A-Z).
  - **Shareable URL Query State**: Filters, searches, and pagination serialize cleanly to query parameters (`?category=&q=&sort=&page=&minPrice=&maxPrice=&rating=&inStock=`).
  - **Quick View Modal**: One-click preview modal with image switching and instant add-to-cart without leaving the page.

- **🛍️ Complete Cart & Slide-In Drawer**:
  - Dual access: Full dedicated `/cart` page and slide-in `CartDrawer` from any page.
  - Real-time calculations: Subtotal, item discount savings, tiered shipping calculations (Free shipping over $100), and 8% estimated sales tax.
  - **Promo Codes**: Client-side promo code engine supporting `BOSS10` (10% off), `BOSS20` (20% off), `FREESHIP` (Free shipping), and `VIP50` ($50 off over $150).
  - Free shipping progress bar indicating how much more is needed to unlock free shipping.

- **💳 Multi-Step Checkout & Simulated Order Flow**:
  - Multi-step wizard: Shipping details (pre-filled with logged-in user profile), Delivery speed selection (Standard, Express, Overnight), Payment details (UI card form with 1-click "Load Demo Card"), and Final Order Review.
  - Confetti celebration upon order placement via `canvas-confetti`.
  - Generates verifiable order IDs (e.g., `LBOSS-824192`) and provides simulated order receipt printing.
  - Calls DummyJSON's simulated `POST /carts/add` endpoint to mirror real-world API handshakes.

- **🔒 Authentication & Protected Routes**:
  - Integrated with DummyJSON `POST /auth/login` and `GET /auth/me`.
  - Pre-configured demo user: **`emilys`** / **`emilyspass`** (with 1-click demo button).
  - Protected route guard (`ProtectedRoute`) that redirects unauthenticated users to `/login?redirect=...`.
  - Session and token persistence in `localStorage`.

- **📦 Order History & Wishlist**:
  - Persistent order history saved locally with item line previews, delivery tracking statuses, and 1-click reorder.
  - Saved Wishlist with quick add-to-cart, remove, and clear all.

- **🚀 Performance & Architecture**:
  - Route-level code splitting using `React.lazy` and `<Suspense>`.
  - Manual vendor chunk splitting in Rollup (`vendor-react`, `vendor-redux`, `vendor-motion`, `vendor-icons`).
  - Image lazy-loading (`loading="lazy"`) with explicit dimensions to eliminate layout shifts (CLS).
  - Fully typed TypeScript data layer.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State & Data Fetching**: [Redux Toolkit](https://redux-toolkit.js.org/) + [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Motion & Transitions**: [Framer Motion](https://www.framer.com/motion/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Effects**: [Canvas Confetti](https://github.com/catdad/canvas-confetti)

---

## 📡 DummyJSON Endpoints Used

| Endpoint | Method | Purpose |
|---|---|---|
| `/products` | `GET` | Paginated product listing (`limit`, `skip`, `sortBy`, `order`, `select`) |
| `/products/search?q={query}` | `GET` | Live autocomplete and search queries |
| `/products/{id}` | `GET` | Individual product specification, warranty, reviews, and dimensions |
| `/products/categories` | `GET` | Full list of category objects (`slug`, `name`, `url`) |
| `/products/category/{slug}` | `GET` | Filtering products by specific department category |
| `/auth/login` | `POST` | Authenticating credentials, issuing JWT `accessToken` and user object |
| `/auth/me` | `GET` | Fetching authenticated user profile data using Bearer token |
| `/users/{id}` | `GET` | Detailed user address and company metadata |
| `/carts/add` | `POST` | Simulated order submission on checkout |

> **⚠️ Note on DummyJSON Limitations:**
> DummyJSON is a mock/read-only REST API. Write operations (`POST /carts/add`, `POST /products/add`, `POST /auth/login`) return simulated payloads and do **not** persist changes permanently to the DummyJSON remote servers. Therefore, **LBOSS SHOP** uses Redux Toolkit paired with robust `localStorage` persistence as the source of truth for the shopping cart, wishlist, placed orders, and active auth tokens.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v20/v24)
- **npm** or **pnpm**

### 2. Installation
```bash
git clone https://github.com/your-username/E-commerce-Store-Redux.git
cd E-commerce-Store-Redux
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
VITE_API_BASE_URL=https://dummyjson.com
```

### 4. Run Development Server
```bash
npm run start
# or
npx vite
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 🔑 Demo Login Account

To explore member features (profile data, checkout, order history):
- **Username**: `emilys`
- **Password**: `emilyspass`

*(A 1-click "Use Demo Account" button is also provided on the `/login` page).*

---

## 🏷️ Built-in Promo Codes

Try entering any of the following coupon codes at `/cart` or `/checkout`:
- **`BOSS10`**: 10% off your entire order
- **`BOSS20`**: 20% off your entire order (VIP exclusive)
- **`FREESHIP`**: Free standard shipping on any order size
- **`VIP50`**: $50 off on orders over $150

---

## ☁️ Deployment to Vercel

This repository includes a pre-configured `vercel.json` for seamless Single Page Application (SPA) routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Deploying via Vercel CLI:
```bash
npm install -g vercel
vercel
```

### Deploying via Vercel Web Dashboard:
1. Push your repository to GitHub or GitLab.
2. Import the project in Vercel.
3. Keep default settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the environment variable:
   - `VITE_API_BASE_URL` = `https://dummyjson.com`
5. Click **Deploy**.

---

## 📄 License

MIT © LBOSS SHOP
