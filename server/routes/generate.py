from __future__ import annotations
import logging
from fastapi import APIRouter, HTTPException
from schemas.generate_schema import GenerateRequest, GenerateResponse
from services.mapping_service import get_image_path
from services.composition_service import compose_bouquet
from services.ai_service import generate_bouquet_image

logger = logging.getLogger(__name__)
router = APIRouter()
ASSET_DIR = "assets"


@router.post("/generate", response_model=GenerateResponse)
async def generate_bouquet(body: GenerateRequest) -> GenerateResponse:
    flower_dicts = [
        {"type": item.type, "color": item.color, "quantity": item.quantity}
        for item in body.flowers
    ]

    # Build disk paths + colors expanded by quantity
    disk_paths: list[str] = []
    colors: list[str] = []
    for item in body.flowers:
        rel = get_image_path(item.type)
        if rel is None:
            logger.warning("Unknown flower type: %r", item.type)
            continue
        fs_path = ASSET_DIR + rel.removeprefix("/assets")
        for _ in range(item.quantity):
            disk_paths.append(fs_path)
            colors.append(item.color or "")

    if not disk_paths:
        raise HTTPException(status_code=400, detail="No valid flowers found.")

    logger.info("Attempting AI generation with %d image(s)...", len(disk_paths))
    image_data = generate_bouquet_image(flower_dicts, disk_paths)

    if image_data is None:
        logger.info("Using rembg AI composition.")
        try:
            image_data = compose_bouquet(disk_paths, colors=colors)
        except Exception as e:
            logger.error("Composition failed: %s", e, exc_info=True)
            raise HTTPException(status_code=500, detail="Image generation failed.")

    return GenerateResponse(
        message="Bouquet generated.",
        bouquet_image_data=image_data,
    )