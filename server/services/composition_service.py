from __future__ import annotations
import base64
import io
from PIL import Image


def compose_bouquet(image_paths: list[str]) -> str:
    """
    Compose images side-by-side in memory.
    Returns a base64-encoded PNG as a data URL string.
    """
    if not image_paths:
        raise ValueError("image_paths must contain at least one image.")

    images = [Image.open(p).convert("RGB") for p in image_paths]

    total_width = sum(img.width for img in images)
    max_height = max(img.height for img in images)

    canvas = Image.new("RGB", (total_width, max_height), color=(255, 255, 255))
    x_offset = 0
    for img in images:
        canvas.paste(img, (x_offset, 0))
        x_offset += img.width

    buffer = io.BytesIO()
    canvas.save(buffer, format="PNG")
    b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return f"data:image/png;base64,{b64}"