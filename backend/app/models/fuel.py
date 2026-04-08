from sqlalchemy import Column, Integer, String, Float, DateTime, Date, Index
from datetime import datetime, date

from app.database import Base


class FuelPrice(Base):
    __tablename__ = "fuel_prices"

    id = Column(Integer, primary_key=True, index=True)
    fuel_type = Column(String(50), nullable=False)  # RON95-III, RON95-II, E5RON92, DO, Dau_hoa
    price = Column(Float, nullable=False)  # VNĐ/lít
    region = Column(String(50), default="Vung1")  # Vung1, Vung2
    source = Column(String(100), nullable=True)
    effective_date = Column(Date, nullable=True)  # Ngày áp dụng
    price_date = Column(Date, default=date.today)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("ix_fuel_type_date", "fuel_type", "price_date"),
    )
