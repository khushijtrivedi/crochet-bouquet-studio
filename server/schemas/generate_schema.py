from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field


# ── Request ───────────────────────────────────────────────────────────────────

class FlowerItem(BaseModel):
    """A single flower entry in the bouquet request."""

    type: str = Field(
        ...,
        description="Flower identifier that maps to an image on disk (e.g. 'rose').",
        examples=["rose", "sunflower", "lavender"],
    )
    color: Optional[str] = Field(
        None,
        description="Desired colour override (e.g. 'yellow', 'pink').",
    )
    quantity: int = Field(
        ...,
        gt=0,
        description="Number of stems — must be greater than 0.",
    )


class GenerateRequest(BaseModel):
    """Payload sent by the frontend to /api/generate."""

    flowers: list[FlowerItem] = Field(
        ...,
        min_length=1,
        description="At least one flower must be included.",
    )
    prompt: Optional[str] = Field(
        None,
        description="Free-text style prompt (e.g. 'a beautiful crochet bouquet').",
    )


# ── Response ──────────────────────────────────────────────────────────────────

class FlowerItemEcho(BaseModel):
    """Echo of a single flower item with its resolved image path."""

    type: str
    color: Optional[str]
    quantity: int
    image_path: Optional[str] = Field(
        None,
        description="Relative URL where the image is served, e.g. /assets/flowers/rose.png",
    )


class GenerateResponse(BaseModel):
    """Response returned by /api/generate."""

    message: str
    data: list[FlowerItemEcho]