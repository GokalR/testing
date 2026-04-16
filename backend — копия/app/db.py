from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

from .config import get_settings

settings = get_settings()

# Railway provides DATABASE_URL as `postgresql://...` — normalize to psycopg3 driver.
_url = settings.database_url
if _url.startswith("postgres://"):
    _url = _url.replace("postgres://", "postgresql+psycopg://", 1)
elif _url.startswith("postgresql://") and "+psycopg" not in _url:
    _url = _url.replace("postgresql://", "postgresql+psycopg://", 1)

# SQLite needs check_same_thread=False for FastAPI's request-scoped sessions.
_connect_args = {"check_same_thread": False} if _url.startswith("sqlite") else {}
engine = create_engine(_url, pool_pre_ping=True, future=True, connect_args=_connect_args)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)
Base = declarative_base()


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
