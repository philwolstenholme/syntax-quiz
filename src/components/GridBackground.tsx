import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

interface GridBackgroundProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const GridBackground = ({ containerRef }: GridBackgroundProps) => {
  const glowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const glow = glowRef.current;
    const container = containerRef.current;
    if (!glow || !container) return;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      glow.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
      glow.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [prefersReducedMotion, containerRef]);

  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div className="grid-bg-dots absolute inset-0" />
      {!prefersReducedMotion && (
        <div ref={glowRef} className="grid-bg-glow absolute inset-0" />
      )}
    </div>
  );
};
