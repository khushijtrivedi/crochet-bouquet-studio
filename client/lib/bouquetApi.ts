const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export interface BouquetFlowerInput {
  id: string;
  color: string | null;
  quantity: number;
}

export async function generateBouquet(
  flowers: BouquetFlowerInput[]
): Promise<string> {
  const response = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      flowers: flowers.map((f) => ({
        type: f.id,
        color: f.color,
        quantity: f.quantity,
      })),
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const data = await response.json();
  if (!data.bouquet_image_data) throw new Error("No image data returned.");

  // Already a data URL — use directly as <img src>
  return data.bouquet_image_data;
}