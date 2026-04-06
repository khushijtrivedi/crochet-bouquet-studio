/**
 * bouquetApi.ts
 * Place at: lib/bouquetApi.ts
 *
 * Sends selected flowers to POST /api/generate
 * Images are converted to base64 before sending — image paths are
 * never exposed in the request, making the API harder to reverse-engineer.
 */

export interface BouquetInput {
  imagePath: string;   // local path — only used client-side to fetch & encode
  name: string;
  color: string | null;
  quantity: number;
}

export interface BouquetFlowerPayload {
  imageBase64: string; // base64-encoded image data (no path exposed)
  mimeType: string;
  name: string;
  color: string | null;
  quantity: number;
}

export interface GenerateBouquetResponse {
  description: string;
}

/**
 * Fetches an image from its local path and converts it to base64.
 * The original path is never sent to the server.
 */
async function encodeImageToBase64(imagePath: string): Promise<{ base64: string; mimeType: string }> {
  const url = imagePath.startsWith("http")
    ? imagePath
    : window.location.origin + imagePath;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${imagePath}`);

  const blob = await res.blob();
  const mimeType = blob.type || "image/jpeg";

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Strip the "data:image/...;base64," prefix — send raw base64 only
      const base64 = (reader.result as string).split(",")[1];
      resolve({ base64, mimeType });
    };
    reader.onerror = () => reject(new Error("Failed to encode image"));
    reader.readAsDataURL(blob);
  });
}

/**
 * Sends selected flowers to /api/generate.
 * Images are sent as base64 — paths are never in the request body.
 *
 * Expected response: { description: string }
 */
export async function generateBouquet(items: BouquetInput[]): Promise<string> {
  if (items.length === 0) throw new Error("No flowers selected");

  // Encode all images to base64 in parallel
  const flowers: BouquetFlowerPayload[] = await Promise.all(
    items.map(async (item) => {
      const { base64, mimeType } = await encodeImageToBase64(item.imagePath);
      return {
        imageBase64: base64,
        mimeType,
        name: item.name,
        color: item.color,
        quantity: item.quantity,
      };
    })
  );

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flowers }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? "Failed to generate bouquet"
    );
  }

  const data = (await response.json()) as GenerateBouquetResponse;
  return data.description;
}