import { fromBase64url, toBase64url } from '@exodus/bytes/base64.js';
import { z } from 'zod/v4/mini';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

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
  return toBase64url(encoder.encode(JSON.stringify(state)));
}

export function decodeSaveState(encoded: string): SaveState | null {
  try {
    const result = SaveStateSchema.safeParse(JSON.parse(decoder.decode(fromBase64url(encoded))));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
