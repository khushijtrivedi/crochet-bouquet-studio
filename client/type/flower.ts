// ─── Flower Types ────────────────────────────────────────────────────────────
// Extend `FlowerCategory` as you add categories (e.g. "tropical", "seasonal")

export type FlowerCategory = "classic" | "garden" | "exotic" | "wild";

export interface Flower {
  /** Stable, unique key — safe to use in URLs, keys, and i18n lookups */
  id: string;

  /**
   * i18n message key — resolved via your locale file, NOT a raw display string.
   * Convention: "flower.<id>.name"
   */
  nameKey: string;

  /** Absolute path from /public — pass directly to <Image src={...} /> */
  imagePath: string;

  /** Alt text key for accessibility — resolved via locale, NOT a raw string */
  altKey: string;

  category: FlowerCategory;
}

/** Grouped flowers by category — useful for filtered UIs later */
export type FlowersByCategory = Record<FlowerCategory, Flower[]>;