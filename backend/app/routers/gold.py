from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.gold_service import (
    get_gold_prices_today,
    get_gold_prices_yesterday,
    get_gold_price_history,
    fetch_world_gold_price,
    crawl_sjc_gold_price,
    save_gold_prices,
    seed_default_gold_prices,
)

router = APIRouter()


@router.get("/today")
async def gold_prices_today(db: Session = Depends(get_db)):
    """Giá vàng hôm nay."""
    prices = get_gold_prices_today(db)
    if not prices:
        # Nếu chưa có data, thử fetch
        await update_gold_data(db)
        prices = get_gold_prices_today(db)
    if not prices:
        # Nếu fetch thất bại, seed dữ liệu mặc định
        seed_default_gold_prices(db)
        prices = get_gold_prices_today(db)

    return {
        "date": str(prices[0].price_date) if prices else None,
        "data": [
            {
                "type": p.type,
                "buy_price": p.buy_price,
                "sell_price": p.sell_price,
                "unit": p.unit,
                "source": p.source,
                "updated_at": str(p.updated_at),
            }
            for p in prices
        ],
    }


@router.get("/compare")
async def gold_prices_compare(db: Session = Depends(get_db)):
    """So sánh giá vàng hôm nay vs hôm qua."""
    today_prices = get_gold_prices_today(db)
    yesterday_prices = get_gold_prices_yesterday(db)

    yesterday_map = {p.type: p for p in yesterday_prices}

    comparison = []
    for p in today_prices:
        y = yesterday_map.get(p.type)
        change_buy = (p.buy_price - y.buy_price) if y and p.buy_price and y.buy_price else None
        change_sell = (p.sell_price - y.sell_price) if y and p.sell_price and y.sell_price else None
        comparison.append({
            "type": p.type,
            "buy_price": p.buy_price,
            "sell_price": p.sell_price,
            "yesterday_buy": y.buy_price if y else None,
            "yesterday_sell": y.sell_price if y else None,
            "change_buy": change_buy,
            "change_sell": change_sell,
            "unit": p.unit,
        })

    return {"data": comparison}


@router.get("/history")
async def gold_price_history(
    gold_type: str = Query(default="SJC"),
    days: int = Query(default=30, le=365),
    db: Session = Depends(get_db),
):
    """Lịch sử giá vàng (dùng cho biểu đồ)."""
    prices = get_gold_price_history(db, gold_type, days)
    return {
        "type": gold_type,
        "data": [
            {
                "date": str(p.price_date),
                "buy_price": p.buy_price,
                "sell_price": p.sell_price,
            }
            for p in prices
        ],
    }


@router.post("/update")
async def trigger_gold_update(db: Session = Depends(get_db)):
    """Trigger update giá vàng thủ công."""
    await update_gold_data(db)
    return {"status": "updated"}


async def update_gold_data(db: Session):
    """Fetch và lưu tất cả giá vàng."""
    all_prices = []

    world_price = await fetch_world_gold_price()
    if world_price:
        all_prices.append(world_price)

    sjc_prices = await crawl_sjc_gold_price()
    all_prices.extend(sjc_prices)

    if all_prices:
        save_gold_prices(db, all_prices)
