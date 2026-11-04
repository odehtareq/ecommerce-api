# CORS Configuration

Configured in `src/app.js`.

- Allowed origins come from the `CORS_ORIGINS` environment variable (comma separated). No wildcard (`*`) is used.
- Allowed methods: GET, POST, PUT, PATCH, DELETE.
- Allowed headers: Content-Type, Authorization.
- Development and production use different values of `CORS_ORIGINS` without code changes.

## Test evidence
| Test | Result |
|---|---|
| CORS-01 allowed origin | `Access-Control-Allow-Origin` returned |
| CORS-02 blocked origin | header absent |
| CORS-03 preflight allowed | 204 with allow headers |
| CORS-04 preflight blocked | 204 without CORS headers |

Note: CORS is enforced by browsers only. Authentication and authorization protect the API itself.