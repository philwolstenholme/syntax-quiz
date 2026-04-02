/**
 * Mutable CRT effect parameters — read each frame by the canvas renderer,
 * written by Tweakpane (or hydrated from the URL query string).
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface CRTParams {
  // Grid
  dotSpacing: number;
  dotBaseRadius: number;

  // Speed variation
  speedVariation: number;
  speedSmoothing: number;
  mouseSpeedInfluence: number;

  // Characters
  charDensity: number;
  charLifetimeMin: number;
  charLifetimeMax: number;

  // Noise & glitch
  noiseDensity: number;
  glitchChance: number;

  // CRT barrel distortion
  barrelStrength: number;

  // Click ripple
  rippleSpeed: number;
  rippleMaxRadius: number;
  rippleRingWidth: number;

  // Boot sequence
  bootDuration: number;

  // Screen breathe
  breatheFrequency: number;
  breatheAmplitude: number;

  // Exclusion zone
  excludeMargin: number;
  excludeFade: number;

  // Afterglow
  afterglowWidth: number;

  // Theme-dependent colors (dark mode values)
  darkBaseAlpha: number;
  darkBeamColor: RGB;
  darkDotColor: RGB;
  darkCharColor: RGB;
  darkGlowAlphaScale: number;
  darkCursorAlphaScale: number;
  darkRippleAlphaScale: number;

  // Theme-dependent colors (light mode values)
  lightBaseAlpha: number;
  lightBeamColor: RGB;
  lightDotColor: RGB;
  lightCharColor: RGB;
  lightGlowAlphaScale: number;
  lightCursorAlphaScale: number;
  lightRippleAlphaScale: number;
}

export const CRT_DEFAULTS: Readonly<CRTParams> = {
  dotSpacing: 24,
  dotBaseRadius: 1,

  speedVariation: 0.25,
  speedSmoothing: 0.06,
  mouseSpeedInfluence: 0.8,

  charDensity: 0.035,
  charLifetimeMin: 45,
  charLifetimeMax: 75,

  noiseDensity: 0.002,
  glitchChance: 0.003,

  barrelStrength: -0.02,

  rippleSpeed: 4,
  rippleMaxRadius: 200,
  rippleRingWidth: 40,

  bootDuration: 70,

  breatheFrequency: 0.02,
  breatheAmplitude: 0.025,

  excludeMargin: 32,
  excludeFade: 48,

  afterglowWidth: 100,

  darkBaseAlpha: 0.22,
  darkBeamColor: { r: 0, g: 255, b: 136 },
  darkDotColor: { r: 255, g: 255, b: 255 },
  darkCharColor: { r: 0, g: 255, b: 136 },
  darkGlowAlphaScale: 0.75,
  darkCursorAlphaScale: 0.06,
  darkRippleAlphaScale: 0.5,

  lightBaseAlpha: 0.12,
  lightBeamColor: { r: 34, g: 180, b: 85 },
  lightDotColor: { r: 20, g: 30, b: 20 },
  lightCharColor: { r: 40, g: 160, b: 70 },
  lightGlowAlphaScale: 0.55,
  lightCursorAlphaScale: 0.03,
  lightRippleAlphaScale: 0.35,
};

function cloneParams(src: Readonly<CRTParams>): CRTParams {
  return {
    ...src,
    darkBeamColor: { ...src.darkBeamColor },
    darkDotColor: { ...src.darkDotColor },
    darkCharColor: { ...src.darkCharColor },
    lightBeamColor: { ...src.lightBeamColor },
    lightDotColor: { ...src.lightDotColor },
    lightCharColor: { ...src.lightCharColor },
  };
}

/** Singleton mutable params — mutated by Tweakpane, read by the canvas loop. */
export const crtParams: CRTParams = cloneParams(CRT_DEFAULTS);
