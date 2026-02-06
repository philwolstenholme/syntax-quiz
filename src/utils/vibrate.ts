const vibrate = (pattern: VibratePattern): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

export const vibrateCorrect = (): void => vibrate(50);
export const vibrateIncorrect = (): void => vibrate([100, 50, 100]);
