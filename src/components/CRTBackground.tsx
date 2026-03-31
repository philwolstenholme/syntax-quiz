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
  return [
    // Primary beam — brightest, spawns characters
    { type: 'scan', y: 0, baseSpeed: 0.5, currentSpeed: 0.5, width: 140, strength: 1, phaseOffset: 0 },
    // Secondary scan beams — various speeds and strengths
    { type: 'scan', y: -300, baseSpeed: 0.85, currentSpeed: 0.85, width: 80, strength: 0.3, phaseOffset: 100 },
    { type: 'scan', y: -600, baseSpeed: 0.3, currentSpeed: 0.3, width: 60, strength: 0.2, phaseOffset: 47 },
    { type: 'scan', y: -150, baseSpeed: 1.1, currentSpeed: 1.1, width: 50, strength: 0.15, phaseOffset: 200 },
    { type: 'scan', y: -450, baseSpeed: 0.65, currentSpeed: 0.65, width: 70, strength: 0.25, phaseOffset: 73 },
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
  const chars = useRef<FloatingChar[]>([]);
  const glitches = useRef<GlitchLine[]>([]);
  const dprRef = useRef(1);
  const excludeRect = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  // Beam state
  const scanBeams = useRef<ScanBeam[]>(createScanBeams());
  const followerBeams = useRef<FollowerBeam[]>(createFollowerBeams());

  // Mouse state
  const mouseYNorm = useRef(0.5); // 0–1
  const mouseYPx = useRef(0); // actual pixel Y
  const mouseActive = useRef(false); // whether mouse is over the page

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseYNorm.current = e.clientY / window.innerHeight;
      mouseYPx.current = e.clientY;
      mouseActive.current = true;
    };
    const handleMouseLeave = () => {
      mouseActive.current = false;
      mouseYNorm.current = 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const dpr = dprRef.current;
    ctx.clearRect(0, 0, width * dpr, height * dpr);

    const baseAlpha = isDark ? 0.08 : 0.05;
    const beamColor = isDark ? ([0, 255, 136] as const) : ([140, 140, 140] as const);
    const dotColor = isDark ? ([255, 255, 255] as const) : ([0, 0, 0] as const);
    const charColor = isDark ? ([0, 255, 136] as const) : ([100, 100, 100] as const);

    const flicker = 1 - Math.random() * 0.03;

    // Collect all beam positions and properties for the dot loop
    const allBeams: Array<{ y: number; width: number; strength: number }> = [];
    for (const b of scanBeams.current) {
      allBeams.push({ y: b.y, width: b.width, strength: b.strength });
    }
    for (const b of followerBeams.current) {
      allBeams.push({ y: b.y, width: b.width, strength: b.strength });
    }

    const primaryBeam = scanBeams.current[0]!;
    const primaryBeamY = primaryBeam.y;

    // Exclusion zone
    const er = excludeRect.current;
    const hasExclusion = er !== null;
    const exX = er ? er.x - EXCLUDE_MARGIN : 0;
    const exY = er ? er.y - EXCLUDE_MARGIN : 0;
    const exW = er ? er.w + EXCLUDE_MARGIN * 2 : 0;
    const exH = er ? er.h + EXCLUDE_MARGIN * 2 : 0;

    // Draw dot grid
    for (let x = DOT_SPACING; x < width; x += DOT_SPACING) {
      for (let y = DOT_SPACING; y < height; y += DOT_SPACING) {
        const mask = hasExclusion ? exclusionMask(x, y, exX, exY, exW, exH) : 1;
        if (mask < 0.01) continue;

        const hash = dotHash(x, y);
        const brightnessVar = 0.6 + (hash / 255) * 0.8;
        const sizeVar = 0.8 + ((hash >> 4) / 15) * 0.4;

        // Compute max glow from all beams
        let maxGlow = 0;
        for (const b of allBeams) {
          const dist = Math.abs(y - b.y);
          const influence = Math.max(0, 1 - dist / b.width) * b.strength;
          const glow = influence * influence;
          if (glow > maxGlow) maxGlow = glow;
        }

        // Afterglow (primary beam only)
        const behind = primaryBeamY - y;
        if (behind > 0 && behind < AFTERGLOW_WIDTH) {
          const ag = Math.pow(1 - behind / AFTERGLOW_WIDTH, 2) * 0.35;
          if (ag > maxGlow) maxGlow = ag;
        }

        const totalGlow = Math.min(maxGlow, 1);
        const alpha = (baseAlpha + totalGlow * (isDark ? 0.75 : 0.45)) * brightnessVar * flicker * mask;
        const r = (DOT_BASE_RADIUS + totalGlow * 2) * sizeVar;

        if (totalGlow > 0.05) {
          const blend = Math.min(totalGlow * 1.5, 1);
          const cr = dotColor[0] + (beamColor[0] - dotColor[0]) * blend;
          const cg = dotColor[1] + (beamColor[1] - dotColor[1]) * blend;
          const cb = dotColor[2] + (beamColor[2] - dotColor[2]) * blend;
          ctx.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${alpha})`;
        } else {
          ctx.fillStyle = `rgba(${dotColor[0]},${dotColor[1]},${dotColor[2]},${alpha * brightnessVar})`;
        }

        ctx.beginPath();
        ctx.arc(x * dpr, y * dpr, r * dpr, 0, Math.PI * 2);
        ctx.fill();

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

    chars.current = chars.current.filter(c => {
      c.life--;
      if (c.life <= 0) return false;
      c.x += c.drift;

      const cMask = hasExclusion ? exclusionMask(c.x, c.y, exX, exY, exW, exH) : 1;
      if (cMask < 0.01) return false;

      const progress = c.life / c.maxLife;
      const alpha = progress > 0.85 ? (1 - progress) / 0.15 : progress / 0.85;
      const charAlpha = alpha * (isDark ? 0.55 : 0.35) * flicker * cMask;

      if (isDark && charAlpha > 0.15) {
        const fringeOffset = 1 * dpr;
        ctx.fillStyle = `rgba(255,50,50,${charAlpha * 0.2})`;
        ctx.fillText(c.char, (c.x - fringeOffset) * dpr, c.y * dpr);
        ctx.fillStyle = `rgba(50,50,255,${charAlpha * 0.2})`;
        ctx.fillText(c.char, (c.x + fringeOffset) * dpr, c.y * dpr);
      }

      ctx.fillStyle = `rgba(${charColor[0]},${charColor[1]},${charColor[2]},${charAlpha})`;
      ctx.fillText(c.char, c.x * dpr, c.y * dpr);
      return true;
    });

    // Beam glow bands for all beams
    for (const b of allBeams) {
      const glowHeight = 80 * b.strength;
      const beamAlpha = (isDark ? 0.07 : 0.04) * b.strength * flicker;
      if (beamAlpha < 0.002) continue; // skip invisible beams
      const gradient = ctx.createLinearGradient(0, (b.y - glowHeight) * dpr, 0, (b.y + glowHeight) * dpr);
      gradient.addColorStop(0, `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},0)`);
      gradient.addColorStop(0.3, `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},${beamAlpha * 0.5})`);
      gradient.addColorStop(0.5, `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},${beamAlpha})`);
      gradient.addColorStop(0.7, `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},${beamAlpha * 0.3})`);
      gradient.addColorStop(1, `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, (b.y - glowHeight) * dpr, width * dpr, glowHeight * 2 * dpr);
    }

    // Static noise
    const noiseCount = (width * height * NOISE_DENSITY) | 0;
    for (let i = 0; i < noiseCount; i++) {
      const nx = Math.random() * width;
      const ny = Math.random() * height;
      const nMask = hasExclusion ? exclusionMask(nx, ny, exX, exY, exW, exH) : 1;
      if (nMask < 0.1) continue;
      const nAlpha = Math.random() * (isDark ? 0.15 : 0.08) * flicker * nMask;
      if (Math.random() < 0.6) {
        ctx.fillStyle = `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},${nAlpha})`;
      } else {
        ctx.fillStyle = `rgba(${dotColor[0]},${dotColor[1]},${dotColor[2]},${nAlpha * 0.5})`;
      }
      const nSize = (0.5 + Math.random() * 1.5) * dpr;
      ctx.fillRect(nx * dpr, ny * dpr, nSize, nSize);
    }

    // Glitch lines
    if (Math.random() < GLITCH_CHANCE) {
      glitches.current.push({
        y: Math.random() * height,
        offset: (Math.random() - 0.5) * 30,
        width: 2 + Math.random() * 6,
        life: 3 + ((Math.random() * 5) | 0),
      });
    }

    glitches.current = glitches.current.filter(g => {
      g.life--;
      if (g.life <= 0) return false;
      const glitchAlpha = (g.life / 8) * (isDark ? 0.12 : 0.06);
      ctx.save();
      const sy = g.y * dpr;
      const sh = g.width * dpr;
      const sourceData = ctx.getImageData(0, sy | 0, (width * dpr) | 0, sh | 0);
      ctx.fillStyle = `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},${glitchAlpha})`;
      ctx.fillRect(0, sy, width * dpr, sh);
      ctx.putImageData(sourceData, (g.offset * dpr) | 0, sy | 0);
      ctx.restore();
      return true;
    });

    // Phosphor bloom (dark mode, perf-gated)
    const canvasPixels = width * dpr * height * dpr;
    if (isDark && canvasPixels < 4_000_000) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.04 * flicker;
      ctx.filter = `blur(${8 * dpr}px)`;
      ctx.drawImage(ctx.canvas, 0, 0);
      ctx.restore();
      ctx.filter = 'none';
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
      for (const [cx, cy] of corners) {
        const cornerGrad = ctx.createRadialGradient(cx * dpr, cy * dpr, 0, cx * dpr, cy * dpr, fade);
        cornerGrad.addColorStop(0, 'rgba(0,0,0,1)');
        cornerGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cornerGrad;
        ctx.fillRect((cx - EXCLUDE_FADE) * dpr, (cy - EXCLUDE_FADE) * dpr, fade * 2, fade * 2);
      }

      ctx.restore();
    }
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
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
      draw(ctx, canvas.width / dprRef.current, canvas.height / dprRef.current);
      return () => window.removeEventListener('resize', resize);
    }

    const animate = () => {
      const height = canvas.height / dprRef.current;
      const width = canvas.width / dprRef.current;
      const frame = ++frameRef.current;

      // Compute exclusion rect
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

      // Mouse influence on scan speed
      const mouseOffset = (mouseYNorm.current - 0.5) * 2 * MOUSE_SPEED_INFLUENCE;
      const timeSeconds = frame / 60;

      // Update scan beams
      for (const b of scanBeams.current) {
        const organic = organicNoise(timeSeconds + b.phaseOffset) * SPEED_VARIATION;
        const targetSpeed = Math.max(0.08, b.baseSpeed + organic + mouseOffset * b.baseSpeed);
        b.currentSpeed += (targetSpeed - b.currentSpeed) * SPEED_SMOOTHING;
        b.y += b.currentSpeed;
        if (b.y > height + b.width) b.y = -b.width;
      }

      // Update follower beams — ease toward mouse Y position
      const targetY = mouseActive.current ? mouseYPx.current : height * 0.5;
      for (const b of followerBeams.current) {
        b.y += (targetY - b.y) * b.easing;
      }

      draw(ctx, width, height);
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
