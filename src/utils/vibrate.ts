const HAPTIC_PATTERNS = {
  correct: [14, 24, 18],
  incorrect: [18, 28, 18, 36, 12],
} as const satisfies Record<string, VibratePattern>;

const vibrate = (pattern: VibratePattern): void => {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) {
    return;
  }

  navigator.vibrate(pattern);
};

export const vibrateCorrect = (): void => vibrate(HAPTIC_PATTERNS.correct);
export const vibrateIncorrect = (): void => vibrate(HAPTIC_PATTERNS.incorrect);
