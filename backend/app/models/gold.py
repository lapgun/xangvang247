from sqlalchemy import Column, Integer, String, Float, DateTime, Date, Index
from datetime import datetime, date

from app.database import Base


class GoldPrice(Base):
    __tablename__ = "gold_prices"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False)  # SJC, PNJ, DOJI, WORLD
    buy_price = Column(Float, nullable=True)  # Giá mua (VNĐ/lượng hoặc USD/oz)
    sell_price = Column(Float, nullable=True)  # Giá bán
    unit = Column(String(20), default="VND/luong")  # VND/luong hoặc USD/oz
    source = Column(String(100), nullable=True)
    price_date = Column(Date, default=date.today)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("ix_gold_type_date", "type", "price_date"),
    )
