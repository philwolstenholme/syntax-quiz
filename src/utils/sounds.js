const SOUND_URLS = {
  correct: 'https://cdn.freesound.org/previews/615/615099_6890478-lq.mp3',
  incorrect: 'https://cdn.freesound.org/previews/625/625687_13682949-lq.mp3',
};

const createAudio = (url) => {
  const audio = new Audio(url);
  audio.preload = 'auto';
  return audio;
};

const correctSound = createAudio(SOUND_URLS.correct);
const incorrectSound = createAudio(SOUND_URLS.incorrect);

const playSound = (audio) => {
  try {
    const clone = audio.cloneNode();
    clone.volume = 0.5;
    clone.play().catch(() => {});
  } catch {
    // silently fail if audio is not supported
  }
};

export const playCorrectSound = () => playSound(correctSound);
export const playIncorrectSound = () => playSound(incorrectSound);
