# Syncord Banking System

A Node.js + Express + MongoDB backend for **customer onboarding**,
**account management**, and **core banking operations**, built to
integrate with the NibssByPhoenix API
(https://nibssbyphoenix.onrender.com/api/docs/#/).

## Status: scaffolded, integration layer stubbed

The NibssByPhoenix docs site blocks automated fetching (robots.txt) and its
exact endpoints/payloads weren't available while building this, so the
integration layer (`src/integrations/nibss-phoenix/nibssPhoenixClient.js`)
is built against best-guess, NIBSS-convention-style endpoints and is
clearly marked with `TODO` comments everywhere something needs confirming
from the real spec.

**Only one file needs real changes once you have the spec:**
`src/integrations/nibss-phoenix/nibssPhoenixClient.js`.
Nothing in the customers/accounts/transactions modules should need to
change, since they only ever talk to NIBSS through that client.

## Architecture

```
src/
  server.js               # entry point: connects DB, starts server
  app.js                  # express app: middleware + route mounting
  config/                 # env config + db connection
  middleware/              # auth guard, validation, error handling
  integrations/
    nibss-phoenix/          # isolated NibssByPhoenix API client
  modules/
    auth/                    # JWT auth for consumers of THIS api
    customers/                # onboarding + KYC (BVN validation via NIBSS)
    accounts/                  # account opening + balance sync via NIBSS
    transactions/                # name enquiry, transfer, reconciliation
  utils/                   # logger, ApiError
```

Each module follows the same pattern: `*.model.js` (Mongoose schema),
`*.validation.js` (Joi schemas), `*.service.js` (business logic),
`*.controller.js` (thin HTTP handlers), `*.routes.js` (Express router).

Design principles:
- **Integration isolation** — all NIBSS calls go through `nibssPhoenixClient`.
  Nothing else does raw HTTP calls to NIBSS.
- **Idempotent transfers** — every transfer generates a UUID reference
  persisted locally *before* calling NIBSS, so failures/timeouts can be
  reconciled via `transactionStatusQuery` instead of risking double-spend.
- **Local mirroring** — accounts/transactions are cached in MongoDB for fast
  reads, while NIBSS remains the source of truth for actual balances/status.
- **Consistent errors** — every error (validation, NIBSS failure, not-found)
  flows through one `errorHandler` middleware via the `ApiError` class or
  `express-async-errors`, so responses always have the same JSON shape.

## Setup

```bash
npm install
cp .env.example .env
# then edit .env with your real MongoDB URI and NibssByPhoenix credentials
npm run dev      # nodemon, auto-restarts on change
# or
npm start        # plain node
```

Requires a running MongoDB instance (local or Atlas) at `MONGODB_URI`.

## Finishing the NIBSS integration

1. Get the OpenAPI/Swagger JSON from NibssByPhoenix (commonly available at
   a path like `/api/docs-json` or `/api-json` on the same host).
2. Update the endpoint paths, auth headers, and payload field names in
   `src/integrations/nibss-phoenix/nibssPhoenixClient.js` to match.
3. Update `.env` with the real `NIBSS_PHOENIX_*` values.

## API Endpoints (this backend, once running)

| Method | Path                                        | Purpose                            | Auth |
|--------|-----------------------------------------------|--------------------------------------|------|
| POST   | /api/v1/customers/onboard                     | Onboard + BVN-validate a customer    | none |
| POST   | /api/v1/auth/login                            | Login, get JWT                       | none |
| GET    | /api/v1/customers                             | List customers                       | JWT  |
| GET    | /api/v1/customers/:id                         | Get one customer                     | JWT  |
| PATCH  | /api/v1/customers/:id                         | Update customer                      | JWT  |
| POST   | /api/v1/accounts                              | Open account (NIBSS) for a customer  | JWT  |
| GET    | /api/v1/accounts/customer/:customerId         | List a customer's accounts           | JWT  |
| GET    | /api/v1/accounts/:accountNumber               | Get one account                      | JWT  |
| GET    | /api/v1/accounts/:accountNumber/balance       | Sync + return balance from NIBSS     | JWT  |
| POST   | /api/v1/transactions/name-enquiry             | NIBSS name enquiry                   | JWT  |
| POST   | /api/v1/transactions/transfer                 | Initiate fund transfer               | JWT  |
| POST   | /api/v1/transactions/:reference/reconcile     | Re-check status with NIBSS           | JWT  |
| GET    | /api/v1/transactions/account/:accountNumber   | Transaction history for account      | JWT  |
| GET    | /api/v1/transactions/:reference               | Get one transaction                  | JWT  |
| GET    | /health                                       | Health check                         | none |

## Notes / next steps

- Add rate limiting tuned to NIBSS's own limits, if any.
- Add webhook handling if NIBSS pushes async transfer status callbacks.
- Add a proper KYC audit trail (who validated what, when) for compliance.
- Consider a queue (BullMQ) for transfers instead of a synchronous call, if
  NIBSS transfers are slow or need retries.
