import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .db import Base, engine
from .routes import analyze, excel, submissions

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("nbu-rs")

settings = get_settings()

app = FastAPI(
    title="NBU Regional Strategist API",
    version="0.1.0",
    description="Backend for the Региональный стратег service: submissions, Excel uploads, Claude analysis.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(submissions.router)
app.include_router(excel.router)
app.include_router(analyze.router)


@app.on_event("startup")
def on_startup():
    """Create tables if they don't exist. Use Alembic for real migrations in prod."""
    try:
        Base.metadata.create_all(bind=engine)
        log.info("DB schema ensured.")
    except Exception as e:
        log.error("Could not ensure DB schema: %s", e)


@app.get("/health", tags=["meta"])
def health():
    return {
        "status": "ok",
        "env": settings.app_env,
        "model": settings.anthropic_model,
        "anthropicConfigured": bool(settings.anthropic_api_key),
    }


@app.get("/", tags=["meta"])
def root():
    return {"service": "nbu-regional-strategist", "docs": "/docs"}
