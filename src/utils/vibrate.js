export const vibrateCorrect = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
};

export const vibrateIncorrect = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 100]);
  }
};
