from datetime import date
from typing import Literal

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.gold_service import get_gold_prices_today, seed_default_gold_prices
from app.services.fuel_service import get_fuel_prices_today, seed_default_fuel_prices

router = APIRouter()


class RenderPayloadRequest(BaseModel):
    platform: Literal["facebook", "tiktok", "general"] = "general"
    template: str | None = None
    utm_source: str = "social"
    utm_medium: str = "auto"
    utm_campaign: str = "daily-update"


def _format_vnd(value: float | int | None) -> str:
    if value is None:
        return "-"
    try:
        return f"{int(round(float(value))):,}".replace(",", ".")
    except (ValueError, TypeError):
        return "-"


def _format_usd(value: float | int | None) -> str:
    if value is None:
        return "-"
    try:
        return f"${float(value):,.2f}"
    except (ValueError, TypeError):
        return "-"


def _build_summary_payload(
    db: Session,
    utm_source: str,
    utm_medium: str,
    utm_campaign: str,
) -> dict:
    gold_prices = get_gold_prices_today(db)
    fuel_prices = get_fuel_prices_today(db)

    if not gold_prices:
        seed_default_gold_prices(db)
        gold_prices = get_gold_prices_today(db)

    if not fuel_prices:
        seed_default_fuel_prices(db)
        fuel_prices = get_fuel_prices_today(db)

    gold_map = {p.type: p for p in gold_prices}

    ron95_v1 = next(
        (
            p
            for p in fuel_prices
            if p.fuel_type == "RON95-III" and p.region == "Vung1"
        ),
        None,
    )

    report_date = (
        str(gold_prices[0].price_date)
        if gold_prices
        else str(fuel_prices[0].price_date)
        if fuel_prices
        else str(date.today())
    )

    site_url = "https://xangvang24h.vn"
    utm_query = f"utm_source={utm_source}&utm_medium={utm_medium}&utm_campaign={utm_campaign}"

    links = {
        "home": f"{site_url}/?{utm_query}",
        "gold": f"{site_url}/gia-vang?{utm_query}",
        "fuel": f"{site_url}/gia-xang?{utm_query}",
        "gold_sjc": f"{site_url}/gia-vang-sjc?{utm_query}",
        "gold_nhan": f"{site_url}/gia-vang-nhan?{utm_query}",
        "gold_world": f"{site_url}/gia-vang-the-gioi?{utm_query}",
        "fuel_ron95": f"{site_url}/gia-xang-ron-95?{utm_query}",
    }

    sjc_sell = gold_map.get("SJC").sell_price if gold_map.get("SJC") else None
    world_sell = gold_map.get("WORLD").sell_price if gold_map.get("WORLD") else None
    ron95_price = ron95_v1.price if ron95_v1 else None

    hashtags = {
        "common": ["#giaxang", "#giavang", "#xanggiau24h"],
        "facebook": ["#giaxang", "#giavang", "#xanggiau24h"],
        "tiktok": ["#giaxang", "#giavang", "#xanggiau24h", "#tintuc"],
    }

    title_variants = [
        f"Bản tin giá xăng và vàng ngày {report_date}",
        f"Giá vàng SJC và xăng RON95 cập nhật {report_date}",
        f"Cập nhật nhanh thị trường xăng vàng {report_date}",
    ]

    facebook_caption = "\n".join(
        [
            f"📊 {title_variants[0]}",
            "",
            f"🥇 Vàng SJC: {_format_vnd(sjc_sell)} VNĐ/lượng",
            f"🌍 Vàng thế giới: {_format_usd(world_sell)}/oz",
            f"⛽ Xăng RON 95-III: {_format_vnd(ron95_price)} VNĐ/lít",
            "",
            f"Xem chi tiết tại: {links['home']}",
            " ".join(hashtags["facebook"]),
        ]
    )

    tiktok_caption = " | ".join(
        [
            f"Giá vàng SJC: {_format_vnd(sjc_sell)}đ/lượng",
            f"Giá xăng RON95: {_format_vnd(ron95_price)}đ/lít",
            "Xem chi tiết tại website (link bio)",
            " ".join(hashtags["tiktok"]),
        ]
    )

    return {
        "date": report_date,
        "metrics": {
            "gold_sjc_sell": sjc_sell,
            "gold_world_sell": world_sell,
            "fuel_ron95_vung1": ron95_price,
        },
        "formatted": {
            "gold_sjc_sell": _format_vnd(sjc_sell),
            "gold_world_sell": _format_usd(world_sell),
            "fuel_ron95_vung1": _format_vnd(ron95_price),
        },
        "links": links,
        "hashtags": hashtags,
        "title_variants": title_variants,
        "captions": {
            "facebook": facebook_caption,
            "tiktok": tiktok_caption,
        },
    }


@router.get("/summary")
async def social_summary(
    utm_source: str = Query(default="social"),
    utm_medium: str = Query(default="auto"),
    utm_campaign: str = Query(default="daily-update"),
    db: Session = Depends(get_db),
):
    """Tóm tắt dữ liệu social: giá chính + link UTM + caption mẫu cho n8n."""
    return _build_summary_payload(
        db=db,
        utm_source=utm_source,
        utm_medium=utm_medium,
        utm_campaign=utm_campaign,
    )


@router.post("/render-payload")
async def social_render_payload(
    body: RenderPayloadRequest,
    db: Session = Depends(get_db),
):
    """Payload chuẩn để render ảnh/video social từ template."""
    summary = _build_summary_payload(
        db=db,
        utm_source=body.utm_source,
        utm_medium=body.utm_medium,
        utm_campaign=body.utm_campaign,
    )

    platform_caption = summary["captions"].get(body.platform, summary["captions"]["facebook"])

    render_payload = {
        "template": body.template or f"{body.platform}-daily-card",
        "platform": body.platform,
        "date": summary["date"],
        "title": summary["title_variants"][0],
        "title_variants": summary["title_variants"],
        "subtitle": (
            f"Vàng SJC {summary['formatted']['gold_sjc_sell']} đ/lượng • "
            f"RON95 {summary['formatted']['fuel_ron95_vung1']} đ/lít"
        ),
        "primary_metrics": [
            {
                "label": "Vàng SJC",
                "value": summary["formatted"]["gold_sjc_sell"],
                "unit": "VNĐ/lượng",
            },
            {
                "label": "Vàng thế giới",
                "value": summary["formatted"]["gold_world_sell"],
                "unit": "USD/oz",
            },
            {
                "label": "Xăng RON95",
                "value": summary["formatted"]["fuel_ron95_vung1"],
                "unit": "VNĐ/lít",
            },
        ],
        "cta": {
            "text": "Xem chi tiết",
            "url": summary["links"]["home"],
        },
        "caption": platform_caption,
        "hashtags": summary["hashtags"].get(body.platform, summary["hashtags"]["common"]),
        "links": summary["links"],
    }

    return {
        "summary": summary,
        "render_payload": render_payload,
    }
