// ─── Locale: English ─────────────────────────────────────────────────────────
// This is the ONLY place raw display strings live.
// When you adopt next-intl / next-i18next, replace this file with their loader.
// Keys follow the convention: flower.<id>.name | flower.<id>.alt

export const en = {
  // ── Flower names ────────────────────────────────────────────────────────────
  "flower.red-rose.name": "Red Rose",
  "flower.white-lily.name": "White Lily",
  "flower.sunflower.name": "Sunflower",
  "flower.lavender.name": "Lavender",
  "flower.tulip-pink.name": "Pink Tulip",
  "flower.orchid-purple.name": "Purple Orchid",

  // ── Accessible alt text ─────────────────────────────────────────────────────
  "flower.red-rose.alt": "A vibrant red rose in full bloom",
  "flower.white-lily.alt": "Elegant white lily with open petals",
  "flower.sunflower.alt": "Bright yellow sunflower facing the sun",
  "flower.lavender.alt": "Soft purple lavender stems in a field",
  "flower.tulip-pink.alt": "Delicate pink tulip with smooth petals",
  "flower.orchid-purple.alt": "Exotic purple orchid on a dark background",
} as const;

// ── Locale type ───────────────────────────────────────────────────────────────
// Derive the valid key union from the object — no manual maintenance needed.
export type LocaleKey = keyof typeof en;