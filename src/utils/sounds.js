// ===========================================
// SOUND CONFIGURATION - Change URLs here
// ===========================================
const SOUND_URLS = {
  correct: 'https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3', // Happy chime
  incorrect: 'https://cdn.freesound.org/previews/331/331912_3248244-lq.mp3', // Dull knock
};
// ===========================================

// Cache audio instances for better performance
let correctSound = null;
let incorrectSound = null;

const createAudio = (url) => {
  const audio = new Audio(url);
  audio.preload = 'auto';
  return audio;
};

const playSound = (audio, url) => {
  try {
    // Clone the audio to allow overlapping plays
    const sound = audio ? audio.cloneNode() : new Audio(url);
    sound.volume = 0.5;
    sound.play().catch(() => {
      // Silently fail if autoplay is blocked
    });
  } catch {
    // Silently fail if audio is not supported
  }
};

// Preload sounds when module loads
if (typeof window !== 'undefined') {
  correctSound = createAudio(SOUND_URLS.correct);
  incorrectSound = createAudio(SOUND_URLS.incorrect);
}

export const playCorrectSound = () => {
  playSound(correctSound, SOUND_URLS.correct);
};

export const playIncorrectSound = () => {
  playSound(incorrectSound, SOUND_URLS.incorrect);
};
