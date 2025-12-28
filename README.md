# Zee-Commerce 🛒

**Zee-Commerce** is a small e-commerce frontend built with **React** and **Vite**. It demonstrates a real-world single-page application structure with authentication, cart management, product listing, admin flows, and API integration via Axios.

---

## 🔧 Tech stack

- **React 19** (functional components + hooks)
- **Vite** (dev server + build)
- **React Router DOM** for client-side routing
- **Axios** for API requests
- **Bootstrap 5** + **react-bootstrap** for UI
- ESLint for linting

---

## 🚀 Features

- User authentication (login/register) via `authAPI`
- Product listing, search, and detail views
- Shopping cart with localStorage persistence
- Protected routes (user-only and admin-only)
- Admin page for product/order management (scaffolded)
- Clean context-based state: `AuthContext` and `CartContext`

---

## 📁 Project structure (key files)

- `src/App.jsx` — routes and layout
- `src/component/Navbar.jsx` — navigation bar
- `src/pages/` — `Home`, `Products`, `ProductDetail`, `Cart`, `Checkout`, `Login`, `Register`, `Profile`, `Orders`, `Admin`
- `src/context/AuthContext.jsx` — auth provider and helpers
- `src/context/CartContext.jsx` — cart provider and helpers
- `src/service/api.js` — Axios instance + exported API helpers (`authAPI`, `productAPI`, `categoryAPI`, `orderAPI`)

---

## ⚙️ Environment variables

Create a `.env` (or `.env.local`) at project root with:

```env
VITE_API_URL=https://api.example.com
```

`src/service/api.js` reads `import.meta.env.VITE_API_URL` to set the Axios base URL.

---

## 📦 Installation & scripts

Install dependencies:

```bash
npm install
# or
pnpm install
```

Common scripts (see `package.json`):

- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

---

## 🔁 Auth & localStorage

- Tokens are stored under `localStorage.token` and user data under `localStorage.user`.
- Cart is persisted under `localStorage.cart` via `CartContext`.

> Note: For production, consider secure HttpOnly cookies and stronger token handling.

---

## 💡 Development notes & tips

- Protected routes use the `useAuth` hook and `ProtectedRoute` wrapper in `App.jsx`.
- `CartContext` exposes helpers: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `getCartTotal`.
- API helpers in `src/service/api.js` are ready: e.g., `productAPI.getAll()`, `authAPI.login()`.

---

## 📦 Deployment

Build static assets with `npm run build` and deploy to your hosting platform (Netlify, Vercel, GitHub Pages, etc.). Ensure `VITE_API_URL` is set in your environment variables on the hosting provider.

---

## 🤝 Contributing

Contributions are welcome — please open issues or PRs with a clear description. Add unit/integration tests where relevant.

---

## 📜 License

This project is provided as-is. Add a license file (e.g., `LICENSE` with **MIT**) if you intend to make it public.

---

If you'd like, I can also scaffold a `CONTRIBUTING.md`, add more developer scripts, or expand docs for running tests and CI. 🔧

