import { z } from 'zod/v4/mini';

const SaveStateSchema = z.object({
  v: z.literal(1),
  l: z.number(),
  s: z.number(),
  k: z.number(),
  c: z.number(),
  h: z.number(),
  r: z.array(z.number()),
  e: z.array(z.string()),
});

export type SaveState = z.infer<typeof SaveStateSchema>;

export function encodeSaveState(state: SaveState): string {
  const json = JSON.stringify(state);
  return btoa(json)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeSaveState(encoded: string): SaveState | null {
  try {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const json = atob(base64);
    const result = SaveStateSchema.safeParse(JSON.parse(json));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
