# SQL Injection - Before and After

## Before (vulnerable pattern, shown for illustration only, NOT used in the project)

```js
// User input is concatenated directly into the SQL string
const query = `SELECT * FROM products WHERE name ILIKE '%${search}%'`;
const result = await pool.query(query);
```

**Attack input:** `search=' OR '1'='1`
**Resulting SQL:** `SELECT * FROM products WHERE name ILIKE '%' OR '1'='1%'`
**Impact:** The attacker changes the query logic and can read data they should not see, or run extra statements.

## After (implemented in productsController.js, getProducts)

```js
const result = await pool.query(
  `SELECT id, category_id, name, description, price, stock_quantity, sku, is_active, created_at
   FROM products
   WHERE name ILIKE $1
   ORDER BY id DESC`,
  [`%${search}%`]
);
```

**Same attack input:** `search=' OR '1'='1`
**Result:** The value is sent as a separate parameter and treated as plain text. The query structure does not change.
**Postman evidence:** SEC-10 returns 200 with `count: 0`.

## Other protections in the project
- All controllers use `$1, $2, ...` placeholders with separate values.
- ID parameters are validated as positive integers (express-validator) and return 400 otherwise (SEC-13, SEC-14).
- `USER_COLUMNS` in usersController.js is a constant defined in code, not user input, so it is safe.