import { forwardRef } from 'react';
import { useReducedMotion } from 'motion/react';

export interface GlowData {
  hlX: number;
  hlY: number;
  hlW: number;
  hlH: number;
  canvasW: number;
  canvasH: number;
}

interface GlowEffectProps extends GlowData {
  isDark: boolean;
  scrollLeftRef: React.RefObject<number>;
}

export const GlowEffect = forwardRef<HTMLDivElement, GlowEffectProps>(
  ({ hlX, hlY, hlW, hlH, isDark, scrollLeftRef }, ref) => {
    const prefersReducedMotion = useReducedMotion();
    if (prefersReducedMotion) return null;

    const scrollLeft = scrollLeftRef.current ?? 0;
    const cx = hlX + hlW / 2 - scrollLeft;
    const cy = hlY + hlH / 2;
    const rx = Math.max(hlW * 0.7, 120);
    const ry = 55 + hlH * 0.4;
    const color = isDark ? 'rgba(0, 255, 136, 0.35)' : 'rgba(34, 180, 85, 0.28)';

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(${rx}px ${ry}px at ${cx}px ${cy}px, ${color} 0%, transparent 100%)`,
          filter: 'blur(28px)',
          animation: prefersReducedMotion ? undefined : 'glow-shimmer 3s ease-in-out infinite',
        }}
      />
    );
  },
);
