"""
mapping_service.py
──────────────────
Maps a flower *type* string (as sent by the frontend) to the relative URL
at which the image is served via FastAPI's static-files mount.

Today this is a simple dict lookup.  Later you can replace the body of
`get_image_path` with database queries, ML-based matching, etc. — the
route layer never needs to change.
"""

from __future__ import annotations

from typing import Optional

# ── Mapping table ──────────────────────────────────────────────────────────────
# key   : flower type as sent in the API request (lower-case, kebab or slug)
# value : path relative to the /assets mount — served at /assets/<value>
_FLOWER_IMAGE_MAP: dict[str, str] = {
    # classic
    "red-rose":    "flowers/Red_Rose.jpeg",
    "rose":        "flowers/Red_Rose.jpeg",       # alias
    "white-lily":  "flowers/Calla_Lily_Blue.jpeg",
    "lily":        "flowers/Calla_Lily_Blue.jpeg", # alias

    # garden
    "sunflower":   "flowers/Sunflower.jpeg",
    "lavender":    "flowers/Lavender_Sticks.jpeg",
    "tulip-pink":  "flowers/Tulip.jpeg",
    "tulip":       "flowers/Tulip.jpeg",           # alias

    # exotic
    "orchid-purple": "flowers/Parrot_Tulip.jpeg",
    "orchid":        "flowers/Parrot_Tulip.jpeg",  # alias
    "parrot-tulip":  "flowers/Parrot_Tulip.jpeg",
}

_ASSET_BASE = "/assets"


def get_image_path(flower_type: str) -> Optional[str]:
    """
    Return the public URL for *flower_type*, or None if unknown.

    Example
    -------
    >>> get_image_path("rose")
    '/assets/flowers/Red_Rose.jpeg'
    """
    relative = _FLOWER_IMAGE_MAP.get(flower_type.lower().strip())
    if relative is None:
        return None
    return f"{_ASSET_BASE}/{relative}"


def list_known_types() -> list[str]:
    """Return every flower type key this service knows about."""
    return sorted(_FLOWER_IMAGE_MAP.keys())