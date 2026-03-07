const SOUND_URLS = {
  correct: 'https://cdn.freesound.org/previews/615/615099_6890478-lq.mp3',
  incorrect: 'https://cdn.freesound.org/previews/625/625687_13682949-lq.mp3',
};

let correctSound: HTMLAudioElement | null = null;
let incorrectSound: HTMLAudioElement | null = null;

const getOrCreate = (current: HTMLAudioElement | null, url: string): HTMLAudioElement => {
  if (current) return current;
  const audio = new Audio(url);
  audio.preload = 'auto';
  return audio;
};

const playSound = (audio: HTMLAudioElement): void => {
  try {
    audio.currentTime = 0;
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch { /* audio unsupported */ }
};

export const playCorrectSound = (): void => {
  correctSound = getOrCreate(correctSound, SOUND_URLS.correct);
  playSound(correctSound);
};

export const playIncorrectSound = (): void => {
  incorrectSound = getOrCreate(incorrectSound, SOUND_URLS.incorrect);
  playSound(incorrectSound);
};
