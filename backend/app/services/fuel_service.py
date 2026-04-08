import httpx
import json
import base64
import random
from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session

from app.models.fuel import FuelPrice


# ============================================================
# Petrolimex API configuration
# ============================================================
PETROLIMEX_API_URL = "https://portals.petrolimex.com.vn/~apis/portals/cms.item/search"

PETROLIMEX_FILTER = {
    "FilterBy": {
        "And": [
            {"SystemID": {"Equals": "6783dc1271ff449e95b74a9520964169"}},
            {"RepositoryID": {"Equals": "a95451e23b474fe5886bfb7cf843f53c"}},
            {"RepositoryEntityID": {"Equals": "3801378fe1e045b1afa10de7c5776124"}},
            {"Status": {"Equals": "Published"}},
        ]
    },
    "SortBy": {"LastModified": "Descending"},
    "Pagination": {"TotalRecords": -1, "TotalPages": 0, "PageSize": 0, "PageNumber": 0},
}

# Map Petrolimex alias -> our fuel_type code
ALIAS_MAP = {
    "ron-95-v": "RON95-V",
    "ron-95-iii": "RON95-III",
    "e10-ron-95-iii": "E10_RON95-III",
    "e5-ron-92-ii": "E5RON92-II",
    "do-0001s-v": "DO_0.001S-V",
    "do-005s-ii": "DO_0.05S-II",
    "dau-hoa-2k": "Dau_hoa_2K",
}

# Dữ liệu giá xăng mặc định (cập nhật 08/04/2026)
DEFAULT_FUEL_PRICES = [
    {"fuel_type": "RON95-V", "price": 27130, "region": "Vung1"},
    {"fuel_type": "RON95-V", "price": 27670, "region": "Vung2"},
    {"fuel_type": "RON95-III", "price": 26530, "region": "Vung1"},
    {"fuel_type": "RON95-III", "price": 27060, "region": "Vung2"},
    {"fuel_type": "E10_RON95-III", "price": 25690, "region": "Vung1"},
    {"fuel_type": "E10_RON95-III", "price": 26200, "region": "Vung2"},
    {"fuel_type": "E5RON92-II", "price": 24730, "region": "Vung1"},
    {"fuel_type": "E5RON92-II", "price": 25220, "region": "Vung2"},
    {"fuel_type": "DO_0.001S-V", "price": 43240, "region": "Vung1"},
    {"fuel_type": "DO_0.001S-V", "price": 44100, "region": "Vung2"},
    {"fuel_type": "DO_0.05S-II", "price": 42840, "region": "Vung1"},
    {"fuel_type": "DO_0.05S-II", "price": 43690, "region": "Vung2"},
    {"fuel_type": "Dau_hoa_2K", "price": 43650, "region": "Vung1"},
    {"fuel_type": "Dau_hoa_2K", "price": 44520, "region": "Vung2"},
]


def _build_petrolimex_url() -> str:
    encoded = base64.urlsafe_b64encode(
        json.dumps(PETROLIMEX_FILTER).encode()
    ).decode().rstrip("=")
    return f"{PETROLIMEX_API_URL}?x-request={encoded}"


async def crawl_petrolimex_fuel_price() -> list[dict]:
    """Crawl giá xăng dầu từ Petrolimex API."""
    results = []
    try:
        url = _build_petrolimex_url()
        async with httpx.AsyncClient(timeout=15, verify=False) as client:
            resp = await client.get(
                url,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36",
                    "Accept": "application/json",
                },
            )
            resp.raise_for_status()
            data = resp.json()

            objects = data.get("Objects", [])
            for obj in objects:
                alias = obj.get("Alias", "")
                fuel_type = ALIAS_MAP.get(alias)
                zone1_price = obj.get("Zone1Price")
                zone2_price = obj.get("Zone2Price")

                if fuel_type and zone1_price:
                    results.append({
                        "fuel_type": fuel_type,
                        "price": float(zone1_price),
                        "region": "Vung1",
                        "source": "petrolimex.com.vn",
                    })
                    if zone2_price:
                        results.append({
                            "fuel_type": fuel_type,
                            "price": float(zone2_price),
                            "region": "Vung2",
                            "source": "petrolimex.com.vn",
                        })

        if results:
            print(f"[CRAWL] Petrolimex API: got {len(results)} fuel prices")
    except Exception as e:
        print(f"[ERROR] crawl_petrolimex_fuel_price: {e}")

    return results


def save_fuel_prices(db: Session, prices: list[dict], target_date: date | None = None) -> None:
    """Lưu giá xăng vào database."""
    save_date = target_date or date.today()
    for price_data in prices:
        existing = (
            db.query(FuelPrice)
            .filter(
                FuelPrice.fuel_type == price_data["fuel_type"],
                FuelPrice.region == price_data.get("region", "Vung1"),
                FuelPrice.price_date == save_date,
            )
            .first()
        )
        if existing:
            existing.price = price_data["price"]
            existing.source = price_data.get("source", "manual")
            existing.updated_at = datetime.utcnow()
        else:
            record = FuelPrice(
                fuel_type=price_data["fuel_type"],
                price=price_data["price"],
                region=price_data.get("region", "Vung1"),
                source=price_data.get("source", "manual"),
                price_date=save_date,
            )
            db.add(record)
    db.commit()


def seed_default_fuel_prices(db: Session) -> None:
    """Thêm dữ liệu giá xăng mặc định nếu chưa có."""
    today = date.today()
    existing = db.query(FuelPrice).filter(FuelPrice.price_date == today).first()
    if not existing:
        for fuel in DEFAULT_FUEL_PRICES:
            record = FuelPrice(
                fuel_type=fuel["fuel_type"],
                price=fuel["price"],
                region=fuel["region"],
                source="manual",
                price_date=today,
            )
            db.add(record)
        db.commit()


def seed_historical_fuel_prices(db: Session, days: int = 60) -> None:
    """Tạo dữ liệu lịch sử giá xăng để hiển thị biểu đồ."""
    existing_count = db.query(FuelPrice).count()
    if existing_count > len(DEFAULT_FUEL_PRICES) * 2:
        print("[SEED] Fuel history already exists, skipping")
        return

    print(f"[SEED] Generating {days} days of fuel price history...")
    today = date.today()
    # Tách base prices theo region
    base_prices_by_region: dict[str, dict[str, float]] = {}
    for f in DEFAULT_FUEL_PRICES:
        key = (f["fuel_type"], f["region"])
        base_prices_by_region[key] = f["price"]

    for day_offset in range(days, 0, -1):
        target_date = today - timedelta(days=day_offset)
        daily_prices = []
        for (fuel_type, region), current_price in base_prices_by_region.items():
            variation = random.uniform(-0.08, 0.04)
            day_factor = 1 + variation * (day_offset / days)
            price = round(current_price * day_factor / 10) * 10
            daily_prices.append({
                "fuel_type": fuel_type,
                "price": price,
                "region": region,
                "source": "historical",
            })
        save_fuel_prices(db, daily_prices, target_date=target_date)

    print(f"[SEED] Generated fuel price history for {days} days")


def get_fuel_prices_today(db: Session) -> list[FuelPrice]:
    """Lấy giá xăng hôm nay."""
    today = date.today()
    return db.query(FuelPrice).filter(FuelPrice.price_date == today).all()


def get_fuel_prices_yesterday(db: Session) -> list[FuelPrice]:
    """Lấy giá xăng hôm qua."""
    yesterday = date.today() - timedelta(days=1)
    return db.query(FuelPrice).filter(FuelPrice.price_date == yesterday).all()


def get_fuel_price_history(db: Session, fuel_type: str, days: int = 30) -> list[FuelPrice]:
    """Lấy lịch sử giá xăng."""
    start_date = date.today() - timedelta(days=days)
    return (
        db.query(FuelPrice)
        .filter(
            FuelPrice.fuel_type == fuel_type,
            FuelPrice.price_date >= start_date,
        )
        .order_by(FuelPrice.price_date.asc())
        .all()
    )
