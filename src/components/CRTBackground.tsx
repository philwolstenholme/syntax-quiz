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

const DOT_SPACING = 24;
const DOT_RADIUS = 1;
const BEAM_SPEED = 0.35;
const BEAM_WIDTH = 140;
const AFTERGLOW_WIDTH = 80; // trail behind beam
const CHAR_DENSITY = 0.04;
const CHAR_LIFETIME = 50;

interface FloatingChar {
  x: number;
  y: number;
  char: string;
  life: number;
  maxLife: number;
}

export const CRTBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const animRef = useRef<number>(0);
  const beamY = useRef(0);
  const chars = useRef<FloatingChar[]>([]);
  const dprRef = useRef(1);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const dpr = dprRef.current;
    ctx.clearRect(0, 0, width * dpr, height * dpr);

    const baseAlpha = isDark ? 0.1 : 0.06;
    const beamColor = isDark ? [0, 255, 136] : [0, 190, 110];
    const dotColor = isDark ? [255, 255, 255] : [0, 0, 0];
    const charColor = isDark ? [0, 255, 136] : [0, 160, 90];

    const by = beamY.current;

    // Draw dot grid
    for (let x = DOT_SPACING; x < width; x += DOT_SPACING) {
      for (let y = DOT_SPACING; y < height; y += DOT_SPACING) {
        const distFromBeam = Math.abs(y - by);
        const distBehindBeam = by - y; // positive = behind beam (above)
        const beamInfluence = Math.max(0, 1 - distFromBeam / BEAM_WIDTH);
        const glow = beamInfluence * beamInfluence;

        // Afterglow: dots behind the beam stay faintly lit
        const afterglow = distBehindBeam > 0 && distBehindBeam < AFTERGLOW_WIDTH
          ? (1 - distBehindBeam / AFTERGLOW_WIDTH) * 0.3
          : 0;

        const totalGlow = Math.max(glow, afterglow);
        const alpha = baseAlpha + totalGlow * (isDark ? 0.7 : 0.4);
        const r = DOT_RADIUS + totalGlow * 1.8;

        if (totalGlow > 0.05) {
          const blend = Math.min(totalGlow * 1.5, 1);
          const cr = dotColor[0] + (beamColor[0] - dotColor[0]) * blend;
          const cg = dotColor[1] + (beamColor[1] - dotColor[1]) * blend;
          const cb = dotColor[2] + (beamColor[2] - dotColor[2]) * blend;
          ctx.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${alpha})`;
        } else {
          ctx.fillStyle = `rgba(${dotColor[0]},${dotColor[1]},${dotColor[2]},${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(x * dpr, y * dpr, r * dpr, 0, Math.PI * 2);
        ctx.fill();

        // Spawn characters near beam center
        if (glow > 0.6 && Math.random() < CHAR_DENSITY) {
          // 40% chance of a keyword, 60% symbol
          const char = Math.random() < 0.4
            ? KEYWORDS[(Math.random() * KEYWORDS.length) | 0]
            : SYMBOLS[(Math.random() * SYMBOLS.length) | 0];
          chars.current.push({
            x, y,
            char,
            life: CHAR_LIFETIME + ((Math.random() * 20) | 0),
            maxLife: CHAR_LIFETIME + 20,
          });
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

      const progress = c.life / c.maxLife;
      // Quick fade in, slow fade out
      const alpha = progress > 0.85
        ? (1 - progress) / 0.15
        : progress / 0.85;

      ctx.fillStyle = `rgba(${charColor[0]},${charColor[1]},${charColor[2]},${alpha * (isDark ? 0.55 : 0.35)})`;
      ctx.fillText(c.char, c.x * dpr, c.y * dpr);
      return true;
    });

    // Beam glow — wider, softer horizontal band
    const glowHeight = 80;
    const gradient = ctx.createLinearGradient(0, (by - glowHeight) * dpr, 0, (by + glowHeight) * dpr);
    const beamAlpha = isDark ? 0.06 : 0.04;
    gradient.addColorStop(0, `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},0)`);
    gradient.addColorStop(0.3, `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},${beamAlpha * 0.5})`);
    gradient.addColorStop(0.5, `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},${beamAlpha})`);
    gradient.addColorStop(0.7, `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},${beamAlpha * 0.3})`);
    gradient.addColorStop(1, `rgba(${beamColor[0]},${beamColor[1]},${beamColor[2]},0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, (by - glowHeight) * dpr, width * dpr, glowHeight * 2 * dpr);
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
      beamY.current = -999;
      draw(ctx, canvas.width / dprRef.current, canvas.height / dprRef.current);
      return () => window.removeEventListener('resize', resize);
    }

    const animate = () => {
      const height = canvas.height / dprRef.current;
      const width = canvas.width / dprRef.current;

      beamY.current += BEAM_SPEED;
      if (beamY.current > height + BEAM_WIDTH) {
        beamY.current = -BEAM_WIDTH;
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
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, var(--bg) 100%)',
        }}
      />
    </div>
  );
};
