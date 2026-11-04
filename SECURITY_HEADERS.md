# Security Headers (Helmet)

Helmet is enabled in `src/app.js` before all routes: `app.use(helmet())`.

## Before vs after
- Before: responses exposed `X-Powered-By: Express` and had no security headers (evidence: HDR-BEFORE.png).
- After: `X-Powered-By` is removed and security headers are present (evidence: HDR-AFTER.png, test HDR-01).

## Documented headers

| Header | Purpose |
|---|---|
| `X-Content-Type-Options: nosniff` | Stops the browser from guessing file types (MIME sniffing), which reduces the risk of data being run as a script. |
| `Strict-Transport-Security` | Tells browsers to use HTTPS only for this site, which protects against downgrade and man-in-the-middle attacks. |
| `Content-Security-Policy` | Restricts where scripts, styles and images can load from, which reduces the impact of XSS. |
| `X-Frame-Options: SAMEORIGIN` | Prevents other sites from embedding this site in a frame (clickjacking). |
| `X-Powered-By` (removed) | Hides the framework name so attackers learn less about the stack. |

## Configuration
Default Helmet settings are used. No protection was disabled.