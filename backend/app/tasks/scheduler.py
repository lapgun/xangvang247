import asyncio
from apscheduler.schedulers.background import BackgroundScheduler

from app.database import SessionLocal
from app.services.gold_service import (
    fetch_world_gold_price,
    crawl_sjc_gold_price,
    save_gold_prices,
)
from app.services.fuel_service import (
    crawl_petrolimex_fuel_price,
    save_fuel_prices,
    seed_default_fuel_prices,
)

scheduler = BackgroundScheduler()


def update_gold_prices():
    """Job: cập nhật giá vàng."""
    print("[CRON] Updating gold prices...")
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    all_prices = []

    world_price = loop.run_until_complete(fetch_world_gold_price())
    if world_price:
        all_prices.append(world_price)

    sjc_prices = loop.run_until_complete(crawl_sjc_gold_price())
    all_prices.extend(sjc_prices)

    if all_prices:
        db = SessionLocal()
        try:
            save_gold_prices(db, all_prices)
            print(f"[CRON] Saved {len(all_prices)} gold prices")
        finally:
            db.close()

    loop.close()


def update_fuel_prices():
    """Job: cập nhật giá xăng dầu."""
    print("[CRON] Updating fuel prices...")
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    prices = loop.run_until_complete(crawl_petrolimex_fuel_price())
    db = SessionLocal()
    try:
        if prices:
            save_fuel_prices(db, prices)
            print(f"[CRON] Saved {len(prices)} fuel prices")
        else:
            seed_default_fuel_prices(db)
            print("[CRON] Seeded default fuel prices")
    finally:
        db.close()
    loop.close()


def start_scheduler():
    """Bắt đầu scheduler."""
    from datetime import datetime

    # Cập nhật giá vàng mỗi giờ
    scheduler.add_job(update_gold_prices, "cron", minute=0, id="gold_update")
    # Cập nhật giá xăng mỗi ngày lúc 8h sáng
    scheduler.add_job(update_fuel_prices, "cron", hour=8, minute=0, id="fuel_update")

    scheduler.start()
    print("[SCHEDULER] Started")

    # Chạy lần đầu trong thread pool của scheduler (tránh conflict event loop)
    scheduler.add_job(update_gold_prices, "date", run_date=datetime.now(), id="gold_initial")
    scheduler.add_job(update_fuel_prices, "date", run_date=datetime.now(), id="fuel_initial")


def stop_scheduler():
    """Dừng scheduler."""
    scheduler.shutdown()
    print("[SCHEDULER] Stopped")
