const SOUND_URLS = {
  correct: 'https://cdn.freesound.org/previews/615/615099_6890478-lq.mp3',
  incorrect: 'https://cdn.freesound.org/previews/625/625687_13682949-lq.mp3',
};

const createAudio = (url: string): HTMLAudioElement => {
  const audio = new Audio(url);
  audio.preload = 'auto';
  return audio;
};

const correctSound = createAudio(SOUND_URLS.correct);
const incorrectSound = createAudio(SOUND_URLS.incorrect);

const playSound = (audio: HTMLAudioElement): void => {
  try {
    // Reset and reuse the element instead of cloning (avoids orphaned DOM nodes)
    audio.currentTime = 0;
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch { /* audio unsupported */ }
};

export const playCorrectSound = (): void => playSound(correctSound);
export const playIncorrectSound = (): void => playSound(incorrectSound);
