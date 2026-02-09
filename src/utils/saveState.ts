export interface SaveState {
  v: number;      // version
  l: number;      // levelId
  s: number;      // score
  k: number;      // streak
  c: number;      // correctAnswers
  h: number;      // hintsUsed on current question
  r: number[];    // remaining question original indices (in current order)
  e: string[];    // eliminated option strings for current question
}

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
    const state = JSON.parse(json) as SaveState;
    if (state.v !== 1) return null;
    if (typeof state.l !== 'number' || typeof state.s !== 'number') return null;
    if (typeof state.k !== 'number' || typeof state.c !== 'number') return null;
    if (typeof state.h !== 'number') return null;
    if (!Array.isArray(state.r) || !Array.isArray(state.e)) return null;
    return state;
  } catch {
    return null;
  }
}
