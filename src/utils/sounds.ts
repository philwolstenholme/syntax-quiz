const SOUND_URLS = {
  correct: 'https://cdn.freesound.org/previews/615/615099_6890478-lq.mp3',
  incorrect: 'https://cdn.freesound.org/previews/625/625687_13682949-lq.mp3',
  // Freesound sound ID 378085 — verify license at https://freesound.org/sounds/378085/
  keycap: 'https://cdn.freesound.org/previews/378/378085_6260145-lq.mp3',
} as const;

type SoundKey = keyof typeof SOUND_URLS;

// Pre-fetch raw bytes immediately at module load — no AudioContext needed yet.
// Mobile browsers ignore preload="auto" on Audio elements, so doing this with
// fetch() ensures the data is already in memory before the first interaction.
const rawBytes: Record<SoundKey, Promise<ArrayBuffer>> = {} as never;
for (const key of Object.keys(SOUND_URLS) as SoundKey[]) {
  rawBytes[key] = fetch(SOUND_URLS[key])
    .then(r => r.arrayBuffer())
    .catch(() => new ArrayBuffer(0));
}

// AudioContext is created lazily on first play (browsers require a user gesture).
let audioCtx: AudioContext | null = null;
function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  // iOS suspends the context until a gesture — resume if needed.
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
}

// Decoded AudioBuffers are cached after the first decode.
const decoded: Partial<Record<SoundKey, Promise<AudioBuffer | null>>> = {};
function getBuffer(key: SoundKey): Promise<AudioBuffer | null> {
  if (!decoded[key]) {
    decoded[key] = rawBytes[key].then(ab =>
      ab.byteLength > 0 ? getCtx().decodeAudioData(ab).catch(() => null) : null
    );
  }
  return decoded[key]!;
}

// HTMLAudioElement fallback for environments where fetch/CORS isn't available.
const fallbacks: Partial<Record<SoundKey, HTMLAudioElement>> = {};
function getFallback(key: SoundKey): HTMLAudioElement {
  if (!fallbacks[key]) {
    const audio = new Audio(SOUND_URLS[key]);
    audio.preload = 'auto';
    fallbacks[key] = audio;
  }
  return fallbacks[key]!;
}

// Scans the decoded waveform to find where audible content actually ends.
// MP3 files commonly have encoder padding / trailing silence that inflates
// buffer.duration beyond the last real sample. Using the raw duration for
// queue scheduling causes the next sound to be held back for that silence.
function getEffectiveDuration(buffer: AudioBuffer): number {
  const threshold = 0.001; // ≈ −60 dB
  let lastAudibleFrame = 0;
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = data.length - 1; i >= 0; i--) {
      if (Math.abs(data[i] ?? 0) > threshold) {
        if (i > lastAudibleFrame) lastAudibleFrame = i;
        break;
      }
    }
  }
  // Keep 50 ms of tail so reverb/release isn't clipped, then cap at file duration.
  return Math.min(
    (lastAudibleFrame + buffer.sampleRate * 0.05) / buffer.sampleRate,
    buffer.duration,
  );
}

// Sequential queue. Uses AudioContext timeline scheduling for Web Audio path
// (sounds are scheduled back-to-back on the hardware timeline with no gaps),
// and an ended-event chain for the HTMLAudioElement fallback path.
let nextStart = 0;
const queue: SoundKey[] = [];
let draining = false;

async function drain(): Promise<void> {
  if (draining) return;
  draining = true;
  while (queue.length > 0) {
    const key = queue.shift()!;
    try {
      const buf = await getBuffer(key);
      if (buf) {
        const ctx = getCtx();
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const gain = ctx.createGain();
        gain.gain.value = 0.5;
        src.connect(gain);
        gain.connect(ctx.destination);
        const t = Math.max(ctx.currentTime, nextStart);
        src.start(t);
        const eff = getEffectiveDuration(buf);
        // Log so you can open DevTools and see full vs audible duration for each sound.
        console.debug(`[sound] ${key}: file=${buf.duration.toFixed(3)}s audible=${eff.toFixed(3)}s`);
        nextStart = t + eff;
        continue;
      }
    } catch { /* fall through to HTMLAudioElement */ }
    // Fallback: HTMLAudioElement (waits for ended before playing next).
    try {
      const audio = getFallback(key);
      audio.currentTime = 0;
      audio.volume = 0.5;
      await new Promise<void>(res => {
        const done = () => { audio.removeEventListener('ended', done); res(); };
        audio.addEventListener('ended', done);
        audio.play().catch(() => res());
        setTimeout(res, 3000); // safety timeout
      });
    } catch { /* ignore fallback playback errors */ }
  }
  draining = false;
}

// Kick off decoding for all sounds as soon as any interaction happens,
// so subsequent taps find buffers already decoded.
function warmupAll(): void {
  for (const key of Object.keys(SOUND_URLS) as SoundKey[]) {
    getBuffer(key);
  }
}

function enqueue(key: SoundKey): void {
  warmupAll();
  queue.push(key);
  drain().catch(() => {});
}

export const playKeycapSound = (): void => enqueue('keycap');
export const playCorrectSound = (): void => enqueue('correct');
export const playIncorrectSound = (): void => enqueue('incorrect');

// ─── Global keycap sound on any interactive element ───────────────────────────

function isInteractive(el: Element): boolean {
  const tag = el.tagName;
  if (tag === 'BUTTON') return !(el as HTMLButtonElement).disabled;
  if (tag === 'A') return (el as HTMLAnchorElement).href.length > 0;
  if (tag === 'INPUT') {
    const input = el as HTMLInputElement;
    return !input.disabled && input.type !== 'hidden';
  }
  if (tag === 'SELECT') return !(el as HTMLSelectElement).disabled;
  if (tag === 'TEXTAREA') return !(el as HTMLTextAreaElement).disabled;
  const role = el.getAttribute('role');
  if (role && ['button', 'link', 'tab', 'menuitem', 'option'].includes(role)) {
    return el.getAttribute('aria-disabled') !== 'true';
  }
  return false;
}

if (typeof document !== 'undefined') {
  // Pointer: walk from the touch/click target up to the nearest interactive ancestor.
  document.addEventListener('pointerdown', (e: PointerEvent) => {
    let el = e.target as Element | null;
    while (el && el !== document.documentElement) {
      if (isInteractive(el)) { playKeycapSound(); return; }
      el = el.parentElement;
    }
  }, { passive: true });

  // Keyboard: Space/Enter activate buttons and links — but not text entry in inputs/textareas.
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    const focused = document.activeElement;
    if (!focused) return;
    const tag = focused.tagName;
    if (tag === 'TEXTAREA') return;
    if (tag === 'INPUT') {
      const type = (focused as HTMLInputElement).type;
      if (!['button', 'submit', 'reset', 'checkbox', 'radio'].includes(type)) return;
    }
    if (isInteractive(focused)) playKeycapSound();
  });
}
