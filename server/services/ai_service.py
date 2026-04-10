from __future__ import annotations
import logging

logger = logging.getLogger(__name__)


def generate_bouquet_image(
    flowers: list[dict],
    image_paths: list[str],
) -> None:
    logger.info("Gemini skipped — no free quota. Using rembg AI composition.")
    return None