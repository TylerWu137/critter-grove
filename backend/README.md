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
