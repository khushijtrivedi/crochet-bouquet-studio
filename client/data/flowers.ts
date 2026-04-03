// ─── Flower Data ─────────────────────────────────────────────────────────────
// Pure data — no UI, no state, no framework imports.
// Extend by adding entries to FLOWERS; the helpers below update automatically.

import type { Flower, FlowersByCategory } from "../type/flower";

// ── Image base path ───────────────────────────────────────────────────────────
// Change this one constant if you ever reorganise /public
const IMG = "/images/flowers";

// ── Master list ───────────────────────────────────────────────────────────────
export const FLOWERS: Flower[] = [
  {
    id: "red-rose",
    nameKey: "flower.red-rose.name",
    altKey: "flower.red-rose.alt",
    imagePath: `${IMG}/red-rose.jpg`,
    category: "classic",
  },
  {
    id: "white-lily",
    nameKey: "flower.white-lily.name",
    altKey: "flower.white-lily.alt",
    imagePath: `${IMG}/white-lily.jpg`,
    category: "classic",
  },
  {
    id: "sunflower",
    nameKey: "flower.sunflower.name",
    altKey: "flower.sunflower.alt",
    imagePath: `${IMG}/sunflower.jpg`,
    category: "garden",
  },
  {
    id: "lavender",
    nameKey: "flower.lavender.name",
    altKey: "flower.lavender.alt",
    imagePath: `${IMG}/lavender.jpg`,
    category: "garden",
  },
  {
    id: "tulip-pink",
    nameKey: "flower.tulip-pink.name",
    altKey: "flower.tulip-pink.alt",
    imagePath: `${IMG}/tulip-pink.jpg`,
    category: "garden",
  },
  {
    id: "orchid-purple",
    nameKey: "flower.orchid-purple.name",
    altKey: "flower.orchid-purple.alt",
    imagePath: `${IMG}/orchid-purple.jpg`,
    category: "exotic",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** O(1) lookup by stable id */
export function getFlowerById(id: string): Flower | undefined {
  return FLOWERS.find((f) => f.id === id);
}

/** Returns every flower in a given category */
export function getFlowersByCategory(
  category: Flower["category"]
): Flower[] {
  return FLOWERS.filter((f) => f.category === category);
}

/**
 * Returns all flowers grouped by category.
 * Useful for rendering category sections without extra filtering calls.
 */
export function getFlowersGrouped(): Partial<FlowersByCategory> {
  return FLOWERS.reduce<Partial<FlowersByCategory>>((acc, flower) => {
    const bucket = acc[flower.category] ?? [];
    return { ...acc, [flower.category]: [...bucket, flower] };
  }, {});
}