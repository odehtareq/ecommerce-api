# E-commerce REST API

Backend API for products, categories, and users built with Node.js, Express, and Neon PostgreSQL.

## Requirements

- Node.js
- A Neon PostgreSQL project with the `users`, `categories`, and `products` tables
- Postman (for testing)

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file in the project root (copy `.env.example`) and set your own values:

   ```
   PORT=3000
   DATABASE_URL=your_neon_connection_string
   ```

3. Run the server:

   ```
   npm run dev
   ```

The server runs on `http://localhost:3000`.

## Response Format

Success:

```json
{ "success": true, "message": "...", "data": {} }
```

Error:

```json
{ "success": false, "message": "..." }
```

## Endpoints

### Products

| Method | Path | Description | Success |
|---|---|---|---|
| GET | /api/products | List all products | 200 |
| GET | /api/products/:id | Get one product | 200 |
| POST | /api/products | Create a product | 201 |
| PUT | /api/products/:id | Update a product | 200 |
| PATCH | /api/products/:id/deactivate | Deactivate a product | 200 |

### Categories

| Method | Path | Description | Success |
|---|---|---|---|
| GET | /api/categories | List all categories | 200 |
| GET | /api/categories/:id | Get one category | 200 |
| POST | /api/categories | Create a category | 201 |
| PUT | /api/categories/:id | Update a category | 200 |

### Users

| Method | Path | Description | Success |
|---|---|---|---|
| GET | /api/users | List all users | 200 |
| GET | /api/users/:id | Get one user | 200 |
| POST | /api/users | Create a user | 201 |
| PATCH | /api/users/:id/status | Activate or deactivate a user | 200 |

## Error Codes

| Code | Meaning |
|---|---|
| 400 | Missing or invalid data |
| 404 | Record or route not found |
| 409 | Duplicate value (SKU, category name, or email) |
| 500 | Internal server error |

## Request Bodies

**POST /api/products**

```json
{
  "category_id": 1,
  "name": "Wireless Mouse",
  "description": "Rechargeable wireless mouse",
  "price": 18.5,
  "stock_quantity": 20,
  "sku": "MOUSE-001"
}
```

**POST /api/categories**

```json
{ "name": "Category name", "description": "Optional" }
```

**POST /api/users**

```json
{ "full_name": "Test User", "email": "test@example.com", "phone": "0790000000" }
```

**PATCH /api/users/:id/status**

```json
{ "is_active": false }
```

## Testing

The Postman Collection and Environment files are included in the `postman/` folder.