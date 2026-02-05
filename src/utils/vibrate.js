const vibrate = (pattern) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

export const vibrateCorrect = () => vibrate(50);
export const vibrateIncorrect = () => vibrate([100, 50, 100]);
