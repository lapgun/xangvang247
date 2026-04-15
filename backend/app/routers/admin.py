from datetime import datetime, date, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.auth import (
    verify_password,
    create_access_token,
    get_current_admin,
)
from app.models.user import User
from app.models.gold import GoldPrice
from app.models.fuel import FuelPrice
from app.models.pageview import PageView
from app.config import settings
from app.services.social_post_service import run_social_autopost

router = APIRouter()


class SocialJobTestRequest(BaseModel):
    force: bool = True
    test_tiktok: bool = False
    tiktok_test_key: str | None = None


@router.post("/login")
async def admin_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Admin login - returns JWT token."""
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên đăng nhập hoặc mật khẩu không đúng",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập",
        )

    user.last_login = datetime.utcnow()
    db.commit()

    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
async def admin_me(current_user: User = Depends(get_current_admin)):
    """Get current admin info."""
    return {
        "username": current_user.username,
        "is_admin": current_user.is_admin,
        "last_login": str(current_user.last_login) if current_user.last_login else None,
    }


@router.get("/dashboard")
async def admin_dashboard(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin dashboard - overview statistics."""
    today = date.today()
    yesterday = today - timedelta(days=1)

    # Count records
    gold_today = db.query(func.count(GoldPrice.id)).filter(
        GoldPrice.price_date == today
    ).scalar()
    fuel_today = db.query(func.count(FuelPrice.id)).filter(
        FuelPrice.price_date == today
    ).scalar()
    gold_total = db.query(func.count(GoldPrice.id)).scalar()
    fuel_total = db.query(func.count(FuelPrice.id)).scalar()

    # Date range of data
    gold_first = db.query(func.min(GoldPrice.price_date)).scalar()
    fuel_first = db.query(func.min(FuelPrice.price_date)).scalar()

    # Latest update times
    gold_latest = db.query(func.max(GoldPrice.updated_at)).scalar()
    fuel_latest = db.query(func.max(FuelPrice.updated_at)).scalar()

    return {
        "overview": {
            "gold_records_today": gold_today,
            "fuel_records_today": fuel_today,
            "gold_total_records": gold_total,
            "fuel_total_records": fuel_total,
            "gold_data_since": str(gold_first) if gold_first else None,
            "fuel_data_since": str(fuel_first) if fuel_first else None,
            "gold_last_updated": str(gold_latest) if gold_latest else None,
            "fuel_last_updated": str(fuel_latest) if fuel_latest else None,
        },
        "adsense": {
            "note": "Integrate Google AdSense tracking via Google Analytics API or AdSense Management API",
            "setup_guide": "https://developers.google.com/adsense/management",
            "tip": "Add GA4 tracking code to frontend, then use GA4 Reporting API for traffic data",
        },
    }


@router.get("/stats/prices")
async def admin_price_stats(
    days: int = 7,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Price update statistics for the last N days."""
    start_date = date.today() - timedelta(days=days)

    gold_by_date = (
        db.query(
            GoldPrice.price_date,
            func.count(GoldPrice.id).label("count"),
        )
        .filter(GoldPrice.price_date >= start_date)
        .group_by(GoldPrice.price_date)
        .order_by(GoldPrice.price_date.desc())
        .all()
    )

    fuel_by_date = (
        db.query(
            FuelPrice.price_date,
            func.count(FuelPrice.id).label("count"),
        )
        .filter(FuelPrice.price_date >= start_date)
        .group_by(FuelPrice.price_date)
        .order_by(FuelPrice.price_date.desc())
        .all()
    )

    return {
        "gold_updates": [
            {"date": str(row.price_date), "count": row.count} for row in gold_by_date
        ],
        "fuel_updates": [
            {"date": str(row.price_date), "count": row.count} for row in fuel_by_date
        ],
    }


@router.get("/stats/visitors")
async def admin_visitor_stats(
    days: int = 30,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Visitor statistics for the last N days."""
    today = date.today()
    start_date = today - timedelta(days=days)

    # Total pageviews today
    views_today = (
        db.query(func.count(PageView.id))
        .filter(PageView.view_date == today)
        .scalar()
    )

    # Unique visitors today (by ip_hash)
    unique_today = (
        db.query(func.count(func.distinct(PageView.ip_hash)))
        .filter(PageView.view_date == today)
        .scalar()
    )

    # Pageviews by date
    daily_views = (
        db.query(
            PageView.view_date,
            func.count(PageView.id).label("views"),
            func.count(func.distinct(PageView.ip_hash)).label("unique_visitors"),
        )
        .filter(PageView.view_date >= start_date)
        .group_by(PageView.view_date)
        .order_by(PageView.view_date.desc())
        .all()
    )

    # Top pages today
    top_pages = (
        db.query(
            PageView.path,
            func.count(PageView.id).label("views"),
        )
        .filter(PageView.view_date == today)
        .group_by(PageView.path)
        .order_by(func.count(PageView.id).desc())
        .limit(10)
        .all()
    )

    # Total all time
    total_views = db.query(func.count(PageView.id)).scalar()
    total_unique = db.query(func.count(func.distinct(PageView.ip_hash))).scalar()

    return {
        "today": {
            "views": views_today,
            "unique_visitors": unique_today,
        },
        "total": {
            "views": total_views,
            "unique_visitors": total_unique,
        },
        "daily": [
            {
                "date": str(row.view_date),
                "views": row.views,
                "unique_visitors": row.unique_visitors,
            }
            for row in daily_views
        ],
        "top_pages": [
            {"path": row.path, "views": row.views} for row in top_pages
        ],
    }


@router.post("/social/test")
async def admin_test_social_job(
    body: SocialJobTestRequest,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Trigger social autopost job manually from admin."""
    _ = current_user

    if body.test_tiktok:
        if not settings.tiktok_test_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="TIKTOK_TEST_KEY chưa được cấu hình",
            )
        if body.tiktok_test_key != settings.tiktok_test_key:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Tiktok test key không hợp lệ",
            )

    result = run_social_autopost(
        db,
        force=body.force,
        tiktok_test_mode=body.test_tiktok,
        tiktok_test_key=body.tiktok_test_key,
    )
    return result
