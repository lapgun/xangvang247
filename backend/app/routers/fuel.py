from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.fuel_service import (
    get_fuel_prices_today,
    get_fuel_prices_yesterday,
    get_fuel_price_history,
    crawl_petrolimex_fuel_price,
    save_fuel_prices,
    seed_default_fuel_prices,
)

router = APIRouter()

FUEL_TYPE_NAMES = {
    "RON95-V": "Xăng RON 95-V",
    "RON95-III": "Xăng RON 95-III",
    "E10_RON95-III": "Xăng E10 RON 95-III",
    "E5RON92-II": "Xăng E5 RON 92-II",
    "DO_0.001S-V": "Dầu DO 0,001S-V",
    "DO_0.05S-II": "Dầu DO 0,05S-II",
    "Dau_hoa_2K": "Dầu hỏa 2-K",
}

VALID_FUEL_TYPES = set(FUEL_TYPE_NAMES.keys())


@router.get("/today")
async def fuel_prices_today(db: Session = Depends(get_db)):
    """Giá xăng dầu hôm nay."""
    prices = get_fuel_prices_today(db)
    if not prices:
        seed_default_fuel_prices(db)
        prices = get_fuel_prices_today(db)

    # Chỉ trả về các loại xăng dầu hợp lệ (loại bỏ manual cũ)
    prices = [p for p in prices if p.fuel_type in VALID_FUEL_TYPES]

    # Gom theo fuel_type, tách Vùng 1 / Vùng 2
    grouped: dict[str, dict] = {}
    for p in prices:
        if p.fuel_type not in grouped:
            grouped[p.fuel_type] = {
                "fuel_type": p.fuel_type,
                "name": FUEL_TYPE_NAMES.get(p.fuel_type, p.fuel_type),
                "price_vung1": None,
                "price_vung2": None,
                "source": p.source,
                "updated_at": str(p.updated_at),
            }
        if p.region == "Vung1":
            grouped[p.fuel_type]["price_vung1"] = p.price
        elif p.region == "Vung2":
            grouped[p.fuel_type]["price_vung2"] = p.price

    # Sắp xếp theo thứ tự FUEL_TYPE_NAMES
    order = list(FUEL_TYPE_NAMES.keys())
    data = sorted(grouped.values(), key=lambda x: order.index(x["fuel_type"]) if x["fuel_type"] in order else 999)

    return {
        "date": str(prices[0].price_date) if prices else None,
        "data": data,
    }


@router.get("/compare")
async def fuel_prices_compare(db: Session = Depends(get_db)):
    """So sánh giá xăng hôm nay vs hôm qua."""
    today_prices = [p for p in get_fuel_prices_today(db) if p.fuel_type in VALID_FUEL_TYPES]
    yesterday_prices = get_fuel_prices_yesterday(db)

    yesterday_map = {}
    for p in yesterday_prices:
        key = (p.fuel_type, p.region)
        yesterday_map[key] = p

    # Gom theo fuel_type
    grouped: dict[str, dict] = {}
    for p in today_prices:
        if p.fuel_type not in grouped:
            grouped[p.fuel_type] = {
                "fuel_type": p.fuel_type,
                "name": FUEL_TYPE_NAMES.get(p.fuel_type, p.fuel_type),
                "price_vung1": None,
                "price_vung2": None,
                "yesterday_vung1": None,
                "yesterday_vung2": None,
                "change_vung1": None,
                "change_vung2": None,
            }
        y = yesterday_map.get((p.fuel_type, p.region))
        if p.region == "Vung1":
            grouped[p.fuel_type]["price_vung1"] = p.price
            if y:
                grouped[p.fuel_type]["yesterday_vung1"] = y.price
                grouped[p.fuel_type]["change_vung1"] = p.price - y.price
        elif p.region == "Vung2":
            grouped[p.fuel_type]["price_vung2"] = p.price
            if y:
                grouped[p.fuel_type]["yesterday_vung2"] = y.price
                grouped[p.fuel_type]["change_vung2"] = p.price - y.price

    order = list(FUEL_TYPE_NAMES.keys())
    data = sorted(grouped.values(), key=lambda x: order.index(x["fuel_type"]) if x["fuel_type"] in order else 999)

    return {"data": data}


@router.get("/history")
async def fuel_price_history(
    fuel_type: str = Query(default="E5RON92-II"),
    days: int = Query(default=30, le=365),
    db: Session = Depends(get_db),
):
    """Lịch sử giá xăng (dùng cho biểu đồ)."""
    prices = get_fuel_price_history(db, fuel_type, days)
    return {
        "type": fuel_type,
        "name": FUEL_TYPE_NAMES.get(fuel_type, fuel_type),
        "data": [
            {
                "date": str(p.price_date),
                "price": p.price,
            }
            for p in prices
        ],
    }


@router.post("/update")
async def trigger_fuel_update(db: Session = Depends(get_db)):
    """Trigger update giá xăng thủ công."""
    prices = await crawl_petrolimex_fuel_price()
    if prices:
        save_fuel_prices(db, prices)
        return {"status": "updated", "count": len(prices)}
    else:
        seed_default_fuel_prices(db)
        return {"status": "seeded_default"}
