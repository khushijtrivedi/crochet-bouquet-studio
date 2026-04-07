/**
 * bouquetApi.ts
 * Place at: lib/bouquetApi.ts
 *
 * Sends selected flowers to POST /api/generate as structured JSON.
 * NO base64 encoding — the backend owns the images and maps types to paths.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

/** What the page/component passes in. */
export interface BouquetInput {
  /** Flower ID (e.g. "red-rose") — sent as `type` to the backend. */
  id: string;
  color: string | null;
  quantity: number;
}

/** Shape of each flower in the POST body. */
interface FlowerPayload {
  type: string;
  color: string | null;
  quantity: number;
}

/** What the backend returns for each flower. */
interface FlowerItemEcho {
  type: string;
  color: string | null;
  quantity: number;
  image_path: string | null;
}

/** Full backend response. */
interface GenerateResponse {
  message: string;
  data: FlowerItemEcho[];
}

// ── API base URL ──────────────────────────────────────────────────────────────
// In dev the Next.js proxy rewrites /api/* → FastAPI on port 8000.
// In prod, point NEXT_PUBLIC_API_URL at your deployed backend.
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Public image base URL ─────────────────────────────────────────────────────
// Images are now served from FastAPI's /assets mount.
export const IMAGE_BASE =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "http://localhost:8000";

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Sends selected flowers to POST /api/generate.
 * Returns the backend's `message` string (will be AI description later).
 */
export async function generateBouquet(items: BouquetInput[]): Promise<string> {
  if (items.length === 0) throw new Error("No flowers selected");

  const flowers: FlowerPayload[] = items.map((item) => ({
    type: item.id,
    color: item.color,
    quantity: item.quantity,
  }));

  const response = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      flowers,
      prompt: "a beautiful bouquet",
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { detail?: string }).detail ?? "Failed to generate bouquet"
    );
  }

  const data: GenerateResponse = await response.json();
  return data.message; // swap for data.description once AI is wired up
}