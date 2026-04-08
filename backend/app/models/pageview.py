from sqlalchemy import Column, Integer, String, DateTime, Date, Index
from datetime import datetime, date

from app.database import Base


class PageView(Base):
    __tablename__ = "page_views"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String(500), nullable=False)
    ip_hash = Column(String(64), nullable=True)  # SHA256 hash, not raw IP
    user_agent = Column(String(500), nullable=True)
    referrer = Column(String(500), nullable=True)
    view_date = Column(Date, default=date.today)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("ix_pageview_date", "view_date"),
        Index("ix_pageview_path_date", "path", "view_date"),
    )
