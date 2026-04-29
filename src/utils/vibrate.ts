const HAPTIC_PATTERNS = {
  keycap: 10,
  pop: [8, 18, 12],
  correct: [14, 24, 18],
  incorrect: [18, 28, 18, 36, 12],
} as const satisfies Record<string, VibratePattern>;

const vibrate = (pattern: VibratePattern): void => {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) {
    return;
  }

  navigator.vibrate(pattern);
};

export const vibrateKeycap = (): void => vibrate(HAPTIC_PATTERNS.keycap);
export const vibratePop = (): void => vibrate(HAPTIC_PATTERNS.pop);
export const vibrateCorrect = (): void => vibrate(HAPTIC_PATTERNS.correct);
export const vibrateIncorrect = (): void => vibrate(HAPTIC_PATTERNS.incorrect);
