import { useState, useEffect } from 'react';
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

  useEffect(() => {
    return () => {
      document.body.style.userSelect = '';
    };
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
        <div className="max-w-4xl mx-auto">
          <h1 className="sr-only">Syntax Quiz — {level.name}</h1>
          {isRetryRound && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2.5 border border-amber-500/20 bg-amber-500/5 rounded-lg text-amber-300 text-sm">
              <RotateCcw size={18} aria-hidden="true" />
              <span>Retry Round — reviewing {retryQuestionCount} missed {retryQuestionCount === 1 ? 'question' : 'questions'}</span>
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
                initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
                animate={{ opacity: 1 }}
                exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.21, ease: [0, 0, 0.2, 1] }}
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
              initial={{ x: prefersReducedMotion ? 0 : 30, opacity: prefersReducedMotion ? 1 : 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={prefersReducedMotion ? { x: 0, opacity: 1 } : { x: -30, opacity: 0, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
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
                <button
                  type="button"
                  data-testid="skip-question"
                  onClick={handleSkip}
                  disabled={isAnswering}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] touch-manipulation"
                >
                  <HelpCircle size={16} aria-hidden="true" />
                  I don't know — show me the answer
                </button>
              </div>

              <div className="mt-4 text-center">
                <a
                  href={`https://github.com/philwolstenholme/syntax-quiz/issues/new?template=incorrect-question.yml&title=${encodeURIComponent(`Incorrect or misleading question: ${currentQuestion.question}`)}&question_name=${encodeURIComponent(currentQuestion.question)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] rounded-md px-1 py-0.5 touch-manipulation"
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
          <div className="flex items-center gap-2 p-3 rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-200 font-medium text-sm shadow-2xl cursor-move">
            <GripVertical className="text-neutral-500 shrink-0" size={16} aria-hidden="true" />
            <span className="flex-1 text-left">{activeId}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
