# Zee-Commerce 🛒

## 📌 Project overview

**Zee-Commerce** is a lightweight, example e-commerce frontend built with **React** and **Vite**. It simulates a production-style online store and provides a practical reference implementation for common e-commerce features such as authentication, product browsing, cart management, checkout flows, and admin operations.

### What problem it solves

- Provides a working frontend scaffold for teams and learners who want to build a modern single-page e-commerce app quickly.
- Demonstrates secure client-server patterns (JWT auth), persistent shopping cart (localStorage), and role-based route protection (user/admin).
- Serves as a starter template to prototype UI and integration with a backend API (e.g., Spring Boot).

### Who it's for

- Frontend developers learning React + Vite and best practices.
- Teams prototyping e-commerce features and flows.
- Instructors who need a compact, real-world example to teach web application concepts.

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

---

## 🗂 Detailed folder structure

Below is a recommended, detailed folder structure to make the codebase easier to navigate and maintain:

```
/ (project root)
├─ public/                         # static assets
├─ src/
│  ├─ assets/                      # images, icons, fonts
│  ├─ component/                   # shared UI components (Navbar, Card, ProductList)
│  │  └─ Navbar.jsx
│  ├─ context/                     # React Contexts & hooks
│  │  ├─ AuthContext.jsx
│  │  ├─ CartContext.jsx
│  │  ├─ useAuth.js
│  │  └─ useCart.js
│  ├─ pages/                       # route-level pages
│  │  ├─ Home.jsx
│  │  ├─ Products.jsx
│  │  ├─ ProductDetail.jsx
│  │  ├─ Cart.jsx
│  │  ├─ Checkout.jsx
│  │  ├─ Login.jsx
│  │  ├─ Register.jsx
│  │  ├─ Profile.jsx
│  │  ├─ Orders.jsx
│  │  └─ Admin.jsx
│  ├─ service/                     # API client & service helpers
│  │  └─ api.js
│  ├─ styles/                      # global styles (if used)
│  ├─ App.jsx                      # routes + layout
│  └─ main.jsx                     # app entry
├─ .env                            # environment variables (local)
├─ package.json
└─ README.md
```

Notes:
- Keep UI components small and reusable (stateless where possible).
- Pages hold page-level logic and aggregate components.
- `service/api.js` centralizes the Axios instance and endpoint helpers.

---

## 🖥️ Backend — API & Java (Spring) Security

This frontend expects a RESTful backend with JWT-based authentication. Below are recommended endpoints, request/response shapes, and a brief Spring Boot security overview you can use on the server side.

### API contract (typical endpoints)

- Authentication
  - POST `/auth/login` — { email, password } -> { token, user }
  - POST `/auth/register` — { name, email, password } -> { user }
- Products
  - GET `/products` -> list of products
  - GET `/products/{id}` -> single product
  - GET `/products/search?keyword=...` -> filtered list
  - GET `/products/category/{categoryId}` -> products by category
  - (Admin) POST `/products` -> create product
  - (Admin) PUT `/products/{id}` -> update product
  - (Admin) DELETE `/products/{id}` -> delete product
- Categories
  - GET `/categories` -> list
  - CRUD endpoints for admin
- Orders
  - POST `/orders` -> create order (authenticated)
  - GET `/orders/user/{userId}` -> user orders (authenticated)
  - GET `/orders` -> admin list

> Frontend note: `src/service/api.js` attaches `Authorization: Bearer <token>` on every request; backend must accept Bearer tokens.

### Example auth response

```json
POST /auth/login
Request: { "email": "user@example.com", "password": "password" }
Response: {
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "name": "Alice",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

### Spring Boot — recommended dependencies

- spring-boot-starter-web
- spring-boot-starter-security
- spring-boot-starter-data-jpa
- io.jsonwebtoken (jjwt) or spring-security-oauth2-jose for JWT handling
- spring-boot-starter-validation
- database driver (Postgres/MySQL)

### Basic Spring Security idea (JWT)

- Use `UserDetailsService` to load user by username (email).
- Use `BCryptPasswordEncoder` to encode passwords.
- Generate JWT on successful login (store secret key in env vars)
- Install a `JwtAuthenticationFilter` to validate Bearer tokens and populate SecurityContext
- Expose `/auth/**` as permitAll, protect other endpoints; restrict admin-only endpoints by `hasRole('ADMIN')`.

Example `application.properties` (key entries):

```properties
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:5432/yourdb
spring.datasource.username=${DB_USER:postgres}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update

# JWT settings
app.jwt.secret=${JWT_SECRET:change_this}
app.jwt.expiration-ms=${JWT_EXP_MS:3600000}
```

Example `SecurityConfig` (conceptual):

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  @Autowired private JwtAuthenticationFilter jwtFilter;
  @Bean public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

  protected void configure(HttpSecurity http) throws Exception {
    http.csrf().disable()
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
        .authorizeRequests()
          .antMatchers("/auth/**").permitAll()
          .antMatchers("/admin/**").hasRole("ADMIN")
          .anyRequest().authenticated();

    http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
  }
}
```

Security considerations & tips:
- Store the `JWT_SECRET` securely (not in repo). Use environment variables or secret manager.
- For browser clients, consider storing tokens in secure, HttpOnly cookies to mitigate XSS — the current frontend uses localStorage for simplicity but consider migration to cookies for production.
- Implement token expiration and refresh flow (refresh tokens or silent re-login).
- Validate user roles on server-side for privileged actions (product CRUD, order management).

---

## 🔁 Local dev tips for using local backend

- Set `VITE_API_URL` to your backend during local development, for example:

```
VITE_API_URL=http://localhost:8080
```

- If your backend is on a different origin, ensure CORS is enabled (`/auth/**`, `/products/**`, `/orders/**`).

---

If you'd like, I can also create:
- A short `API.md` with full request/response examples and DTO shapes, or
- A minimal Spring Boot skeleton repository showing the `auth` flow and security config.

Tell me which one you'd like next and I'll scaffold it. 🔧

