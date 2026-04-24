import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Animates a number from 0 to the target value over a duration.
 * Respects prefers-reduced-motion by skipping the animation.
 */
export function useCountUp(target: number, durationMs = 800): number {
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (prefersReducedMotion || target === 0) return;

    const start = performance.now();

    let prev = 0;

    const tick = () => {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / durationMs, 1);
      // ease-out-quart for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 4);
      const rounded = Math.round(eased * target);
      if (rounded !== prev) {
        prev = rounded;
        setValue(rounded);
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, prefersReducedMotion]);

  // Skip animation when reduced motion is preferred or target is zero
  if (prefersReducedMotion || target === 0) return target;

  return value;
}
