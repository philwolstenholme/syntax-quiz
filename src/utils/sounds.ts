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
        nextStart = t + buf.duration;
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
    } catch {}
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
