import { ChevronRight, Flame, Home, Star, HelpCircle, RotateCcw } from 'lucide-react';
import { Link } from 'wouter';
import { m, AnimatePresence, useReducedMotion } from 'motion/react';
import { PageLayout } from '../components/PageLayout';
import { ConstructionCard } from '../components/ConstructionCard';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { HintButton } from '../components/HintButton';
import { SubtleButton } from '../components/SubtleButton';
import { ROUTES } from '../routes';
import { FEEDBACK_DELAY_MS } from '../constants';
import { useBuildQuiz } from '../hooks/useBuildQuiz';
import { formatNumber } from '../utils/format';

const STREAK_MILESTONES = new Set([5, 10, 15, 20, 25]);

export const BuildPage = () => {
  const {
    level,
    currentQuestion,
    currentQuestionIndex,
    totalLevelQuestions,
    answeredSoFar,
    score,
    streak,
    lastAnswer,
    isAnswering,
    hintsUsed,
    quizComplete,
    isRetryRound,
    retryQuestionCount,
    handleSubmit,
    handleSkip,
    handleUseHint,
    handleFeedbackComplete,
  } = useBuildQuiz();

  const prefersReducedMotion = useReducedMotion();

  if (!level || quizComplete || !currentQuestion) {
    return null;
  }

  const displayIndex = isRetryRound ? currentQuestionIndex : answeredSoFar + currentQuestionIndex;
  const displayTotal = isRetryRound ? retryQuestionCount : totalLevelQuestions;
  const progress = ((displayIndex + 1) / displayTotal) * 100;

  return (
    <PageLayout>
      <div>
        <h1 className="sr-only">Build the Syntax — {level.name}</h1>
        {isRetryRound && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2.5 border border-amber-300 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/5 rounded-lg text-amber-700 dark:text-amber-300 text-sm">
            <RotateCcw size={18} aria-hidden="true" />
            <span>Retry round — reviewing {retryQuestionCount} missed {retryQuestionCount === 1 ? 'question' : 'questions'}</span>
          </div>
        )}

        {/* Build mode header */}
        <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/50 p-3 sm:p-4 mb-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <Link
                  to={ROUTES.home}
                  className="flex items-center justify-center h-7 w-7 text-neutral-800 dark:text-neutral-100 hover:text-neutral-900 dark:hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                >
                  <Home size={14} aria-hidden="true" />
                  <span className="sr-only">Home</span>
                </Link>
                <ChevronRight size={12} className="text-neutral-400 dark:text-neutral-600" aria-hidden="true" />
                <span className="flex items-center h-7 text-xs px-1 text-neutral-600 dark:text-neutral-300 font-mono">
                  {level.name}
                </span>
              </div>
              <div className="flex items-center gap-1 h-7 text-xs px-2 text-orange-500 dark:text-orange-400 font-mono tabular-nums">
                <Flame size={12} aria-hidden="true" />
                <span
                  key={streak}
                  style={STREAK_MILESTONES.has(streak) && streak > 0 ? { animation: 'streak-pulse 0.6s ease-out' } : undefined}
                >
                  {formatNumber(streak)}
                </span>
              </div>
              <div className="flex items-center gap-1 h-7 text-xs px-2 text-blue-500 dark:text-blue-400 font-mono tabular-nums">
                <Star size={12} aria-hidden="true" />
                <span
                  key={score}
                  style={score > 0 ? { animation: 'score-pop 0.3s ease-out' } : undefined}
                >
                  {formatNumber(score)}
                </span>
              </div>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
              {formatNumber(displayIndex + 1)}/{formatNumber(displayTotal)}
            </div>
          </div>
          <div
            className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1 overflow-hidden"
            role="progressbar"
            aria-label="Quiz progress"
            aria-valuenow={displayIndex + 1}
            aria-valuemin={1}
            aria-valuemax={displayTotal}
          >
            <div
              className="h-full bg-neutral-800 dark:bg-neutral-100 rounded-full transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <AnimatePresence>
          {lastAnswer && isAnswering && (
            <m.div
              style={{ clipPath: 'inset(0 -100vw 0 -100vw)' }}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0, marginBottom: 0 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0, 0, 0.2, 1] }}
            >
              <FeedbackBanner
                key={`${isRetryRound ? 'retry' : 'main'}-${currentQuestion.originalIndex}-${currentQuestionIndex}`}
                lastAnswer={lastAnswer}
                durationMs={lastAnswer?.correct ? FEEDBACK_DELAY_MS : undefined}
                onCountdownComplete={handleFeedbackComplete}
              />
            </m.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <m.div
            key={currentQuestionIndex}
            data-testid="question-panel"
            initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0, 0, 0.2, 1] }}
          >
            <ConstructionCard
              question={currentQuestion}
              onSubmit={handleSubmit}
              disabled={isAnswering}
            />

            <HintButton
              hint={currentQuestion.hint}
              hintsUsed={hintsUsed}
              onUseHint={handleUseHint}
              disabled={isAnswering}
              eliminateLabel="Remove distractors (−50% points)"
            />

            <div className="mt-4 text-center">
              <SubtleButton
                onClick={handleSkip}
                disabled={isAnswering}
              >
                <HelpCircle size={16} aria-hidden="true" />
                I don't know — show me the answer
              </SubtleButton>
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};
