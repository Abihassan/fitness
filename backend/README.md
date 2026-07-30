# MAKSH backend — deferred, not deleted

This API is intentionally not wired up to the app yet. The frontend runs
entirely on-device (AsyncStorage + SecureStore) — see
`frontend/src/services/DataService.ts` for the seam this backend plugs
into when that changes.

## Current state

- `app/main.py` — one route, `GET /` → health-check style hello world.
- `app/database/database.py` — SQLAlchemy engine + session factory, now
  actually reading `DATABASE_URL` from `.env` (it wasn't being loaded
  before — `load_dotenv()` was missing).
- `requirements.txt` — was literally the text `pip freeze > requirements.txt`
  (that command was never run). Replaced with real, pinned versions
  matching what the existing code imports.
- `.env` — placeholder connection string only, not real credentials.

Nothing here has been expanded — no models, no routes beyond the one
health check, no auth. That's a deliberate scope decision, not an
oversight: building out a real multi-user API is a substantial project on
its own (schema design, migrations, an actual hosting target, real auth
token verification), and doing it before it's needed would mean guessing
at requirements the local-only app doesn't have yet.

## The path back in, when you're ready

The frontend's `DataService` interface
(`frontend/src/services/DataService.ts`) is the exact contract this API
needs to satisfy — one route pair per method (`getRoutines`/`setRoutines`,
`getHistory`/`setHistory`, etc.). Suggested shape once you're ready to
build it out for real:

```
GET    /routines
PUT    /routines
GET    /history
POST   /history            (append one entry)
GET    /achievements
PUT    /achievements
GET    /settings
PUT    /settings
GET    /personalization
PUT    /personalization
```

Steps, in order:
1. Design the actual Postgres schema (SQLAlchemy models) for these
   resources — the frontend's `src/types/index.ts` is the shape to match.
2. Add the routes above to `app/main.py` (or split into routers as it
   grows), reading/writing through `database.py`'s session.
3. Decide on auth — the original Firebase Auth + Google Sign-In
   dependencies were removed from `frontend/package.json` when this build
   went local-only (they were never wired to anything, just installed).
   Re-adding them means: a real Firebase project via your own console, a
   `google-services.json` / `GoogleService-Info.plist`, and a FastAPI
   middleware that verifies the Firebase ID token on each request.
4. Implement `frontend/src/services/remoteDataService.ts` against the
   exact same `DataService` interface, calling these routes instead of
   AsyncStorage.
5. Flip `getDataService()` in `DataService.ts` to return it.

Nothing in `AppDataProvider` or any screen needs to change for that last
step — they only ever depend on the interface.

## Running it locally (as far as it currently goes)

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# .env already has a placeholder DATABASE_URL — point it at a real
# Postgres instance (local or hosted) before anything beyond `GET /` matters
uvicorn app.main:app --reload
```
