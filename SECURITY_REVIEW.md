# Security Review - E-commerce API

**Scope:** Local project only (ecommerce-api).
**Date:** 2026-10-30
**Reviewer:** Student

No secrets or connection strings are included in this document.

---

## Summary

| # | Issue | Location | Severity |
|---|-------|----------|----------|
| 1 | No authentication (no login / JWT) | All routes | Critical |
| 2 | No authorization / roles | productsRoutes.js, categoriesRoutes.js, usersRoutes.js | Critical |
| 3 | No password storage or hashing | usersController.js (createUser), users table | High |
| 4 | User data exposed to anyone (IDOR / data exposure) | GET /api/users, GET /api/users/:id | High |
| 5 | Weak input validation | productsController.js, usersController.js, categoriesController.js | High |
| 6 | CORS open to all origins | app.js | Medium |
| 7 | No Helmet (missing security headers) | app.js | Medium |
| 8 | No rate limiting | app.js | Medium |
| 9 | DB SSL certificate verification disabled | config/database.js | Medium |
| 10 | Incomplete .gitignore | .gitignore | Low |
| 11 | SELECT * returns all columns | getProductById, getCategoryById | Low |
| 12 | error.message returned for non-500 errors | middleware/errorHandler.js | Low |

---

## Details

### 1. No authentication
- **Location:** all routes in app.js
- **Risk:** Anyone can call any endpoint without proving identity.
- **Severity:** Critical
- **Evidence:** `POST /api/products` succeeds without any Authorization header.
- **Proposed fix:** Add register/login with bcrypt and JWT, plus an `authenticate` middleware.

### 2. No authorization (roles)
- **Location:** productsRoutes.js, categoriesRoutes.js, usersRoutes.js
- **Risk:** Any anonymous caller can create, update or deactivate products, categories and users.
- **Severity:** Critical
- **Evidence:** `PATCH /api/users/1/status` works without a token.
- **Proposed fix:** Add roles (customer, admin) and an `authorize` middleware returning 403.

### 3. No password storage or hashing
- **Location:** usersController.js (createUser)
- **Risk:** The system has no secure credential handling; adding passwords in plain text later would expose accounts in a data leak.
- **Severity:** High
- **Proposed fix:** Add a `password_hash` column and hash with bcrypt (12 rounds). Never return it in responses.

### 4. User data exposed to anyone
- **Location:** GET /api/users, GET /api/users/:id
- **Risk:** Emails and phone numbers of all users are public; any ID can be read (IDOR).
- **Severity:** High
- **Evidence:** `GET /api/users/2` returns another user's data with no token.
- **Proposed fix:** Admin-only list; users may read only their own record (compare req.user.id with the requested id).

### 5. Weak input validation
- **Location:** productsController.js, usersController.js, categoriesController.js
- **Risk:** No type checks (e.g. price as a string), no max lengths, weak email check (`includes("@")`), no role validation. Large or malformed input can break data or cause abuse.
- **Severity:** High
- **Proposed fix:** Use express-validator with length limits, types, and a unified error response.

### 6. CORS open to all origins
- **Location:** app.js (`app.use(cors())`)
- **Risk:** Any website can call the API from a browser.
- **Severity:** Medium
- **Proposed fix:** Restrict origins, methods and headers through environment variables.

### 7. Missing security headers
- **Location:** app.js
- **Risk:** Responses expose `X-Powered-By: Express` and lack protections like CSP and X-Content-Type-Options.
- **Severity:** Medium
- **Proposed fix:** Add `helmet()` before the routes.

### 8. No rate limiting
- **Location:** app.js
- **Risk:** Brute-force login attempts and API abuse.
- **Severity:** Medium
- **Proposed fix:** Add express-rate-limit globally and a stricter limit on /api/auth/login.

### 9. DB SSL certificate verification disabled
- **Location:** config/database.js (`rejectUnauthorized: false`)
- **Risk:** The DB connection could be intercepted (man-in-the-middle).
- **Severity:** Medium
- **Proposed fix:** Rely on `sslmode=require` in the connection string and enable certificate verification.

### 10. Incomplete .gitignore
- **Location:** .gitignore
- **Risk:** Log files could leak sensitive data to the repository.
- **Severity:** Low
- **Proposed fix:** Add `*.log` and `.DS_Store`.

### 11. SELECT * returns all columns
- **Location:** getProductById, getCategoryById
- **Risk:** New sensitive columns added later would be exposed automatically.
- **Severity:** Low
- **Proposed fix:** Select explicit column names.

### 12. error.message returned for non-500 errors
- **Location:** middleware/errorHandler.js
- **Risk:** Internal error text could leak to the client.
- **Severity:** Low
- **Proposed fix:** Return controlled messages only.

---

## Positive findings
- All SQL queries in the controllers use parameterized queries ($1, $2...), so no SQL Injection was found.
- ID parameters are validated as positive integers.
- 500 errors return a generic message and no stack trace.
- `.env` is not tracked by Git.