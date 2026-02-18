import { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle, XCircle, HelpCircle, Play, Pause, FastForward, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { motion, useMotionValue, animate, useReducedMotion } from 'motion/react';
import { useDrag } from '@use-gesture/react';
import { getMdnUrl } from '../utils/mdnLinks';

// Swipe-to-dismiss configuration
const SWIPE_DEAD_ZONE = 20; // px of finger movement before the banner starts moving
const SWIPE_VELOCITY_THRESHOLD = 0.15; // px/ms — minimum release velocity to dismiss
const SWIPE_DISTANCE_THRESHOLD = 40; // px — minimum drag distance to dismiss

export interface AnswerFeedback {
  correct: boolean;
  skipped?: boolean;
  term: string;
  userAnswer: string | null;
  explanation: string;
}

const MdnLink = ({ term, className }: { term: string; className: string }) => (
  <a
    href={getMdnUrl(term)}
    target="_blank"
    rel="noopener noreferrer"
    className={`underline decoration-2 underline-offset-2 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-current rounded-sm touch-manipulation ${className}`}
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
      className="relative w-11 h-11 flex-shrink-0 cursor-pointer rounded-full hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-current touch-manipulation"
      aria-label={paused ? 'Resume Timer' : 'Pause Timer'}
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
    className="relative w-11 h-11 flex-shrink-0 rounded-full text-current hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-current touch-manipulation"
    aria-label="Skip Feedback"
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
  const rafRef = useRef<number>(undefined);
  const completedRef = useRef(false);
  const lastAnswerRef = useRef<AnswerFeedback | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [completed, setCompleted] = useState(false);
  const [processedAnswer, setProcessedAnswer] = useState<AnswerFeedback | null>(null);
  const onCompleteRef = useRef(onCountdownComplete);
  const prefersReducedMotion = useReducedMotion();

  // Swipe-to-dismiss: track horizontal position with a motion value
  const swipeX = useMotionValue(0);

  useEffect(() => {
    onCompleteRef.current = onCountdownComplete;
  }, [onCountdownComplete]);

  const completeFeedback = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setCompleted(true);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = undefined;
    setProgress(1);
    setPaused(false);
    onCompleteRef.current?.();
  }, []);

  // Reset state when lastAnswer changes (render-time pattern)
  if (lastAnswer && lastAnswer !== processedAnswer) {
    setProcessedAnswer(lastAnswer);
    setProgress(0);
    setPaused(false);
    setCompleted(false);
  }

  // Reset refs and focus when lastAnswer changes
  useEffect(() => {
    if (lastAnswer && lastAnswer !== lastAnswerRef.current) {
      lastAnswerRef.current = lastAnswer;
      elapsedRef.current = 0;
      completedRef.current = false;
      startTimeRef.current = performance.now();
      swipeX.set(0);
      bannerRef.current?.focus();
    }
  }, [lastAnswer, swipeX]);

  // Animation loop
  useEffect(() => {
    if (!lastAnswer || !durationMs || paused || completedRef.current) return;

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
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [lastAnswer, durationMs, paused, completeFeedback]);

  const togglePause = useCallback(() => {
    if (completedRef.current) return;
    if (paused) {
      setPaused(false);
    } else {
      elapsedRef.current += performance.now() - startTimeRef.current;
      setPaused(true);
    }
  }, [paused]);

  const bindSwipe = useDrag(
    ({ active, movement: [mx], velocity: [vx], direction: [dx] }) => {
      // Only allow rightward movement
      const clampedX = Math.max(0, mx);

      if (active) {
        swipeX.set(clampedX);
      } else {
        // On release, require both high velocity AND decent distance to dismiss
        if (vx > SWIPE_VELOCITY_THRESHOLD && clampedX > SWIPE_DISTANCE_THRESHOLD && dx > 0) {
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
      }
    },
    {
      axis: 'x',
      threshold: SWIPE_DEAD_ZONE,
      filterTaps: true,
    },
  );

  if (!lastAnswer) return null;

  const timerActive = durationMs && !completed;
  const ringColor = lastAnswer.correct ? '#16a34a' : lastAnswer.skipped ? '#64748b' : '#dc2626';
  const isIncorrect = !lastAnswer.correct && !lastAnswer.skipped;

  return (
    <div
      {...bindSwipe()}
      style={{ touchAction: 'pan-y' }}
      className="mb-6"
    >
      <motion.div style={{ x: swipeX }}>
        <motion.div
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
            'rounded-2xl p-4 border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            lastAnswer.skipped
              ? 'bg-slate-50 text-slate-700 border-slate-400 focus-visible:ring-slate-400 focus-visible:ring-offset-slate-50'
              : lastAnswer.correct
                ? 'bg-green-50 text-green-700 border-green-500 focus-visible:ring-green-500 focus-visible:ring-offset-green-50'
                : 'bg-red-50 text-red-700 border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-50',
          )}
        >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0 break-words">
            <div className="flex items-center gap-3 font-bold text-lg">
              {lastAnswer.skipped ? (
                <>
                  <HelpCircle size={24} className="flex-shrink-0" aria-hidden="true" />
                  <span>
                    The answer is <MdnLink term={lastAnswer.term} className="text-slate-800" />
                  </span>
                </>
              ) : lastAnswer.correct ? (
                <>
                  <CheckCircle size={24} className="flex-shrink-0" aria-hidden="true" />
                  <span>
                    Correct! <MdnLink term={lastAnswer.term} className="text-green-800" />
                  </span>
                </>
              ) : (
                <>
                  <XCircle size={24} className="flex-shrink-0" aria-hidden="true" />
                  <span>
                    Wrong! It was <MdnLink term={lastAnswer.term} className="text-red-800" />, not{' '}
                    {lastAnswer.userAnswer}
                  </span>
                </>
              )}
            </div>
            {lastAnswer.explanation && (
              <p className={clsx(
                'mt-2 ml-9 text-sm font-normal leading-relaxed',
                lastAnswer.skipped ? 'text-slate-800' : lastAnswer.correct ? 'text-green-800' : 'text-red-800',
              )}>
                {lastAnswer.explanation}
              </p>
            )}
          </div>
          {timerActive ? (
            <div className="flex items-center gap-2">
              <CountdownButton
                progress={progress}
                paused={paused}
                onToggle={togglePause}
                color={ringColor}
              />
              <SkipButton onSkip={completeFeedback} />
            </div>
          ) : !completed && (
            <button
              type="button"
              onClick={completeFeedback}
              className={clsx(
                'flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors touch-manipulation flex-shrink-0',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                lastAnswer.skipped
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus-visible:ring-slate-400'
                  : 'bg-red-200 text-red-800 hover:bg-red-300 focus-visible:ring-red-500',
              )}
              aria-label="Next Question"
            >
              Next <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
        </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
