import { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle, XCircle, HelpCircle, Play, Pause, FastForward, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { m, useMotionValue, animate, useReducedMotion } from 'motion/react';
import type { PanInfo } from 'motion/react';
import type { AnswerFeedback } from '../hooks/types';
import { useTheme } from '../context/useTheme';
// Swipe-to-dismiss configuration
const SWIPE_DISTANCE_THRESHOLD = 40; // px — minimum drag distance to dismiss

const ExplanationWithCode = ({ text }: { text: string }) => {
  const parts = text.split(/`([^`]+)`/);
  return <>{parts.map((part, i) => i % 2 === 1 ? <code key={part}>{part}</code> : part)}</>;
};

const getSearchUrl = (term: string): string => {
  const query = `${term} site:developer.mozilla.org OR site:typescriptlang.org/docs OR site:react.dev OR site:javascript.info`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
};

const DocsLink = ({ term, href, className }: { term: string; href?: string; className: string }) => (
  <a
    href={href ?? getSearchUrl(term)}
    target="_blank"
    rel="noopener noreferrer"
    className={`underline decoration-1 underline-offset-2 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] focus-visible:ring-current rounded-sm touch-manipulation ${className}`}
  >
    {term}
  </a>
);

const CountdownButton = ({
  progress,
  paused,
  onToggle,
  color,
}: {
  progress: number;
  paused: boolean;
  onToggle: () => void;
  color: string;
}) => {
  const degrees = progress * 360;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative w-9 h-9 shrink-0 cursor-pointer rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] focus-visible:ring-current touch-manipulation"
      aria-label={paused ? `Resume timer (${Math.ceil((1 - progress) * 100)}% remaining)` : `Pause timer (${Math.ceil((1 - progress) * 100)}% remaining)`}
      aria-pressed={paused}
    >
      <div
        className="absolute inset-0 rounded-full transition-opacity duration-200"
        style={{
          background: `conic-gradient(from -90deg, ${color} 0deg, ${color} ${degrees}deg, transparent ${degrees}deg)`,
          maskImage: 'radial-gradient(circle, transparent 55%, black 57%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 55%, black 57%)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {paused ? <Play size={14} fill="currentColor" aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      </div>
    </button>
  );
};

interface SkipButtonProps {
  onSkip: () => void;
}

const SkipButton = ({ onSkip }: SkipButtonProps) => (
  <button
    type="button"
    onClick={onSkip}
    className="relative w-9 h-9 shrink-0 rounded-md text-current hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] focus-visible:ring-current touch-manipulation"
    aria-label="Skip to next question"
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <FastForward size={14} aria-hidden="true" />
    </div>
  </button>
);

interface FeedbackBannerProps {
  lastAnswer: AnswerFeedback | null;
  durationMs?: number;
  onCountdownComplete?: () => void;
}

export const FeedbackBanner = ({ lastAnswer, durationMs, onCountdownComplete }: FeedbackBannerProps) => {
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const startTimeRef = useRef(0);
  const elapsedRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);
  const completedRef = useRef(false);
  const [completed, setCompleted] = useState(false);
  const onCompleteRef = useRef(onCountdownComplete);
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();

  // Swipe-to-dismiss: track horizontal position with a motion value
  const swipeX = useMotionValue(0);

  const bannerRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      el.focus({ preventScroll: true });
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    onCompleteRef.current = onCountdownComplete;
  }, [onCountdownComplete]);

  const completeFeedback = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setCompleted(true);
    if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    rafRef.current = undefined;
    setProgress(1);
    setPaused(false);
    onCompleteRef.current?.();
  }, []);

  // Animation loop
  useEffect(() => {
    if (!durationMs || paused || completedRef.current) return;

    startTimeRef.current = performance.now();

    const tick = () => {
      const now = performance.now();
      const totalElapsed = elapsedRef.current + (now - startTimeRef.current);
      const p = Math.min(totalElapsed / durationMs, 1);
      setProgress(p);

      if (p >= 1) {
        completeFeedback();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [durationMs, paused, completeFeedback]);

  const togglePause = useCallback(() => {
    if (completedRef.current) return;
    if (paused) {
      setPaused(false);
    } else {
      elapsedRef.current += performance.now() - startTimeRef.current;
      setPaused(true);
    }
  }, [paused]);

  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.velocity.x > 0 && info.offset.x > SWIPE_DISTANCE_THRESHOLD) {
      // Dismiss: animate off-screen
      animate(swipeX, window.innerWidth, {
        type: 'tween',
        duration: prefersReducedMotion ? 0 : 0.2,
        ease: 'easeOut',
      }).then(() => completeFeedback());
    } else {
      // Snap back
      animate(swipeX, 0, {
        type: 'spring',
        stiffness: 500,
        damping: 30,
        duration: prefersReducedMotion ? 0 : undefined,
      });
    }
  }, [swipeX, completeFeedback, prefersReducedMotion]);

  if (!lastAnswer) return null;

  const timerActive = durationMs && !completed;
  const isDark = resolvedTheme === 'dark';
  const ringColor = lastAnswer.correct
    ? (isDark ? '#34d399' : '#059669')
    : lastAnswer.skipped
      ? '#737373'
      : (isDark ? '#f87171' : '#dc2626');
  const isIncorrect = !lastAnswer.correct && !lastAnswer.skipped;

  return (
    <m.div
      drag="x"
      style={{ x: swipeX, touchAction: 'pan-y' }}
      className="feedback-banner"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0, right: 0.5 }}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
    >
        <m.div
          ref={bannerRef}
          tabIndex={-1}
          data-testid="feedback-banner"
          initial={{ x: 0 }}
          animate={{
            x: isIncorrect && !prefersReducedMotion ? [-10, 10, -10, 10, 0] : 0,
          }}
          transition={{
            duration: isIncorrect && !prefersReducedMotion ? 0.5 : 0,
            ease: 'easeInOut',
          }}
          role={isIncorrect ? 'alert' : 'status'}
          aria-live={isIncorrect ? 'assertive' : 'polite'}
          aria-atomic="true"
          className={clsx(
            'rounded-lg p-3 sm:p-4 border scroll-mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
            lastAnswer.skipped
              ? 'bg-neutral-100 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 focus-visible:ring-neutral-500'
              : lastAnswer.correct
                ? 'bg-emerald-50 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20 focus-visible:ring-emerald-500'
                : 'bg-red-50 dark:bg-red-500/5 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/20 focus-visible:ring-red-500',
          )}
        >
        <div>
          <div className="flex items-center gap-2 font-medium text-xl tracking-tight">
            {lastAnswer.skipped ? (
              <>
                <HelpCircle size={16} className="shrink-0" aria-hidden="true" />
                <span>
                  Skipped — the answer is <DocsLink term={lastAnswer.term} href={lastAnswer.docsLink} className="text-neutral-900 dark:text-neutral-100" />
                </span>
              </>
            ) : lastAnswer.correct ? (
              <>
                <CheckCircle size={16} className="shrink-0" aria-hidden="true" />
                <span>
                  Correct! <DocsLink term={lastAnswer.term} href={lastAnswer.docsLink} className="text-emerald-800 dark:text-emerald-200" />
                </span>
              </>
            ) : (
              <>
                <XCircle size={16} className="shrink-0" aria-hidden="true" />
                <span>
                  Wrong — it was <DocsLink term={lastAnswer.term} href={lastAnswer.docsLink} className="text-red-800 dark:text-red-200" />, not{' '}
                  {lastAnswer.userAnswer}
                </span>
              </>
            )}
          </div>
          {lastAnswer.explanation && (
            <p className={clsx(
              'mt-2 ml-7 text-base leading-7',
              lastAnswer.skipped
                ? 'text-neutral-600 dark:text-neutral-400'
                : lastAnswer.correct
                  ? 'text-emerald-700/80 dark:text-emerald-300/80'
                  : 'text-red-700/80 dark:text-red-300/80',
            )}>
              <ExplanationWithCode text={lastAnswer.explanation} />
            </p>
          )}
          {timerActive ? (
            <div className="flex items-center justify-end gap-2 mt-3">
              <CountdownButton
                progress={progress}
                paused={paused}
                onToggle={togglePause}
                color={ringColor}
              />
              <SkipButton onSkip={completeFeedback} />
            </div>
          ) : !completed && (
            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={completeFeedback}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors touch-manipulation cursor-pointer',
                  'bg-neutral-200 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
                  lastAnswer.skipped ? 'focus-visible:ring-neutral-500' : 'focus-visible:ring-red-500',
                )}
                aria-label="Next question"
              >
                Next <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
        </m.div>
    </m.div>
  );
};
