from __future__ import annotations
import base64
import io
import math
import random
from PIL import Image, ImageDraw, ImageFilter
from rembg import remove, new_session

import logging
logger = logging.getLogger(__name__)

# isnet-general-use handles complex backgrounds much better than default u2net
_session = new_session("isnet-general-use")


def _remove_background(image_path: str) -> Image.Image:
    """AI background removal using isnet neural network — runs fully locally."""
    with open(image_path, "rb") as f:
        input_bytes = f.read()
    output_bytes = remove(input_bytes, session=_session)
    return Image.open(io.BytesIO(output_bytes)).convert("RGBA")


def _recolor(img: Image.Image, target_color: str) -> Image.Image:
    color_map = {
        "red":    (220, 50,  50),
        "pink":   (255, 105, 180),
        "white":  (255, 255, 255),
        "yellow": (255, 210, 0),
        "purple": (148, 0,   211),
        "orange": (255, 140, 0),
        "blue":   (30,  100, 220),
    }
    if not target_color or target_color.lower() not in color_map:
        return img

    target = color_map[target_color.lower()]
    img = img.convert("RGBA")
    r, g, b, a = img.split()

    gray = img.convert("L")
    tinted = Image.merge("RGB", [
        gray.point(lambda p: int(p * target[0] / 255)),
        gray.point(lambda p: int(p * target[1] / 255)),
        gray.point(lambda p: int(p * target[2] / 255)),
    ])

    original_rgb = Image.merge("RGB", (r, g, b))
    blended = Image.blend(original_rgb, tinted, alpha=0.6)
    blended.putalpha(a)
    return blended


def compose_bouquet(
    image_paths: list[str],
    colors: list[str] | None = None,
) -> str:
    if not image_paths:
        raise ValueError("image_paths must contain at least one image.")

    colors = colors or [None] * len(image_paths)

    # Cut out each flower with AI + recolor
    flowers = []
    for path, color in zip(image_paths, colors):
        logger.info("Removing background from: %s", path)
        img = _remove_background(path)
        if color:
            img = _recolor(img, color)
        flowers.append(img)

    # Resize to similar height
    TARGET_H = 240
    resized = []
    for img in flowers:
        ratio = TARGET_H / img.height
        new_w = int(img.width * ratio)
        resized.append(img.resize((new_w, TARGET_H), Image.LANCZOS))

    count = len(resized)
    canvas_w = 600
    canvas_h = 560
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (255, 255, 255, 0))

    center_x = canvas_w // 2
    center_y = canvas_h // 2 - 40

    # Fan/arc positions
    if count == 1:
        positions = [(center_x, center_y - 40)]
        angles = [0]
    else:
        arc_spread = min(150, 35 * count)
        start_angle = -arc_spread / 2
        positions, angles = [], []
        for i in range(count):
            t = i / (count - 1)
            angle_deg = start_angle + t * arc_spread
            angle_rad = math.radians(angle_deg)
            radius = 90 + 20 * abs(math.sin(angle_rad))
            x = int(center_x + radius * math.sin(angle_rad))
            y = int(center_y - radius * abs(math.cos(angle_rad)) * 0.25)
            x += random.randint(-6, 6)
            y += random.randint(-6, 6)
            positions.append((x, y))
            angles.append(angle_deg * 0.35)

    # Draw stems behind flowers
    stem_layer = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(stem_layer)
    stem_base_x = center_x
    stem_base_y = canvas_h - 60

    for i, (x, y) in enumerate(positions):
        green = random.randint(55, 90)
        stem_color = (30, green, 30, 210)
        ctrl_x = (x + stem_base_x) // 2 + random.randint(-15, 15)
        ctrl_y = y + (stem_base_y - y) // 2
        steps = 24
        prev_px, prev_py = x, y + TARGET_H // 2
        for s in range(1, steps + 1):
            t = s / steps
            px = int((1-t)**2 * x + 2*(1-t)*t * ctrl_x + t**2 * stem_base_x)
            py = int((1-t)**2 * (y + TARGET_H//2) + 2*(1-t)*t * ctrl_y + t**2 * stem_base_y)
            draw.line([(prev_px, prev_py), (px, py)], fill=stem_color, width=4)
            prev_px, prev_py = px, py

    canvas = Image.alpha_composite(canvas, stem_layer)

    # Paste flowers — middle on top
    draw_order = sorted(range(count), key=lambda i: -abs(i - count // 2))
    for i in draw_order:
        img = resized[i]
        x, y = positions[i]
        rotated = img.rotate(-angles[i], expand=True, resample=Image.BICUBIC)
        paste_x = x - rotated.width // 2
        paste_y = y - rotated.height // 2
        canvas.paste(rotated, (paste_x, paste_y), rotated)

    # Ribbon wrap
    ribbon_layer = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    rdraw = ImageDraw.Draw(ribbon_layer)
    wrap_top = canvas_h - 100
    wrap_bottom = canvas_h - 30
    rdraw.rectangle([(center_x-22, wrap_top), (center_x+22, wrap_bottom)], fill=(210, 175, 130, 230))
    rdraw.ellipse([(center_x-32, wrap_top-12), (center_x+2, wrap_top+12)], fill=(220, 70, 90, 220))
    rdraw.ellipse([(center_x-2, wrap_top-12), (center_x+32, wrap_top+12)], fill=(220, 70, 90, 220))
    rdraw.ellipse([(center_x-7, wrap_top-6), (center_x+7, wrap_top+6)], fill=(180, 40, 60, 240))
    canvas = Image.alpha_composite(canvas, ribbon_layer)

    # White background
    final = Image.new("RGB", (canvas_w, canvas_h), (255, 255, 255))
    final.paste(canvas, mask=canvas.split()[3])
    final = final.filter(ImageFilter.GaussianBlur(radius=0.3))

    buffer = io.BytesIO()
    final.save(buffer, format="PNG")
    b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{b64}"