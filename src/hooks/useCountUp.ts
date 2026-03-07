import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Animates a number from 0 to the target value over a duration.
 * Respects prefers-reduced-motion by skipping the animation.
 */
export function useCountUp(target: number, durationMs = 800): number {
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (prefersReducedMotion || target === 0) {
      setValue(target);
      return;
    }

    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / durationMs, 1);
      // ease-out-quart for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, prefersReducedMotion]);

  return value;
}
