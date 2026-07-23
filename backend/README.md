# Critters App — Backend

Spring Boot backend. Currently implements **Auth only** (signup/login), with
in-memory storage as a stand-in for a real database — the goal of this stage
is to prove the frontend and backend can actually talk to each other before
wiring up persistence.

## Status

- ✅ `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`
- ✅ JWT-based auth (stateless, no sessions)
- ✅ CORS configured for the frontend's origin
- ⚠️ In-memory storage — **all data is lost on restart.** This is
  intentional for now; see "Next steps" below.
- ⏳ Profile, Quests, Critters endpoints — not yet built

## Running locally

Requires Java 17+ and Maven.

```bash
mvn spring-boot:run
```

Server starts on `http://localhost:8080` by default.

### Testing it works

```bash
# health check — should return {"status":"ok"}
curl http://localhost:8080/api/health

# sign up
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# → returns { "token": "...", "userId": 1, "email": "test@example.com" }

# log in with the same credentials
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# use the returned token to call a protected endpoint
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer <paste token here>"
```

# Profile testing
export TOKEN="paste your token here"

Now every test below can just reference $TOKEN.

1. Rename the profile
```bash
curl -X PATCH http://localhost:8080/api/profile/name \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Sunny Dragon"}'
```

Expected: 200, updated profile with "name": "Sunny Dragon".

2. Add XP — test the level-cascade math

Since level 1's cap is level * 10 = 10, sending a big amount should trigger multiple level-ups in one call:

```bash
curl -X POST http://localhost:8080/api/profile/xp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount":55}'
```

Expected: level should climb past 1 — walk through the math yourself to confirm: level 1 caps at 10 xp, level 2 at 20, level 3 at 30, etc. 55 total xp should land you at level 4 with 5 xp remaining (10+20+30 = 60 consumed getting to level 4's start... let me know what you actually get back and we can verify the cascade math is exactly right).

3. Earn currency
```bash
curl -X POST http://localhost:8080/api/profile/currency/earn \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"currencyKey":"acorns","amount":50}'
```
Expected: 200, "acorns": 50.

4. Spend currency — successful case
```bash
curl -X POST http://localhost:8080/api/profile/currency/spend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"currencyKey":"acorns","amount":20}'
```
Expected: 200, "acorns": 30.

5. Spend currency — insufficient funds (should fail cleanly)
```bash
curl -X POST http://localhost:8080/api/profile/currency/spend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"currencyKey":"acorns","amount":9999}'
```
Expected: 400, {"message": "Not enough acorns."} — confirms InsufficientFundsException is wired correctly, and that acorns weren't touched (spot-check with a GET /api/profile after this — should still show 30, not have gone negative).

6. Invalid currency key
```bash
curl -X POST http://localhost:8080/api/profile/currency/earn \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"currencyKey":"gems","amount":10}'
```
Expected: 400, {"message": "Invalid currency key: gems"} — confirms the IllegalArgumentException handler catches this.

7. Validation failures — blank name
```bash
curl -X PATCH http://localhost:8080/api/profile/name \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":""}'
```
Expected: 400, {"message": "A name is required"} — this is @NotBlank firing before your code even runs.

8. Validation failures — negative XP
```bash
curl -X POST http://localhost:8080/api/profile/xp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount":-5}'
```
Expected: 400, {"message": "Amount cannot be negative"}.

9. No token at all — access control check
```bash
curl -i http://localhost:8080/api/profile
```
(the -i flag shows response headers/status, not just the body — useful here since we care about the status code specifically)

Expected: should be rejected — either 401 or 403 depending on exactly how Spring Security's default unauthenticated-request handling behaves in your config (I haven't verified the precise default status code myself since I can't run this locally). Let me know which one you actually get — if it's 403 and you'd rather it be a more semantically correct 401 Unauthorized for "no/invalid credentials" specifically, that's a small addition (a custom AuthenticationEntryPoint in SecurityConfig) I can add.

10. Invalid/garbage token
```bash
curl -i http://localhost:8080/api/profile \
  -H "Authorization: Bearer not-a-real-token"
```
Expected: same rejection as #9 — JwtUtil.validateAndGetUserId should return null for a malformed token (it catches the parsing exception internally), so JwtAuthFilter never authenticates the request.

## Connecting from the frontend

In `AuthContext.jsx`, replace the local in-memory `login`/`signUp` logic
with `fetch` calls to these endpoints. Store the returned `token`
(`localStorage` is fine for now; something like an httpOnly cookie is more
secure but requires backend changes to set it) and send it on every
subsequent request:

```js
fetch(`${API_BASE_URL}/api/quests`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

Set `API_BASE_URL` via a Vite env var (`VITE_API_BASE_URL`) so it's
`http://localhost:8080` locally and your Render URL in production.

## Deploying to Render

1. Push this backend to its own GitHub repo (or a subfolder, with Render's
   root directory setting pointed at it).
2. New Web Service on Render, pointed at the repo.
3. Build command: `mvn clean package -DskipTests`
4. Start command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
5. Environment variables to set on Render:
   - `JWT_SECRET` — a real random secret (not the dev default in
     `application.yml`)
   - `ALLOWED_ORIGINS` — your Vercel deployment URL, e.g.
     `https://your-app.vercel.app` (comma-separate multiple origins if
     needed, e.g. including a preview-deployment domain pattern)
   - Render sets `PORT` automatically — `application.yml` already reads it.

## Next steps (in order)

1. **Profile** endpoints (`GET/PATCH /api/profile`) — smallest surface area
   after auth, mostly single-row CRUD.
2. **Quests** endpoints (`GET/POST/PATCH/DELETE /api/quests`, tags too).
3. **Critters** endpoints (owned critters, species catalog, companion
   swap logic).
4. **Real database** — swap `UserRepository` (and the new repositories from
   steps 1–3) from in-memory `ConcurrentHashMap`s to real
   `JpaRepository`/`@Entity` classes backed by Postgres (Render offers
   managed Postgres). Because the repository method names already mirror
   Spring Data conventions, this swap should require minimal changes to the
   service layer.
