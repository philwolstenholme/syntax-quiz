import { playCorrectSound, playIncorrectSound } from './sounds';
import { vibrateCorrect, vibrateIncorrect } from './vibrate';

export const feedbackCorrect = () => {
  vibrateCorrect();
  playCorrectSound();
};

export const feedbackIncorrect = () => {
  vibrateIncorrect();
  playIncorrectSound();
};
