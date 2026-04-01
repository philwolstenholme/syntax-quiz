import { useEffect, useRef, useCallback, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';
import { useTheme } from '../context/useTheme';

const KEYWORDS = [
  'const', 'let', 'var', 'function', 'return', 'type', 'interface',
  'async', 'await', 'import', 'export', 'class', 'extends', 'enum',
  'readonly', 'typeof', 'keyof', 'infer', 'never', 'void', 'null',
  'true', 'false', 'new', 'this', 'super', 'yield', 'from', 'as',
];
const SYMBOLS = '{}[]()=>:;<>|&!?.+=-_/*%~^@#'.split('');

// Grid
const DOT_SPACING = 24;
const DOT_BASE_RADIUS = 1;

// Speed variation
const SPEED_VARIATION = 0.25;
const SPEED_SMOOTHING = 0.06; // faster easing so mouse effect feels responsive
const MOUSE_SPEED_INFLUENCE = 0.8; // strong mouse Y influence on scan speed

// Characters (only spawn on primary beam)
const CHAR_DENSITY = 0.035;
const CHAR_LIFETIME_MIN = 45;
const CHAR_LIFETIME_MAX = 75;

// Noise & glitch
const NOISE_DENSITY = 0.002;
const GLITCH_CHANCE = 0.003;

// Reference height for speed normalisation — beam traversal time is constant at any viewport height
const REFERENCE_HEIGHT = 900;

// Click ripple (dot-integrated)
const RIPPLE_SPEED = 4; // px per frame expansion
const RIPPLE_MAX_RADIUS = 200;
const RIPPLE_RING_WIDTH = 40; // how wide the influence band is around the ring edge

// Boot sequence
const BOOT_DURATION = 70; // frames

// Screen breathe
const BREATHE_FREQUENCY = 0.02; // Hz — very slow oscillation
const BREATHE_AMPLITUDE = 0.025; // 2.5% brightness variation

// Exclusion zone
const EXCLUDE_MARGIN = 32;
const EXCLUDE_FADE = 48;

// Afterglow (primary beam only)
const AFTERGLOW_WIDTH = 100;

// --- Beam definitions ---
interface ScanBeam {
  type: 'scan';
  y: number;
  baseSpeed: number;
  currentSpeed: number;
  width: number;
  strength: number; // 0–1 intensity multiplier
  phaseOffset: number; // for organic noise variation
}

interface FollowerBeam {
  type: 'follower';
  y: number;
  width: number;
  strength: number;
  easing: number; // 0–1, lower = laggier
}

// Autonomous scan beams: primary + several subtle secondary ones
function createScanBeams(): ScanBeam[] {
  // 12 secondary beams evenly distributed across viewport height (using REFERENCE_HEIGHT=900 as basis)
  // Positions: -75, -150, -225, -300, -375, -450, -525, -600, -675, -750, -825, -900
  return [
    // Primary beam — brightest, spawns characters
    { type: 'scan', y: 0, baseSpeed: 1.5, currentSpeed: 1.5, width: 140, strength: 1, phaseOffset: 0 },
    // Secondary scan beams — evenly distributed, varied speeds and strengths
    { type: 'scan', y: -75,  baseSpeed: 1.8, currentSpeed: 1.8, width: 55, strength: 0.18, phaseOffset: 33 },
    { type: 'scan', y: -150, baseSpeed: 3.3, currentSpeed: 3.3, width: 50, strength: 0.15, phaseOffset: 200 },
    { type: 'scan', y: -225, baseSpeed: 1.2, currentSpeed: 1.2, width: 65, strength: 0.22, phaseOffset: 88 },
    { type: 'scan', y: -300, baseSpeed: 2.5, currentSpeed: 2.5, width: 80, strength: 0.3,  phaseOffset: 100 },
    { type: 'scan', y: -375, baseSpeed: 0.7, currentSpeed: 0.7, width: 45, strength: 0.12, phaseOffset: 155 },
    { type: 'scan', y: -450, baseSpeed: 2.0, currentSpeed: 2.0, width: 70, strength: 0.25, phaseOffset: 73 },
    { type: 'scan', y: -525, baseSpeed: 3.1, currentSpeed: 3.1, width: 52, strength: 0.16, phaseOffset: 220 },
    { type: 'scan', y: -600, baseSpeed: 0.9, currentSpeed: 0.9, width: 60, strength: 0.2,  phaseOffset: 47 },
    { type: 'scan', y: -675, baseSpeed: 2.8, currentSpeed: 2.8, width: 58, strength: 0.19, phaseOffset: 175 },
    { type: 'scan', y: -750, baseSpeed: 1.5, currentSpeed: 1.5, width: 75, strength: 0.28, phaseOffset: 62 },
    { type: 'scan', y: -825, baseSpeed: 2.2, currentSpeed: 2.2, width: 48, strength: 0.14, phaseOffset: 140 },
    { type: 'scan', y: -900, baseSpeed: 1.1, currentSpeed: 1.1, width: 63, strength: 0.21, phaseOffset: 310 },
  ];
}

// Mouse-following beams with staggered easing
function createFollowerBeams(): FollowerBeam[] {
  return [
    // Closest follower — reacts fastest, slightly stronger
    { type: 'follower', y: 0, width: 90, strength: 0.35, easing: 0.06 },
    // Mid followers — moderate lag
    { type: 'follower', y: 0, width: 70, strength: 0.2, easing: 0.025 },
    { type: 'follower', y: 0, width: 60, strength: 0.18, easing: 0.015 },
    // Distant followers — very laggy, ghost-like
    { type: 'follower', y: 0, width: 50, strength: 0.12, easing: 0.008 },
    { type: 'follower', y: 0, width: 45, strength: 0.08, easing: 0.004 },
  ];
}

interface CRTBackgroundProps {
  excludeStartRef?: RefObject<HTMLElement | null>;
  excludeEndRef?: RefObject<HTMLElement | null>;
}

interface FloatingChar {
  x: number;
  y: number;
  char: string;
  life: number;
  maxLife: number;
  drift: number;
}

interface GlitchLine {
  y: number;
  offset: number;
  width: number;
  life: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
}

function dotHash(x: number, y: number): number {
  let h = (x * 374761 + y * 668265) | 0;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  return ((h >> 16) ^ h) & 0xff;
}

function exclusionMask(
  px: number, py: number,
  ex: number, ey: number, ew: number, eh: number,
): number {
  const dx = Math.max(ex - px, 0, px - (ex + ew));
  const dy = Math.max(ey - py, 0, py - (ey + eh));
  if (dx === 0 && dy === 0) return 0;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist >= EXCLUDE_FADE) return 1;
  const t = dist / EXCLUDE_FADE;
  return t * t * (3 - 2 * t);
}


function organicNoise(t: number): number {
  return (
    Math.sin(t * 0.7) * 0.5 +
    Math.sin(t * 1.3 + 2.1) * 0.3 +
    Math.sin(t * 2.9 + 5.4) * 0.2
  );
}

export const CRTBackground = ({ excludeStartRef, excludeEndRef }: CRTBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const animRef = useRef<number>(0);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0); // timestamp of previous frame for delta-time
  const chars = useRef<FloatingChar[]>([]);
  const glitches = useRef<GlitchLine[]>([]);
  const dprRef = useRef(1);
  const excludeRect = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  // Beam state
  const scanBeams = useRef<ScanBeam[]>(createScanBeams());
  const followerBeams = useRef<FollowerBeam[]>(createFollowerBeams());

  // Click ripples
  const ripples = useRef<Ripple[]>([]);

  // Boot sequence
  const bootFrame = useRef(0);
  const booted = useRef(false);

  // Mouse state
  const mouseYNorm = useRef(0.5); // 0–1
  const mouseYPx = useRef(0); // actual pixel Y
  const mouseXPx = useRef(0); // actual pixel X
  const mouseActive = useRef(false); // whether mouse is over the page

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseYNorm.current = e.clientY / window.innerHeight;
      mouseYPx.current = e.clientY;
      mouseXPx.current = e.clientX;
      mouseActive.current = true;
    };
    const handleMouseLeave = () => {
      mouseActive.current = false;
      mouseYNorm.current = 0.5;
    };

    const handleClick = (e: MouseEvent) => {
      ripples.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: RIPPLE_MAX_RADIUS,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, dt: number) => {
    const dpr = dprRef.current;
    ctx.clearRect(0, 0, width * dpr, height * dpr);

    // Boot sequence — clip to a horizontal band expanding symmetrically from center
    const isBooting = !booted.current;
    if (isBooting) {
      const bf = bootFrame.current;
      const progress = Math.min(bf / BOOT_DURATION, 1);
      let bandHalf: number;
      let bootBrightness: number;
      if (progress < 0.3) {
        const p = progress / 0.3;
        bandHalf = 1 + p * p * 8;
        bootBrightness = 0.4 + p * 0.6;
      } else if (progress < 0.9) {
        const p = (progress - 0.3) / 0.6;
        const eased = 1 - Math.pow(1 - p, 3);
        bandHalf = 9 + eased * (height / 2 - 9);
        bootBrightness = 1;
      } else {
        bandHalf = height / 2;
        bootBrightness = 1;
      }
      const cy = (height / 2) * dpr;
      const bh = bandHalf * dpr;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, cy - bh, width * dpr, bh * 2);
      ctx.clip();
      ctx.globalAlpha = bootBrightness;
    }

    const baseAlpha = isDark ? 0.22 : 0.12;
    const beamColor = isDark ? ([0, 255, 136] as const) : ([140, 140, 140] as const);
    const dotColor = isDark ? ([255, 255, 255] as const) : ([0, 0, 0] as const);
    const charColor = isDark ? ([0, 255, 136] as const) : ([100, 100, 100] as const);

    const frame = frameRef.current;
    const breathe = 1 + Math.sin(frame / 60 * Math.PI * 2 * BREATHE_FREQUENCY) * BREATHE_AMPLITUDE;
    const flicker = (1 - Math.random() * 0.03) * breathe;

    // Pre-compute beam data as flat arrays for fast iteration (avoids object allocation + property access)
    const scanArr = scanBeams.current;
    const follArr = followerBeams.current;
    const beamCount = scanArr.length + follArr.length;
    const beamYs = new Float64Array(beamCount);
    const beamWidths = new Float64Array(beamCount);
    const beamStrengths = new Float64Array(beamCount);
    for (let i = 0; i < scanArr.length; i++) {
      beamYs[i] = scanArr[i]!.y;
      beamWidths[i] = scanArr[i]!.width;
      beamStrengths[i] = scanArr[i]!.strength;
    }
    for (let i = 0; i < follArr.length; i++) {
      const idx = scanArr.length + i;
      beamYs[idx] = follArr[i]!.y;
      beamWidths[idx] = follArr[i]!.width;
      beamStrengths[idx] = follArr[i]!.strength;
    }

    // Pre-compute the Y range that any beam can influence (for early row skipping)
    let beamMinY = Infinity;
    let beamMaxY = -Infinity;
    for (let i = 0; i < beamCount; i++) {
      const lo = beamYs[i]! - beamWidths[i]!;
      const hi = beamYs[i]! + beamWidths[i]!;
      if (lo < beamMinY) beamMinY = lo;
      if (hi > beamMaxY) beamMaxY = hi;
    }
    // Extend for afterglow
    const primaryBeam = scanArr[0]!;
    const primaryBeamY = primaryBeam.y;
    const afterglowMinY = primaryBeamY - AFTERGLOW_WIDTH;
    if (afterglowMinY < beamMinY) beamMinY = afterglowMinY;
    if (primaryBeamY > beamMaxY) beamMaxY = primaryBeamY;

    // Exclusion zone
    const er = excludeRect.current;
    const hasExclusion = er !== null;
    const exX = er ? er.x - EXCLUDE_MARGIN : 0;
    const exY = er ? er.y - EXCLUDE_MARGIN : 0;
    const exW = er ? er.w + EXCLUDE_MARGIN * 2 : 0;
    const exH = er ? er.h + EXCLUDE_MARGIN * 2 : 0;

    // Mouse state
    const dotMxActive = mouseActive.current;
    const dotMx = mouseXPx.current;
    const dotMy = mouseYPx.current;
    const dotMaxReach = width * 0.8;
    const halfHeight = height * 0.5;

    // Pre-compute edge falloff per column and row (avoids sqrt per dot)
    const cx = width / 2;
    const cy = height / 2;
    const colCount = Math.ceil((width - DOT_SPACING) / DOT_SPACING) + 1;
    const rowCount = Math.ceil((height - DOT_SPACING) / DOT_SPACING) + 1;
    const edgeAlphaX = new Float64Array(colCount);
    const edgeRadiusX = new Float64Array(colCount);
    const edgeAlphaY = new Float64Array(rowCount);
    const edgeRadiusY = new Float64Array(rowCount);
    for (let ci = 0; ci < colCount; ci++) {
      const x = DOT_SPACING + ci * DOT_SPACING;
      const dx = (x - cx) / cx;
      const dist2 = dx * dx;
      edgeAlphaX[ci] = dist2;
      edgeRadiusX[ci] = dist2;
    }
    for (let ri = 0; ri < rowCount; ri++) {
      const y = DOT_SPACING + ri * DOT_SPACING;
      const dy = (y - cy) / cy;
      const dist2 = dy * dy;
      edgeAlphaY[ri] = dist2;
      edgeRadiusY[ri] = dist2;
    }

    // Pre-compute base dot color string (used for non-glowing dots)
    const dotR = dotColor[0], dotG = dotColor[1], dotB = dotColor[2];
    const beamR = beamColor[0], beamG = beamColor[1], beamB = beamColor[2];
    const glowAlphaScale = isDark ? 0.75 : 0.45;
    const cursorAlphaScale = isDark ? 0.06 : 0.03;
    const rippleAlphaScale = isDark ? 0.5 : 0.25;

    // Active ripples snapshot
    const activeRipples = ripples.current;
    const rippleCount = activeRipples.length;

    // Use fillRect for dots instead of arc (much faster — no path overhead)
    const twoPi = Math.PI * 2;
    const useSubPixel = isDark && dpr >= 1.5;

    // Draw dot grid
    for (let ci = 0; ci < colCount; ci++) {
      const x = DOT_SPACING + ci * DOT_SPACING;
      if (x >= width) break;

      const edDx2 = edgeAlphaX[ci]!;

      for (let ri = 0; ri < rowCount; ri++) {
        const y = DOT_SPACING + ri * DOT_SPACING;
        if (y >= height) break;

        const mask = hasExclusion ? exclusionMask(x, y, exX, exY, exW, exH) : 1;
        if (mask < 0.01) continue;

        const hash = dotHash(x, y);
        const brightnessVar = 0.6 + (hash / 255) * 0.8;
        const sizeVar = 0.8 + ((hash >> 4) / 15) * 0.4;

        // Cursor proximity (elliptical falloff)
        let cursorDotBoost = 0;
        if (dotMxActive) {
          const ddx = Math.abs(x - dotMx);
          const ddy = Math.abs(y - dotMy);
          const normDx = ddx / dotMaxReach;
          const normDy = ddy / halfHeight;
          const normDist2 = normDx * normDx + normDy * normDy;
          if (normDist2 < 1) {
            const proximity = 1 - Math.sqrt(normDist2);
            const dotNoise = ((hash ^ (hash >> 3)) & 0xff) / 255;
            const noisy = proximity * 0.75 + dotNoise * 0.25;
            cursorDotBoost = noisy * noisy * (3 - 2 * noisy);
          }
        }

        // Compute max glow — only check beams whose Y range covers this dot
        let maxGlow = 0;
        for (let bi = 0; bi < beamCount; bi++) {
          const dist = Math.abs(y - beamYs[bi]!);
          const bw = beamWidths[bi]!;
          if (dist >= bw) continue;
          const influence = (1 - dist / bw) * beamStrengths[bi]!;
          const glow = influence * influence;
          if (glow > maxGlow) maxGlow = glow;
        }

        // Afterglow (primary beam only)
        const behind = primaryBeamY - y;
        if (behind > 0 && behind < AFTERGLOW_WIDTH) {
          const t = 1 - behind / AFTERGLOW_WIDTH;
          const ag = t * t * 0.35;
          if (ag > maxGlow) maxGlow = ag;
        }

        const totalGlow = maxGlow < 1 ? maxGlow : 1;

        // Ripple influence
        let rippleBoost = 0;
        for (let ri2 = 0; ri2 < rippleCount; ri2++) {
          const rip = activeRipples[ri2]!;
          const rdx = x - rip.x;
          const rdy = y - rip.y;
          const distFromCenter = Math.sqrt(rdx * rdx + rdy * rdy);
          const distFromRing = Math.abs(distFromCenter - rip.radius);
          if (distFromRing < RIPPLE_RING_WIDTH) {
            const ringProximity = 1 - distFromRing / RIPPLE_RING_WIDTH;
            const rippleLife = 1 - rip.radius / rip.maxRadius;
            const boost = ringProximity * rippleLife;
            if (boost > rippleBoost) rippleBoost = boost;
          }
        }

        // Edge falloff — combine pre-computed X and Y components
        const edDy2 = edgeAlphaY[ri]!;
        const edgeDist = Math.sqrt(edDx2 + edDy2);
        const edgeNorm = edgeDist < 1.2 ? edgeDist / 1.2 : 1;
        const edgeT = edgeNorm * edgeNorm;
        const edgeAlpha = 1 - edgeT * 0.2;
        const edgeRadius = 1 + edgeT * 0.3;

        const cursorAlpha = cursorDotBoost * cursorAlphaScale;
        const cursorSize = cursorDotBoost * 0.25;
        const rippleAlpha = rippleBoost * rippleAlphaScale;
        const rippleSize = rippleBoost * 2.5;
        const alpha = (baseAlpha + cursorAlpha + rippleAlpha + totalGlow * glowAlphaScale) * brightnessVar * flicker * mask * edgeAlpha;
        const r = (DOT_BASE_RADIUS + cursorSize + rippleSize + totalGlow * 2) * sizeVar * edgeRadius;

        // Magnetic interference — chromatic aberration on dots near cursor
        let magneticShift = 0;
        if (isDark && dotMxActive) {
          const mdx = Math.abs(x - dotMx);
          const mdy = Math.abs(y - dotMy);
          const magnetDist2 = mdx * mdx + mdy * mdy;
          const magnetRadius = 120;
          if (magnetDist2 < magnetRadius * magnetRadius) {
            magneticShift = (1 - Math.sqrt(magnetDist2) / magnetRadius) * 1.5 * dpr;
          }
        }

        if (totalGlow > 0.05 || rippleBoost > 0.05) {
          const blend = Math.min(Math.max(totalGlow * 1.5, rippleBoost), 1);
          const cr = dotR + (beamR - dotR) * blend;
          const cg = dotG + (beamG - dotG) * blend;
          const cb = dotB + (beamB - dotB) * blend;

          if (magneticShift > 0.3) {
            ctx.fillStyle = `rgba(${Math.min(255, (cr | 0) + 80)},${(cg | 0) >> 1},${(cb | 0) >> 1},${alpha * 0.3})`;
            ctx.beginPath();
            ctx.arc((x - magneticShift) * dpr + magneticShift, y * dpr, r * dpr, 0, twoPi);
            ctx.fill();
            ctx.fillStyle = `rgba(${(cr | 0) >> 1},${(cg | 0) >> 1},${Math.min(255, (cb | 0) + 80)},${alpha * 0.3})`;
            ctx.beginPath();
            ctx.arc((x + magneticShift) * dpr - magneticShift, y * dpr, r * dpr, 0, twoPi);
            ctx.fill();
          }

          ctx.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${alpha})`;
        } else {
          ctx.fillStyle = `rgba(${dotR},${dotG},${dotB},${alpha * brightnessVar})`;
        }

        // Phosphor sub-pixel rendering in dark mode
        if (useSubPixel && r * dpr > 1.5) {
          const px = x * dpr;
          const py = y * dpr;
          const subW = Math.max(0.6, (r * dpr) / 2.2);
          const subH = r * dpr * 1.6;
          const gap = subW * 0.3;
          const glowing = totalGlow > 0.05;
          const srcR = glowing ? beamR : dotR;
          const srcG = glowing ? beamG : dotG;
          const srcB = glowing ? beamB : dotB;
          ctx.fillStyle = `rgba(${Math.min(255, (beamR + dotR) | 0)},${(srcG * 0.3) | 0},${(srcB * 0.3) | 0},${alpha * 0.7})`;
          ctx.fillRect(px - subW - gap, py - subH / 2, subW, subH);
          ctx.fillStyle = `rgba(${(srcR * 0.3) | 0},${Math.min(255, (srcG + 50) | 0)},${(srcB * 0.3) | 0},${alpha * 0.8})`;
          ctx.fillRect(px - subW / 2, py - subH / 2, subW, subH);
          ctx.fillStyle = `rgba(${(srcR * 0.3) | 0},${(srcG * 0.3) | 0},${Math.min(255, (srcB + 50) | 0)},${alpha * 0.7})`;
          ctx.fillRect(px + gap, py - subH / 2, subW, subH);
        } else {
          ctx.beginPath();
          ctx.arc(x * dpr, y * dpr, r * dpr, 0, twoPi);
          ctx.fill();
        }

        // Spawn characters only near primary beam
        const primaryDist = Math.abs(y - primaryBeamY);
        const primaryGlow = Math.max(0, 1 - primaryDist / primaryBeam.width);
        if (mask > 0.5 && primaryGlow > 0.6 && Math.random() < CHAR_DENSITY) {
          const char = Math.random() < 0.4
            ? KEYWORDS[(Math.random() * KEYWORDS.length) | 0] ?? '='
            : SYMBOLS[(Math.random() * SYMBOLS.length) | 0] ?? '#';
          const lifetime = CHAR_LIFETIME_MIN + ((Math.random() * (CHAR_LIFETIME_MAX - CHAR_LIFETIME_MIN)) | 0);
          chars.current.push({ x, y, char, life: lifetime, maxLife: lifetime, drift: (Math.random() - 0.5) * 0.3 });
        }
      }
    }

    // Draw floating characters
    const fontSize = 10 * dpr;
    ctx.font = `${fontSize}px "Geist Mono", ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const mxActive = mouseActive.current;
    const mx = mouseXPx.current;

    // In-place filter for chars (avoids allocating a new array every frame)
    let writeIdx = 0;
    const charArr = chars.current;
    for (let i = 0; i < charArr.length; i++) {
      const c = charArr[i]!;
      c.life -= dt;
      if (c.life <= 0) continue;
      c.x += c.drift * dt;

      const cMask = hasExclusion ? exclusionMask(c.x, c.y, exX, exY, exW, exH) : 1;
      if (cMask < 0.01) continue;

      let cursorXFactor = 1;
      if (mxActive && width > 0) {
        const xDist = Math.abs(c.x - mx);
        const maxReach = width * 0.75;
        const proximity = Math.max(0, 1 - xDist / maxReach);
        const charNoise = (dotHash(Math.round(c.x) * 7, Math.round(c.y) * 13) / 255);
        const noisy = proximity * 0.7 + charNoise * 0.3;
        cursorXFactor = noisy * noisy * (3 - 2 * noisy);
        cursorXFactor = 0.08 + cursorXFactor * 0.92;
      }

      const progress = c.life / c.maxLife;
      const charAlphaBase = progress > 0.85 ? (1 - progress) / 0.15 : progress / 0.85;
      const charAlpha = charAlphaBase * (isDark ? 0.55 : 0.35) * flicker * cMask * cursorXFactor;

      if (charAlpha >= 0.02) {
        if (isDark && charAlpha > 0.15) {
          const fringeOffset = 1 * dpr;
          ctx.fillStyle = `rgba(255,50,50,${charAlpha * 0.2})`;
          ctx.fillText(c.char, (c.x - fringeOffset) * dpr, c.y * dpr);
          ctx.fillStyle = `rgba(50,50,255,${charAlpha * 0.2})`;
          ctx.fillText(c.char, (c.x + fringeOffset) * dpr, c.y * dpr);
        }
        ctx.fillStyle = `rgba(${charColor[0]},${charColor[1]},${charColor[2]},${charAlpha})`;
        ctx.fillText(c.char, c.x * dpr, c.y * dpr);
      }

      charArr[writeIdx++] = c;
    }
    charArr.length = writeIdx;

    // Beam glow bands — only render visible beams
    for (let bi = 0; bi < beamCount; bi++) {
      const bY = beamYs[bi]!;
      const bStr = beamStrengths[bi]!;
      const glowHeight = 80 * bStr;
      // Skip beams entirely off screen
      if (bY + glowHeight < 0 || bY - glowHeight > height) continue;
      const beamAlpha = (isDark ? 0.1 : 0.055) * bStr * flicker;
      if (beamAlpha < 0.002) continue;
      const gradient = ctx.createLinearGradient(0, (bY - glowHeight) * dpr, 0, (bY + glowHeight) * dpr);
      gradient.addColorStop(0, `rgba(${beamR},${beamG},${beamB},0)`);
      gradient.addColorStop(0.3, `rgba(${beamR},${beamG},${beamB},${beamAlpha * 0.5})`);
      gradient.addColorStop(0.5, `rgba(${beamR},${beamG},${beamB},${beamAlpha})`);
      gradient.addColorStop(0.7, `rgba(${beamR},${beamG},${beamB},${beamAlpha * 0.3})`);
      gradient.addColorStop(1, `rgba(${beamR},${beamG},${beamB},0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, (bY - glowHeight) * dpr, width * dpr, glowHeight * 2 * dpr);
    }

    // Beam hot spot
    if (isDark) {
      const hotY = primaryBeamY * dpr;
      const hotRadius = 12 * dpr;
      const hotGrad = ctx.createRadialGradient(
        (width / 2) * dpr, hotY, 0,
        (width / 2) * dpr, hotY, hotRadius
      );
      hotGrad.addColorStop(0, `rgba(255,255,255,${0.08 * flicker})`);
      hotGrad.addColorStop(0.3, `rgba(${beamR},${beamG},${beamB},${0.05 * flicker})`);
      hotGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = hotGrad;
      ctx.fillRect(
        (width / 2 - hotRadius) * dpr, (primaryBeamY - hotRadius) * dpr,
        hotRadius * 2 * dpr, hotRadius * 2 * dpr
      );
    }

    // Advance ripples (in-place)
    writeIdx = 0;
    for (let i = 0; i < activeRipples.length; i++) {
      const rip = activeRipples[i]!;
      rip.radius += RIPPLE_SPEED * dt;
      if (rip.radius <= rip.maxRadius) {
        activeRipples[writeIdx++] = rip;
      }
    }
    activeRipples.length = writeIdx;

    // Static noise
    const noiseCount = (width * height * NOISE_DENSITY) | 0;
    for (let i = 0; i < noiseCount; i++) {
      const nx = Math.random() * width;
      const ny = Math.random() * height;
      const nMask = hasExclusion ? exclusionMask(nx, ny, exX, exY, exW, exH) : 1;
      if (nMask < 0.1) continue;
      const nAlpha = Math.random() * (isDark ? 0.15 : 0.08) * flicker * nMask;
      if (Math.random() < 0.6) {
        ctx.fillStyle = `rgba(${beamR},${beamG},${beamB},${nAlpha})`;
      } else {
        ctx.fillStyle = `rgba(${dotR},${dotG},${dotB},${nAlpha * 0.5})`;
      }
      const nSize = (0.5 + Math.random() * 1.5) * dpr;
      ctx.fillRect(nx * dpr, ny * dpr, nSize, nSize);
    }

    // Glitch lines — use drawImage with clipping instead of getImageData/putImageData
    if (Math.random() < GLITCH_CHANCE) {
      glitches.current.push({
        y: Math.random() * height,
        offset: (Math.random() - 0.5) * 30,
        width: 2 + Math.random() * 6,
        life: 3 + ((Math.random() * 5) | 0),
      });
    }

    writeIdx = 0;
    const glitchArr = glitches.current;
    for (let i = 0; i < glitchArr.length; i++) {
      const g = glitchArr[i]!;
      g.life -= dt;
      if (g.life <= 0) continue;
      const glitchAlpha = (g.life / 8) * (isDark ? 0.12 : 0.06);
      const sy = (g.y * dpr) | 0;
      const sh = (g.width * dpr) | 0;
      const canvasW = (width * dpr) | 0;
      const offsetPx = (g.offset * dpr) | 0;

      // Copy the strip to an offset position using drawImage (GPU-accelerated, no readback)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, sy, canvasW, sh);
      ctx.clip();
      ctx.drawImage(ctx.canvas, 0, sy, canvasW, sh, offsetPx, sy, canvasW, sh);
      ctx.fillStyle = `rgba(${beamR},${beamG},${beamB},${glitchAlpha})`;
      ctx.fillRect(0, sy, canvasW, sh);
      ctx.restore();

      glitchArr[writeIdx++] = g;
    }
    glitchArr.length = writeIdx;

    // Phosphor bloom — use lighter composite (skip expensive blur filter)
    if (isDark) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.03 * flicker;
      ctx.drawImage(ctx.canvas, 0, 0);
      ctx.restore();
    }

    // End boot clip if active
    if (isBooting) {
      ctx.restore();
    }

    // Exclusion zone mask
    if (hasExclusion) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';

      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fillRect(exX * dpr, exY * dpr, exW * dpr, exH * dpr);

      const fade = EXCLUDE_FADE * dpr;

      const topGrad = ctx.createLinearGradient(0, (exY - EXCLUDE_FADE) * dpr, 0, exY * dpr);
      topGrad.addColorStop(0, 'rgba(0,0,0,0)');
      topGrad.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.fillStyle = topGrad;
      ctx.fillRect((exX - EXCLUDE_FADE) * dpr, (exY - EXCLUDE_FADE) * dpr, (exW + EXCLUDE_FADE * 2) * dpr, fade);

      const botGrad = ctx.createLinearGradient(0, (exY + exH) * dpr, 0, (exY + exH + EXCLUDE_FADE) * dpr);
      botGrad.addColorStop(0, 'rgba(0,0,0,1)');
      botGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = botGrad;
      ctx.fillRect((exX - EXCLUDE_FADE) * dpr, (exY + exH) * dpr, (exW + EXCLUDE_FADE * 2) * dpr, fade);

      const leftGrad = ctx.createLinearGradient((exX - EXCLUDE_FADE) * dpr, 0, exX * dpr, 0);
      leftGrad.addColorStop(0, 'rgba(0,0,0,0)');
      leftGrad.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.fillStyle = leftGrad;
      ctx.fillRect((exX - EXCLUDE_FADE) * dpr, exY * dpr, fade, exH * dpr);

      const rightGrad = ctx.createLinearGradient((exX + exW) * dpr, 0, (exX + exW + EXCLUDE_FADE) * dpr, 0);
      rightGrad.addColorStop(0, 'rgba(0,0,0,1)');
      rightGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rightGrad;
      ctx.fillRect((exX + exW) * dpr, exY * dpr, fade, exH * dpr);

      const corners: [number, number][] = [
        [exX, exY], [exX + exW, exY],
        [exX, exY + exH], [exX + exW, exY + exH],
      ];
      for (const [ccx, ccy] of corners) {
        const cornerGrad = ctx.createRadialGradient(ccx * dpr, ccy * dpr, 0, ccx * dpr, ccy * dpr, fade);
        cornerGrad.addColorStop(0, 'rgba(0,0,0,1)');
        cornerGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cornerGrad;
        ctx.fillRect((ccx - EXCLUDE_FADE) * dpr, (ccy - EXCLUDE_FADE) * dpr, fade * 2, fade * 2);
      }

      ctx.restore();
    }
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resize();
    window.addEventListener('resize', resize);

    if (prefersReducedMotion) {
      // Hide all beams offscreen for static render
      scanBeams.current = scanBeams.current.map(b => ({ ...b, y: -999 }));
      followerBeams.current = followerBeams.current.map(b => ({ ...b, y: -999 }));
      draw(ctx, canvas.width / dprRef.current, canvas.height / dprRef.current, 1);
      return () => window.removeEventListener('resize', resize);
    }

    const animate = (timestamp: number) => {
      // Delta-time: scale all per-frame movement so speed is consistent regardless of framerate.
      // The original code assumed ~60fps, so TARGET_FRAME_MS = 1000/60 ≈ 16.67ms.
      const TARGET_FRAME_MS = 1000 / 60;
      const rawDelta = lastTimeRef.current > 0 ? timestamp - lastTimeRef.current : TARGET_FRAME_MS;
      // Clamp delta to avoid huge jumps when tab is backgrounded or first frame
      const delta = Math.min(rawDelta, TARGET_FRAME_MS * 3);
      const dt = delta / TARGET_FRAME_MS; // 1.0 at 60fps, 2.0 at 30fps, etc.
      lastTimeRef.current = timestamp;

      const height = canvas.height / dprRef.current;
      const width = canvas.width / dprRef.current;
      const frame = ++frameRef.current;

      // Boot sequence — advance proportionally to elapsed time
      if (!booted.current) {
        bootFrame.current += dt;
        if (bootFrame.current >= BOOT_DURATION) {
          booted.current = true;
        }
      }

      // Compute exclusion rect — throttle getBoundingClientRect to every 10 frames
      if (frame % 10 === 0 || excludeRect.current === null) {
        const startEl = excludeStartRef?.current;
        const endEl = excludeEndRef?.current;
        if (startEl && endEl) {
          const sr = startEl.getBoundingClientRect();
          const eRect = endEl.getBoundingClientRect();
          excludeRect.current = {
            x: Math.min(sr.left, eRect.left),
            y: sr.top,
            w: Math.max(sr.right, eRect.right) - Math.min(sr.left, eRect.left),
            h: eRect.bottom - sr.top,
          };
        } else if (startEl) {
          const r = startEl.getBoundingClientRect();
          excludeRect.current = { x: r.left, y: r.top, w: r.width, h: r.height };
        } else {
          excludeRect.current = null;
        }
      }

      // Mouse influence on scan speed
      const mouseOffset = (mouseYNorm.current - 0.5) * 2 * MOUSE_SPEED_INFLUENCE;
      const timeSeconds = frame / 60;

      // Update scan beams — scale movement by dt for framerate independence
      for (const b of scanBeams.current) {
        const organic = organicNoise(timeSeconds + b.phaseOffset) * SPEED_VARIATION;
        const targetSpeed = Math.max(0.08, b.baseSpeed + organic + mouseOffset * b.baseSpeed);
        b.currentSpeed += (targetSpeed - b.currentSpeed) * (1 - Math.pow(1 - SPEED_SMOOTHING, dt));
        b.y += b.currentSpeed * (height / REFERENCE_HEIGHT) * dt;
        if (b.y > height + b.width) b.y = -b.width;
      }

      // Update follower beams — ease toward mouse Y, scaled by dt
      const targetY = mouseActive.current ? mouseYPx.current : height * 0.5;
      for (const b of followerBeams.current) {
        b.y += (targetY - b.y) * (1 - Math.pow(1 - b.easing, dt));
      }

      draw(ctx, width, height, dt);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [prefersReducedMotion, draw, excludeStartRef, excludeEndRef]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {/* CRT scanlines */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
          backgroundSize: '100% 3px',
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 35%, var(--bg) 100%),
            radial-gradient(ellipse 120% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.15) 100%)
          `,
        }}
      />
    </div>
  );
};
