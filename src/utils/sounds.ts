const SOUND_URLS = {
  correct: 'https://cdn.freesound.org/previews/615/615099_6890478-lq.mp3',
  incorrect: 'https://cdn.freesound.org/previews/625/625687_13682949-lq.mp3',
  // Freesound sound ID 378085 — verify license at https://freesound.org/sounds/378085/
  keycap: 'https://cdn.freesound.org/previews/378/378085_6260145-lq.mp3',
};

const createSound = (url: string): HTMLAudioElement => {
  const audio = new Audio(url);
  audio.preload = 'auto';
  return audio;
};

const correctSound = createSound(SOUND_URLS.correct);
const incorrectSound = createSound(SOUND_URLS.incorrect);
const keycapSound = createSound(SOUND_URLS.keycap);

// Sequential queue — sounds play back-to-back, never overlapping.
const queue: HTMLAudioElement[] = [];
let playing = false;

function playNext(): void {
  if (queue.length === 0) {
    playing = false;
    return;
  }
  playing = true;
  const audio = queue.shift()!;
  audio.volume = 0.5;
  audio.currentTime = 0;
  const done = () => {
    audio.removeEventListener('ended', done);
    audio.removeEventListener('error', done);
    playNext();
  };
  audio.addEventListener('ended', done);
  audio.addEventListener('error', done);
  audio.play().catch(done);
}

function enqueue(audio: HTMLAudioElement): void {
  try {
    queue.push(audio);
    if (!playing) playNext();
  } catch { /* audio unsupported */ }
}

export const playKeycapSound = (): void => enqueue(keycapSound);
export const playCorrectSound = (): void => enqueue(correctSound);
export const playIncorrectSound = (): void => enqueue(incorrectSound);
