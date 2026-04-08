from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field


class FlowerItem(BaseModel):
    type: str
    color: Optional[str] = None
    quantity: int = Field(..., gt=0)


class GenerateRequest(BaseModel):
    flowers: list[FlowerItem] = Field(..., min_length=1)
    prompt: Optional[str] = None


class GenerateResponse(BaseModel):
    message: str
    bouquet_image_data: Optional[str] = Field(
        None,
        description="Base64 data URL: data:image/png;base64,<...>",
    )