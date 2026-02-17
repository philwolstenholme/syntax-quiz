import { useState, useRef, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { PageLayout } from '../components/PageLayout';
import { QuizHeader } from '../components/QuizHeader';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { QuestionCard } from '../components/QuestionCard';
import { AnswerOptions } from '../components/AnswerOptions';
import { HintButton } from '../components/HintButton';
import { SaveButton } from '../components/SaveButton';
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
    handleAnswer,
    handleUseHint,
    handleFeedbackComplete,
    handleSave,
  } = useQuiz();

  const [activeId, setActiveId] = useState<string | null>(null);

  // Question slide transition state
  const [displayedIndex, setDisplayedIndex] = useState(currentQuestionIndex);
  const [showQuestion, setShowQuestion] = useState(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (currentQuestionIndex !== displayedIndex) {
      setShowQuestion(false);
    }
  }, [currentQuestionIndex, displayedIndex]);

  const handleQuestionLeave = () => {
    setDisplayedIndex(currentQuestionIndex);
    setShowQuestion(true);
  };

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 100, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  if (!level || quizComplete || !currentQuestion) {
    return null;
  }

  const handleDragStart = (event: DragStartEvent): void => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    setActiveId(null);
    if (isAnswering) return;

    const { active, over } = event;
    if (over && over.id === 'dropzone' && active.data.current?.answer) {
      handleAnswer(active.data.current.answer);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <PageLayout>
        <div className="max-w-4xl mx-auto">
          <QuizHeader
            score={score}
            streak={streak}
            currentQuestionIndex={answeredSoFar + currentQuestionIndex}
            totalQuestions={totalLevelQuestions}
            level={level}
          />

          <Transition
            as="div"
            show={!!lastAnswer && isAnswering}
            enter="transition duration-210 ease-[cubic-bezier(0,0,0.2,1)]"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition duration-180 ease-[cubic-bezier(0.4,0,1,1)]"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <FeedbackBanner
              lastAnswer={lastAnswer}
              durationMs={FEEDBACK_DELAY_MS}
              onCountdownComplete={handleFeedbackComplete}
            />
          </Transition>

          <Transition
            show={showQuestion}
            appear
            enter="transition duration-250 ease-[cubic-bezier(0,0,0.2,1)]"
            enterFrom="opacity-0 translate-x-[30px]"
            enterTo="opacity-100 translate-x-0"
            leave="transition duration-180 ease-[cubic-bezier(0.4,0,1,1)]"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 -translate-x-[30px]"
            afterLeave={handleQuestionLeave}
          >
            <div>
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

              <div className="mt-8 text-center">
                <a
                  href={`https://github.com/philwolstenholme/syntax-quiz/issues/new?title=${encodeURIComponent(currentQuestion.question)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-indigo-500 transition-colors"
                >
                  Report an issue with this question
                </a>
              </div>
            </div>
          </Transition>

          <SaveButton
            onSave={handleSave}
            disabled={isAnswering}
            questionIndex={currentQuestionIndex}
          />
        </div>
      </PageLayout>
      <DragOverlay>
        {activeId ? (
          <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-indigo-500 bg-white text-gray-800 font-semibold text-lg shadow-xl cursor-move">
            <GripVertical className="text-gray-400 flex-shrink-0" size={20} />
            <span className="flex-1 text-left">{activeId}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
