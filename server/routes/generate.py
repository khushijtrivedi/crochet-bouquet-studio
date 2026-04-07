"""
routes/generate.py
──────────────────
POST /api/generate

Accepts a structured bouquet request (flower type, colour, quantity).
No base64 images — the backend is the image source of truth.

Today: logs the request and returns a dummy response.
Later: call an AI service from here (or from a dedicated service layer).
"""

from __future__ import annotations

import logging

from fastapi import APIRouter

from schemas.generate_schema import (
    FlowerItemEcho,
    GenerateRequest,
    GenerateResponse,
)
from services.mapping_service import get_image_path

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/generate", response_model=GenerateResponse)
async def generate_bouquet(body: GenerateRequest) -> GenerateResponse:
    # ── Log incoming request ──────────────────────────────────────────────────
    logger.info("=== /api/generate called ===")
    logger.info("Prompt : %s", body.prompt)
    logger.info("Flowers: %d item(s)", len(body.flowers))
    for item in body.flowers:
        logger.info("  • %s  color=%s  qty=%d", item.type, item.color, item.quantity)

    # ── Resolve image paths via mapping service ───────────────────────────────
    echoed: list[FlowerItemEcho] = []
    for item in body.flowers:
        image_path = get_image_path(item.type)
        if image_path is None:
            logger.warning("Unknown flower type: %r — no image mapped", item.type)

        echoed.append(
            FlowerItemEcho(
                type=item.type,
                color=item.color,
                quantity=item.quantity,
                image_path=image_path,
            )
        )

    # ── Dummy response (AI integration comes later) ───────────────────────────
    return GenerateResponse(
        message="Request received",
        data=echoed,
    )