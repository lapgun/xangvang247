from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.routers import gold, fuel
from app.routers import social as social_router
from app.routers import admin as admin_router
from app.routers import tracking as tracking_router
from app.routers import contact as contact_router
from app.tasks.scheduler import start_scheduler, stop_scheduler
from app.services.gold_service import seed_historical_gold_prices
from app.services.fuel_service import seed_historical_fuel_prices
from app.auth import ensure_admin_user


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)

    # Seed historical data and admin user
    db = SessionLocal()
    try:
        ensure_admin_user(db)
        seed_historical_gold_prices(db)
        seed_historical_fuel_prices(db)
    finally:
        db.close()

    start_scheduler()
    yield
    # Shutdown
    stop_scheduler()


app = FastAPI(
    title="XangGiau24h API",
    description="API cung cấp giá xăng dầu và giá vàng Việt Nam",
    version="1.0.0",
    lifespan=lifespan,
)

origins = [o.strip() for o in settings.cors_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(gold.router, prefix="/api/gold", tags=["Gold"])
app.include_router(fuel.router, prefix="/api/fuel", tags=["Fuel"])
app.include_router(social_router.router, prefix="/api/social", tags=["Social"])
app.include_router(admin_router.router, prefix="/api/admin", tags=["Admin"])
app.include_router(tracking_router.router, prefix="/api", tags=["Tracking"])
app.include_router(contact_router.router, prefix="/api", tags=["Contact"])


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
