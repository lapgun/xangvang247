import logging
import json
from typing import Any

import httpx
from sqlalchemy.orm import Session

from app.config import settings
from app.routers.social import _build_summary_payload

logger = logging.getLogger(__name__)

_SOCIAL_POST_STATE: dict[str, str | None] = {
    "last_date": None,
    "last_key": None,
}


def _build_dedupe_key(summary: dict) -> str:
    metrics = summary.get("metrics", {})
    return "|".join(
        [
            str(summary.get("date", "")),
            str(metrics.get("gold_sjc_sell", "")),
            str(metrics.get("gold_world_sell", "")),
            str(metrics.get("fuel_ron95_vung1", "")),
        ]
    )


def _extract_response_body(response: httpx.Response) -> Any:
    try:
        return response.json()
    except Exception:
        return response.text


def _post_facebook(summary: dict) -> dict:
    targets: list[tuple[str, str]] = []

    raw_targets = (settings.fb_page_targets_json or "").strip()
    if raw_targets:
        try:
            parsed = json.loads(raw_targets)
            if isinstance(parsed, list):
                for item in parsed:
                    if not isinstance(item, dict):
                        continue
                    page_id = str(item.get("page_id", "")).strip()
                    access_token = str(item.get("access_token", "")).strip()
                    if page_id and access_token:
                        targets.append((page_id, access_token))
            else:
                logger.warning("[SOCIAL] FB_PAGE_TARGETS_JSON must be a list")
        except json.JSONDecodeError as exc:
            logger.error(f"[SOCIAL] Invalid FB_PAGE_TARGETS_JSON: {exc}")

    if settings.fb_page_id and settings.fb_page_access_token:
        targets.append((settings.fb_page_id, settings.fb_page_access_token))

    # Keep insertion order while removing duplicates.
    unique_targets = list(dict.fromkeys(targets))
    if not unique_targets:
        logger.info("[SOCIAL] Facebook post skipped: no configured page targets")
        return {
            "enabled": False,
            "posted_any": False,
            "results": [],
            "reason": "no_configured_page_targets",
        }

    posted_any = False
    page_results: list[dict[str, Any]] = []
    for page_id, access_token in unique_targets:
        try:
            response = httpx.post(
                f"https://graph.facebook.com/v20.0/{page_id}/feed",
                data={
                    "message": summary.get("captions", {}).get("facebook", ""),
                    "link": summary.get("links", {}).get("home", ""),
                    "access_token": access_token,
                },
                timeout=30.0,
            )
            body = _extract_response_body(response)
            if response.is_success:
                logger.info(
                    f"[SOCIAL] Facebook posted successfully for page {page_id} "
                    f"(status={response.status_code})"
                )
                posted_any = True
                page_results.append(
                    {
                        "page_id": page_id,
                        "success": True,
                        "status_code": response.status_code,
                        "response": body,
                    }
                )
            else:
                logger.error(
                    f"[SOCIAL] Facebook post failed for page {page_id} "
                    f"(status={response.status_code}, body={body})"
                )
                page_results.append(
                    {
                        "page_id": page_id,
                        "success": False,
                        "status_code": response.status_code,
                        "response": body,
                    }
                )
        except Exception as exc:
            logger.error(f"[SOCIAL] Facebook post failed for page {page_id}: {exc}")
            page_results.append(
                {
                    "page_id": page_id,
                    "success": False,
                    "status_code": None,
                    "error": str(exc),
                }
            )

    return {
        "enabled": True,
        "posted_any": posted_any,
        "results": page_results,
    }


def _post_tiktok(
    summary: dict,
    *,
    test_mode: bool = False,
    test_key: str | None = None,
) -> dict:
    if not settings.tiktok_webhook_url:
        logger.info("[SOCIAL] TikTok post skipped: missing TIKTOK_WEBHOOK_URL")
        return {
            "enabled": False,
            "success": False,
            "reason": "missing_tiktok_webhook_url",
        }

    headers = {}
    if test_mode and test_key:
        headers["X-TikTok-Test-Key"] = test_key

    payload = {
        "caption": summary.get("captions", {}).get("tiktok", ""),
        "link": summary.get("links", {}).get("home", ""),
        "date": summary.get("date"),
        "payload": summary.get("metrics", {}),
    }
    if test_mode:
        payload["test_mode"] = True

    try:
        response = httpx.post(
            settings.tiktok_webhook_url,
            json=payload,
            headers=headers,
            timeout=30.0,
        )
        body = _extract_response_body(response)
        if response.is_success:
            logger.info(f"[SOCIAL] TikTok payload sent successfully (status={response.status_code})")
            return {
                "enabled": True,
                "success": True,
                "status_code": response.status_code,
                "response": body,
                "test_mode": test_mode,
            }

        logger.error(
            f"[SOCIAL] TikTok webhook failed (status={response.status_code}, body={body})"
        )
        return {
            "enabled": True,
            "success": False,
            "status_code": response.status_code,
            "response": body,
            "test_mode": test_mode,
        }
    except Exception as exc:
        logger.error(f"[SOCIAL] TikTok webhook failed: {exc}")
        return {
            "enabled": True,
            "success": False,
            "status_code": None,
            "error": str(exc),
            "test_mode": test_mode,
        }


def run_social_autopost(
    db: Session,
    *,
    force: bool = False,
    tiktok_test_mode: bool = False,
    tiktok_test_key: str | None = None,
) -> dict:
    if not settings.social_auto_post_enabled:
        logger.info("[SOCIAL] Autopost disabled by SOCIAL_AUTO_POST_ENABLED")
        return {
            "success": False,
            "skipped": True,
            "reason": "social_auto_post_disabled",
        }

    summary = _build_summary_payload(
        db=db,
        utm_source="social",
        utm_medium="auto",
        utm_campaign="daily-update",
    )

    today = str(summary.get("date", ""))
    dedupe_key = _build_dedupe_key(summary)

    if not force and not settings.allow_duplicate_post:
        if _SOCIAL_POST_STATE["last_date"] == today and _SOCIAL_POST_STATE["last_key"] == dedupe_key:
            logger.info("[SOCIAL] Skipped duplicated daily content")
            return {
                "success": False,
                "skipped": True,
                "reason": "duplicate_daily_content",
                "date": today,
                "dedupe_key": dedupe_key,
            }

    facebook_result = _post_facebook(summary)
    tiktok_result = _post_tiktok(
        summary,
        test_mode=tiktok_test_mode,
        test_key=tiktok_test_key,
    )

    posted_facebook = bool(facebook_result.get("posted_any"))
    posted_tiktok = bool(tiktok_result.get("success"))

    if not (posted_facebook or posted_tiktok):
        logger.info("[SOCIAL] No social channel posted successfully")
        return {
            "success": False,
            "skipped": False,
            "reason": "all_channels_failed",
            "date": today,
            "dedupe_key": dedupe_key,
            "facebook": facebook_result,
            "tiktok": tiktok_result,
        }

    _SOCIAL_POST_STATE["last_date"] = today
    _SOCIAL_POST_STATE["last_key"] = dedupe_key

    return {
        "success": True,
        "skipped": False,
        "reason": "posted",
        "date": today,
        "dedupe_key": dedupe_key,
        "facebook": facebook_result,
        "tiktok": tiktok_result,
    }
