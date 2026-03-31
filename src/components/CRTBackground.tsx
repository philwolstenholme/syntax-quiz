import { useEffect, useRef, useCallback } from 'react';
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

// Primary beam
const BEAM_SPEED = 0.35;
const BEAM_WIDTH = 140;
const AFTERGLOW_WIDTH = 100;

// Secondary beam (fainter, faster)
const BEAM2_SPEED = 0.6;
const BEAM2_WIDTH = 80;
const BEAM2_STRENGTH = 0.35;

// Characters
const CHAR_DENSITY = 0.035;
const CHAR_LIFETIME_MIN = 45;
const CHAR_LIFETIME_MAX = 75;

// Noise & glitch
const NOISE_DENSITY = 0.002; // fraction of pixels that get noise per frame
const GLITCH_CHANCE = 0.003; // chance per frame of a glitch line

interface FloatingChar {
  x: number;
  y: number;
  char: string;
  life: number;
  maxLife: number;
  drift: number; // slight horizontal drift
}

interface GlitchLine {
  y: number;
  offset: number;
  width: number;
  life: number;
}

// Deterministic per-dot variation so it's stable across frames
function dotHash(x: number, y: number): number {
  let h = (x * 374761 + y * 668265) | 0;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  return ((h >> 16) ^ h) & 0xff;
}

export const CRTBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const animRef = useRef<number>(0);
  const frameRef = useRef(0);
  const beam1Y = useRef(0);
  const beam2Y = useRef(-300); // offset start
  const chars = useRef<FloatingChar[]>([]);
  const glitches = useRef<GlitchLine[]>([]);
  const dprRef = useRef(1);
  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const dpr = dprRef.current;
    const frame = frameRef.current;
    ctx.clearRect(0, 0, width * dpr, height * dpr);

    const baseAlpha = isDark ? 0.08 : 0.05;
    const beamColor = isDark ? [0, 255, 136] : [0, 190, 110];
    const dotColor = isDark ? [255, 255, 255] : [0, 0, 0];
    const charColor = isDark ? [0, 255, 136] : [0, 160, 90];

    // Subtle global flicker (CRT power fluctuation)
    const flicker = 1 - Math.random() * 0.03;

    const b1y = beam1Y.current;
    const b2y = beam2Y.current;

    // Draw dot grid with per-dot variation
    for (let x = DOT_SPACING; x < width; x += DOT_SPACING) {
      for (let y = DOT_SPACING; y < height; y += DOT_SPACING) {
        const hash = dotHash(x, y);
        const brightnessVar = 0.6 + (hash / 255) * 0.8; // 0.6–1.4 per dot
        const sizeVar = 0.8 + ((hash >> 4) / 15) * 0.4; // 0.8–1.2

        // Primary beam influence
        const dist1 = Math.abs(y - b1y);
        const beam1 = Math.max(0, 1 - dist1 / BEAM_WIDTH);
        const glow1 = beam1 * beam1;

        // Secondary beam influence
        const dist2 = Math.abs(y - b2y);
        const beam2 = Math.max(0, 1 - dist2 / BEAM2_WIDTH) * BEAM2_STRENGTH;
        const glow2 = beam2 * beam2;

        // Afterglow (exponential decay behind primary beam)
        const behind1 = b1y - y;
        const afterglow = behind1 > 0 && behind1 < AFTERGLOW_WIDTH
          ? Math.pow(1 - behind1 / AFTERGLOW_WIDTH, 2) * 0.35
          : 0;

        const totalGlow = Math.min(Math.max(glow1, glow2, afterglow), 1);
        const alpha = (baseAlpha + totalGlow * (isDark ? 0.75 : 0.45)) * brightnessVar * flicker;
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

        // Spawn characters near primary beam center
        if (glow1 > 0.6 && Math.random() < CHAR_DENSITY) {
          const char = Math.random() < 0.4
            ? KEYWORDS[(Math.random() * KEYWORDS.length) | 0]
            : SYMBOLS[(Math.random() * SYMBOLS.length) | 0];
          const lifetime = CHAR_LIFETIME_MIN + ((Math.random() * (CHAR_LIFETIME_MAX - CHAR_LIFETIME_MIN)) | 0);
          chars.current.push({
            x, y,
            char,
            life: lifetime,
            maxLife: lifetime,
            drift: (Math.random() - 0.5) * 0.3, // subtle horizontal drift
          });
        }
      }
    }

    // Draw floating characters with drift and chromatic fringe
    const fontSize = 10 * dpr;
    ctx.font = `${fontSize}px "Geist Mono", ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    chars.current = chars.current.filter(c => {
      c.life--;
      if (c.life <= 0) return false;

      c.x += c.drift;

      const progress = c.life / c.maxLife;
      const alpha = progress > 0.85
        ? (1 - progress) / 0.15
        : progress / 0.85;

      const charAlpha = alpha * (isDark ? 0.55 : 0.35) * flicker;

      // Chromatic fringe on characters — offset red and blue channels
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

    // Beam glow bands
    const drawBeamGlow = (by: number, strength: number) => {
      const glowHeight = 80 * strength;
      const beamAlpha = (isDark ? 0.07 : 0.04) * strength * flicker;
      const gradient = ctx.createLinearGradient(0, (by - glowHeight) * dpr, 0, (by + glowHeight) * dpr);
      gradient.addColorStop(0, `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},0)`);
      gradient.addColorStop(0.3, `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},${beamAlpha * 0.5})`);
      gradient.addColorStop(0.5, `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},${beamAlpha})`);
      gradient.addColorStop(0.7, `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},${beamAlpha * 0.3})`);
      gradient.addColorStop(1, `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, (by - glowHeight) * dpr, width * dpr, glowHeight * 2 * dpr);
    };

    drawBeamGlow(b1y, 1);
    drawBeamGlow(b2y, BEAM2_STRENGTH);

    // Static noise — scattered random pixels
    const noiseCount = (width * height * NOISE_DENSITY) | 0;
    for (let i = 0; i < noiseCount; i++) {
      const nx = Math.random() * width;
      const ny = Math.random() * height;
      const nAlpha = Math.random() * (isDark ? 0.15 : 0.08) * flicker;
      // Mostly green-tinted noise for CRT feel
      if (Math.random() < 0.6) {
        ctx.fillStyle = `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},${nAlpha})`;
      } else {
        ctx.fillStyle = `rgba(${dotColor[0]},${dotColor[1]},${dotColor[2]},${nAlpha * 0.5})`;
      }
      const nSize = (0.5 + Math.random() * 1.5) * dpr;
      ctx.fillRect(nx * dpr, ny * dpr, nSize, nSize);
    }

    // Glitch lines — occasional horizontal displacement bands
    if (Math.random() < GLITCH_CHANCE) {
      const gy = Math.random() * height;
      glitches.current.push({
        y: gy,
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
      // Draw a thin displaced band
      const sy = g.y * dpr;
      const sh = g.width * dpr;
      const sourceData = ctx.getImageData(0, sy | 0, (width * dpr) | 0, sh | 0);
      ctx.fillStyle = `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},${glitchAlpha})`;
      ctx.fillRect(0, sy, width * dpr, sh);
      ctx.putImageData(sourceData, (g.offset * dpr) | 0, sy | 0);
      ctx.restore();

      return true;
    });

    // Phosphor bloom — soft glow overlay near bright areas using composite
    // Skip on very large canvases to avoid perf issues on low-end devices
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
      beam1Y.current = -999;
      beam2Y.current = -999;
      draw(ctx, canvas.width / dprRef.current, canvas.height / dprRef.current);
      return () => window.removeEventListener('resize', resize);
    }

    const animate = () => {
      const height = canvas.height / dprRef.current;
      const width = canvas.width / dprRef.current;
      frameRef.current++;

      beam1Y.current += BEAM_SPEED;
      if (beam1Y.current > height + BEAM_WIDTH) {
        beam1Y.current = -BEAM_WIDTH;
      }

      beam2Y.current += BEAM2_SPEED;
      if (beam2Y.current > height + BEAM2_WIDTH) {
        beam2Y.current = -BEAM2_WIDTH;
      }

      draw(ctx, width, height);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [prefersReducedMotion, draw]);

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
      {/* Vignette — heavier at corners for CRT curvature feel */}
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
