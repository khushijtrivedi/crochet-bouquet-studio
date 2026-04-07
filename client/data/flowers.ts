/**
 * data/flowers.ts
 *
 * Images are now served by the FastAPI backend at:
 *   http://localhost:8000/assets/flowers/<filename>
 *
 * Use the IMAGE_BASE export from bouquetApi if you need the full URL at
 * runtime; here we store the path portion only so Next.js <Image> can
 * use a loader or you can prefix at render time.
 *
 * For next/image to load external URLs you must add the backend hostname
 * to next.config.js:
 *
 *   images: {
 *     remotePatterns: [{ hostname: "localhost" }],
 *   }
 */

import type { Flower, FlowersByCategory } from "../type/flower";

// Base URL for backend-served images.
// Override via NEXT_PUBLIC_IMAGE_BASE_URL in .env.local for prod.
const IMG_BASE =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "http://localhost:8000";

const IMG = `${IMG_BASE}/assets/flowers`;

export const FLOWERS: Flower[] = [
  {
    id: "red-rose",
    nameKey: "red-rose.name",
    altKey: "red-rose.alt",
    imagePath: `${IMG}/Red_Rose.jpeg`,
    category: "classic",
  },
  {
    id: "white-lily",
    nameKey: "white-lily.name",
    altKey: "white-lily.alt",
    imagePath: `${IMG}/Calla_Lily_Blue.jpeg`,
    category: "classic",
  },
  {
    id: "sunflower",
    nameKey: "sunflower.name",
    altKey: "sunflower.alt",
    imagePath: `${IMG}/Sunflower.jpeg`,
    category: "garden",
  },
  {
    id: "lavender",
    nameKey: "lavender.name",
    altKey: "lavender.alt",
    imagePath: `${IMG}/Lavender_Sticks.jpeg`,
    category: "garden",
  },
  {
    id: "tulip-pink",
    nameKey: "tulip-pink.name",
    altKey: "tulip-pink.alt",
    imagePath: `${IMG}/Tulip.jpeg`,
    category: "garden",
  },
  {
    id: "orchid-purple",
    nameKey: "orchid-purple.name",
    altKey: "orchid-purple.alt",
    imagePath: `${IMG}/Parrot_Tulip.jpeg`,
    category: "exotic",
  },
];

// ── Helpers (unchanged) ───────────────────────────────────────────────────────

export function getFlowerById(id: string): Flower | undefined {
  return FLOWERS.find((f) => f.id === id);
}

export function getFlowersByCategory(
  category: Flower["category"]
): Flower[] {
  return FLOWERS.filter((f) => f.category === category);
}

export function getFlowersGrouped(): Partial<FlowersByCategory> {
  return FLOWERS.reduce<Partial<FlowersByCategory>>((acc, flower) => {
    const bucket = acc[flower.category] ?? [];
    return { ...acc, [flower.category]: [...bucket, flower] };
  }, {});
}