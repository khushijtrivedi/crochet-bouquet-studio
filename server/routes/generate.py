from __future__ import annotations
import logging
from fastapi import APIRouter, HTTPException
from schemas.generate_schema import GenerateRequest, GenerateResponse
from services.mapping_service import get_image_path
from services.composition_service import compose_bouquet

logger = logging.getLogger(__name__)
router = APIRouter()
ASSET_DIR = "assets"


@router.post("/generate", response_model=GenerateResponse)
async def generate_bouquet(body: GenerateRequest) -> GenerateResponse:
    disk_paths: list[str] = []
    for item in body.flowers:
        rel = get_image_path(item.type)
        if rel is None:
            logger.warning("Unknown flower type: %r", item.type)
            continue
        fs_path = ASSET_DIR + rel.removeprefix("/assets")
        for _ in range(item.quantity):
            disk_paths.append(fs_path)

    if not disk_paths:
        raise HTTPException(status_code=400, detail="No valid flowers found.")

    try:
        data_url = compose_bouquet(disk_paths)
    except Exception as e:
        logger.error("Composition failed: %s", e)
        raise HTTPException(status_code=500, detail="Image composition failed.")

    return GenerateResponse(
        message="Bouquet composed successfully.",
        bouquet_image_data=data_url,
    )