import { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle, XCircle, Play, Pause, FastForward } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { getMdnUrl } from '../utils/mdnLinks';

export interface AnswerFeedback {
  correct: boolean;
  term: string;
  userAnswer: string | null;
  explanation: string;
}

const MdnLink = ({ term, className }: { term: string; className: string }) => (
  <a
    href={getMdnUrl(term)}
    target="_blank"
    rel="noopener noreferrer"
    className={`underline decoration-2 underline-offset-2 hover:opacity-80 ${className}`}
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
      onClick={onToggle}
      className="relative w-9 h-9 flex-shrink-0 cursor-pointer"
      aria-label={paused ? 'Resume timer' : 'Pause timer'}
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
        {paused ? <Play size={14} fill="currentColor" /> : <Pause size={14} />}
      </div>
    </button>
  );
};

interface SkipButtonProps {
  onSkip: () => void;
}

const SkipButton = ({ onSkip }: SkipButtonProps) => (
  <button
    onClick={onSkip}
    className="relative w-9 h-9 flex-shrink-0 rounded-full text-current hover:bg-black/5 transition-colors"
    aria-label="Skip feedback"
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <FastForward size={14} />
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
  const onCompleteRef = useRef(onCountdownComplete);
  onCompleteRef.current = onCountdownComplete;

  const completeFeedback = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = undefined;
    setProgress(1);
    setPaused(false);
    onCompleteRef.current?.();
  }, []);

  // Reset timer when lastAnswer changes
  useEffect(() => {
    if (lastAnswer && lastAnswer !== lastAnswerRef.current && durationMs) {
      lastAnswerRef.current = lastAnswer;
      setProgress(0);
      setPaused(false);
      elapsedRef.current = 0;
      completedRef.current = false;
      startTimeRef.current = performance.now();
      bannerRef.current?.focus();
    }
  }, [lastAnswer, durationMs]);

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

  if (!lastAnswer) return null;

  const timerActive = durationMs && !completedRef.current;
  const ringColor = lastAnswer.correct ? '#16a34a' : '#dc2626';

  return (
    <motion.div
      ref={bannerRef}
      tabIndex={-1}
      initial={{ x: 0 }}
      animate={{
        x: lastAnswer.correct ? 0 : [-10, 10, -10, 10, 0],
      }}
      transition={{
        duration: lastAnswer.correct ? 0 : 0.5,
        ease: 'easeInOut',
      }}
      className={clsx(
        'rounded-2xl p-4 mb-6 border-2 outline-none',
        lastAnswer.correct
          ? 'bg-green-50 text-green-700 border-green-500'
          : 'bg-red-50 text-red-700 border-red-500',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 font-bold text-lg">
            {lastAnswer.correct ? (
              <>
                <CheckCircle size={24} className="flex-shrink-0" />
                <span>
                  Correct! <MdnLink term={lastAnswer.term} className="text-green-800" />
                </span>
              </>
            ) : (
              <>
                <XCircle size={24} className="flex-shrink-0" />
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
              lastAnswer.correct ? 'text-green-800' : 'text-red-800',
            )}>
              {lastAnswer.explanation}
            </p>
          )}
        </div>
        {timerActive && (
          <div className="flex items-center gap-2">
            <CountdownButton
              progress={progress}
              paused={paused}
              onToggle={togglePause}
              color={ringColor}
            />
            <SkipButton onSkip={completeFeedback} />
          </div>
        )}
      </div>
    </motion.div>
  );
};
