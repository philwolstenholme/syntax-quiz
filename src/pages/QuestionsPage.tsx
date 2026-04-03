import { useState, useEffect, useCallback, useRef } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { GripVertical, HelpCircle, RotateCcw } from 'lucide-react';
import { SubtleButton } from '../components/SubtleButton';
import { PageLayout } from '../components/PageLayout';
import { QuizHeader } from '../components/QuizHeader';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { QuestionCard } from '../components/QuestionCard';
import { AnswerOptions } from '../components/AnswerOptions';
import { HintButton } from '../components/HintButton';
import { FEEDBACK_DELAY_MS } from '../constants';
import { useQuiz } from '../hooks/useQuiz';

export const QuestionsPage = () => {
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
    eliminatedOptions,
    quizComplete,
    isRetryRound,
    retryQuestionCount,
    handleAnswer,
    handleSkip,
    handleUseHint,
    handleFeedbackComplete,
    handleSave,
  } = useQuiz();

  const prefersReducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 100, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  // Keyboard shortcuts: 1-4 to pick an answer, or press the visible option number
  const handleKeyboardAnswerRef = useRef<(e: KeyboardEvent) => void>(() => {});

  const handleKeyboardAnswer = useCallback((e: KeyboardEvent) => {
    if (isAnswering || !currentQuestion) return;
    const key = e.key;
    if (key >= '1' && key <= '4') {
      const index = parseInt(key, 10) - 1;
      const visibleOptions = currentQuestion.options.filter(
        (opt) => !eliminatedOptions.includes(opt),
      );
      const selected = visibleOptions[index];
      if (selected) {
        handleAnswer(selected);
      }
    }
  }, [isAnswering, currentQuestion, eliminatedOptions, handleAnswer]);

  useEffect(() => {
    handleKeyboardAnswerRef.current = handleKeyboardAnswer;
  }, [handleKeyboardAnswer]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKeyboardAnswerRef.current(e);
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);

  const handleDragStart = (event: DragStartEvent): void => {
    setActiveId(event.active.id as string);
    document.body.style.userSelect = 'none';
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    setActiveId(null);
    document.body.style.userSelect = '';
    if (isAnswering) return;

    const { active, over } = event;
    if (over && over.id === 'dropzone' && active.data.current?.answer) {
      handleAnswer(active.data.current.answer);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    document.body.style.userSelect = '';
  };

  if (!level || quizComplete || !currentQuestion) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <PageLayout>
        <div>
          <h1 className="sr-only">Syntax Quiz — {level.name}</h1>
          {isRetryRound && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2.5 border border-amber-300 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/5 rounded-lg text-amber-700 dark:text-amber-300 text-sm">
              <RotateCcw size={18} aria-hidden="true" />
              <span>Retry round — reviewing {retryQuestionCount} missed {retryQuestionCount === 1 ? 'question' : 'questions'}</span>
            </div>
          )}
          <QuizHeader
            score={score}
            streak={streak}
            currentQuestionIndex={isRetryRound ? currentQuestionIndex : answeredSoFar + currentQuestionIndex}
            totalQuestions={isRetryRound ? retryQuestionCount : totalLevelQuestions}
            level={level}
            onSave={handleSave}
            isAnswering={isAnswering}
          />

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
              data-question-index={currentQuestion.originalIndex}
              initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0, 0, 0.2, 1] }}
            >
              <QuestionCard question={currentQuestion} />

              <HintButton
                hint={currentQuestion.hint}
                hintsUsed={hintsUsed}
                onUseHint={handleUseHint}
                disabled={isAnswering}
              />

              <AnswerOptions
                options={currentQuestion.options}
                onAnswer={handleAnswer}
                disabled={isAnswering}
                eliminatedOptions={eliminatedOptions}
              />

              <div className="mt-4 text-center">
                <SubtleButton
                  data-testid="skip-question"
                  onClick={handleSkip}
                  disabled={isAnswering}
                >
                  <HelpCircle size={16} aria-hidden="true" />
                  I don't know — show me the answer
                </SubtleButton>
              </div>

              <div className="mt-4 text-center">
                <a
                  href={`https://github.com/philwolstenholme/syntax-quiz/issues/new?template=incorrect-question.yml&title=${encodeURIComponent(`Incorrect or misleading question: ${currentQuestion.question}`)}&question_name=${encodeURIComponent(currentQuestion.question)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] rounded-md px-1 py-0.5 touch-manipulation"
                >
                  Report an issue with this question
                </a>
              </div>
            </m.div>
          </AnimatePresence>

        </div>
      </PageLayout>
      <DragOverlay>
        {activeId ? (
          <m.div
            initial={prefersReducedMotion ? {} : { rotate: 0, scale: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
            animate={prefersReducedMotion ? {} : { rotate: -2, scale: 1.04, boxShadow: '0 20px 60px rgba(0,0,0,0.22), 0 8px 20px rgba(0,0,0,0.12)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 22, mass: 0.5 }}
            className="flex items-center gap-3 p-3 rounded-lg border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium text-base cursor-move"
          >
            <GripVertical className="text-neutral-400 dark:text-neutral-500 shrink-0" size={16} aria-hidden="true" />
            <span className="flex-1 text-left">{activeId}</span>
          </m.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
