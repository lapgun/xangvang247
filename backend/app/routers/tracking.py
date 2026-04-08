import hashlib
from datetime import date, timedelta

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.pageview import PageView

router = APIRouter()


class TrackRequest(BaseModel):
    path: str
    referrer: str | None = None


@router.post("/track")
async def track_pageview(
    body: TrackRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """Record a page view. Public endpoint, no auth required."""
    # Hash the IP for privacy — never store raw IP
    client_ip = request.client.host if request.client else "unknown"
    ip_hash = hashlib.sha256(client_ip.encode()).hexdigest()

    user_agent = request.headers.get("user-agent", "")[:500]
    referrer = (body.referrer or "")[:500]
    path = body.path[:500]

    pv = PageView(
        path=path,
        ip_hash=ip_hash,
        user_agent=user_agent,
        referrer=referrer,
        view_date=date.today(),
    )
    db.add(pv)
    db.commit()

    return {"ok": True}
