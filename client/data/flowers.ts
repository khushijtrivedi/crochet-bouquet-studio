import type { Flower, FlowersByCategory } from "../type/flower";

const IMG = "/images/flowers";

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

// helpers (unchanged)
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