# NBU Regional Strategist — Backend

FastAPI + SQLite (local) / Postgres (prod) + Anthropic Claude. Backs the Vue "Региональный стратег" service.

## What it does

1. Stores user submissions (profile + finance from Steps 1–4).
2. Accepts Excel uploads of Uzbek standard **Форма 1 (Баланс)** and **Форма 2 (Молиявий натижа)**.
3. Parses the files by сатр коди (line codes) and computes 12 standard ratios.
4. Compares the user's ratios to `peer_benchmarks.json` (4 Fergana SME peers).
5. Sends a compact structured prompt to Claude and stores the JSON response.

Raw Excel blobs are **not** persisted by default — only extracted ratios. Flip the `raw_blob` field in `models.py` if you need full retention for audit.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/submissions` | Create a submission with profile + finance |
| `GET`  | `/submissions/{id}` | Fetch one |
| `PATCH`| `/submissions/{id}` | Update profile/finance/lang |
| `POST` | `/submissions/{id}/uploads` | Multipart upload: `kind=balance\|pnl`, `file=…` |
| `GET`  | `/submissions/{id}/uploads` | List uploads with parsed codes + ratios |
| `POST` | `/submissions/{id}/analysis` | Run Claude analysis |
| `GET`  | `/submissions/{id}/analysis/latest` | Last saved analysis |
| `GET`  | `/health` | Env + model + anthropic-configured flag |
| `GET`  | `/docs` | Interactive Swagger UI |

## Local setup (zero config — SQLite + uvicorn)

```bash
# 1. Python 3.11+
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 2. Config — only ANTHROPIC_API_KEY is required for local dev.
#    DATABASE_URL defaults to sqlite:///./nbu_rs.db (file created on first run).
cp .env.example .env
#    edit .env — paste your ANTHROPIC_API_KEY

# 3. Run
uvicorn app.main:app --reload --port 8000
# Open http://localhost:8000/docs — tables auto-create on first request.
```

## Running the full stack locally

Two terminals, from repo root:

**Terminal 1 — backend:**
```bash
cd NBU_analytics/backend
source .venv/bin/activate        # Windows: .venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — frontend:**
```bash
cd NBU_analytics/frontend
npm install                       # first time only
npm run dev                       # http://localhost:5173
```

`frontend/.env.local` ships with `VITE_API_URL=http://localhost:8000`. With that set, Step 2 uploads will parse real Excel files through the backend and Step 5 will call Claude. Without it, the app falls back to the deterministic local demo generator.

## Deploying to Railway

1. Create a new Railway project.
2. Add a **Postgres** plugin — Railway sets `DATABASE_URL` on the service automatically.
3. Add a new service pointing at this `backend/` folder (GitHub deploy or `railway up`).
4. Environment variables to set in Railway's UI:
   - `ANTHROPIC_API_KEY` — your Anthropic key
   - `ANTHROPIC_MODEL` — `claude-sonnet-4-6` (recommended) or `claude-opus-4-6`
   - `CORS_ORIGINS` — your frontend URL, e.g. `https://nbu-rs.vercel.app`
   - `SESSION_SECRET` — random 32+ char string
5. Deploy. Railway runs `uvicorn app.main:app --host 0.0.0.0 --port $PORT` from `railway.json`.
6. Verify: open `https://<your-service>.up.railway.app/health`.

### Notes

- First request creates tables via `Base.metadata.create_all`. For schema changes later, add Alembic (`pip install alembic && alembic init alembic`).
- `psycopg` v3 handles both `postgresql://` and `postgresql+psycopg://` — the db layer normalizes Railway's URL automatically.

## Config reference

See [.env.example](.env.example). Key knobs:

| Key | Default | Notes |
|---|---|---|
| `DATABASE_URL` | local pg | Railway injects this. |
| `ANTHROPIC_MODEL` | `claude-sonnet-4-6` | `claude-opus-4-6` for higher quality, ~5× cost. |
| `ANTHROPIC_MAX_TOKENS` | 2000 | Output cap per analysis. |
| `MAX_UPLOAD_BYTES` | 5 MB | Per-file upload limit. |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated list. |

## Data flow

```
Vue Step 4 ─POST /submissions─▶ { id }
Vue upload─POST /submissions/{id}/uploads (balance.xlsx)
Vue upload─POST /submissions/{id}/uploads (pnl.xlsx)
Vue Step 5─POST /submissions/{id}/analysis─▶ Claude, stores result
Vue Step 5─GET  /submissions/{id}/analysis/latest
```
