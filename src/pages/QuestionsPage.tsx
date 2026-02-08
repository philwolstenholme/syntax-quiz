import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'wouter';
import { shuffle } from 'es-toolkit';
import { motion, AnimatePresence } from 'motion/react';
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
import { playCorrectSound, playIncorrectSound } from '../utils/sounds';
import { vibrateCorrect, vibrateIncorrect } from '../utils/vibrate';
import { PageLayout } from '../components/PageLayout';
import { QuizHeader } from '../components/QuizHeader';
import { FeedbackBanner } from '../components/FeedbackBanner';
import type { AnswerFeedback } from '../components/FeedbackBanner';
import { QuestionCard } from '../components/QuestionCard';
import { AnswerOptions } from '../components/AnswerOptions';
import { HintButton } from '../components/HintButton';
import { levels } from '../data/questions';
import type { Question } from '../data/questions';

const BASE_SCORE_POINTS = 10;
const FEEDBACK_DELAY_MS = 4000;
const HINT_SCORE_PENALTY = 0.5;

export const QuestionsPage = () => {
  const params = useParams();
  const [, setLocation] = useLocation();
  const levelId = parseInt(params.levelId ?? '0', 10);
  const level = levels.find((l) => l.id === levelId);

  const initialQuestions = useMemo(() => {
    if (!level) return [];
    return shuffle(level.questions).map((q) => ({
      ...q,
      options: shuffle(q.options)
    }));
  }, [level]);

  const [questions] = useState<Question[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lastAnswer, setLastAnswer] = useState<AnswerFeedback | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  const currentQuestion = questions[currentQuestionIndex];
  const quizComplete = questions.length > 0 && currentQuestionIndex >= questions.length;

  // Redirect to home if invalid level
  useEffect(() => {
    if (!level) {
      setLocation('/');
    }
  }, [level, setLocation]);

  // Navigate to score page when quiz is complete
  useEffect(() => {
    if (quizComplete && level) {
      const searchParams = new URLSearchParams({
        completed: 'true',
        score: score.toString(),
        correct: correctAnswers.toString(),
        total: questions.length.toString()
      });
      setLocation(`/syntax-quiz/level/${levelId}/score?${searchParams.toString()}`);
    }
  }, [quizComplete, level, levelId, score, correctAnswers, questions.length, setLocation]);

  // Show nothing while redirecting
  if (!level || quizComplete) {
    return null;
  }

  const handleAnswer = (answer: string): void => {
    if (isAnswering || !currentQuestion) return;
    setIsAnswering(true);

    const correct = answer === currentQuestion.correct;

    if (correct) {
      vibrateCorrect();
      playCorrectSound();
      const penalty = Math.pow(HINT_SCORE_PENALTY, hintsUsed);
      const points = Math.round(BASE_SCORE_POINTS * (streak + 1) * penalty);
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      setCorrectAnswers((prev) => prev + 1);
    } else {
      vibrateIncorrect();
      playIncorrectSound();
      setStreak(0);
    }

    setLastAnswer({
      correct,
      term: currentQuestion.correct,
      userAnswer: correct ? null : answer,
      explanation: currentQuestion.explanation
    });
  };

  const handleFeedbackComplete = useCallback(() => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setIsAnswering(false);
    setHintsUsed(0);
    setEliminatedOptions([]);
  }, []);

  const handleUseHint = (): void => {
    if (isAnswering || !currentQuestion) return;
    if (hintsUsed === 0) {
      // First hint: eliminate two wrong answers
      const wrongOptions = currentQuestion.options.filter(
        (opt: string) => opt !== currentQuestion.correct
      );
      const shuffledWrong = shuffle(wrongOptions);
      setEliminatedOptions(shuffledWrong.slice(0, 2));
      setHintsUsed(1);
    } else if (hintsUsed === 1) {
      // Second hint: show the text hint (state change triggers display)
      setHintsUsed(2);
    }
  };

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

  if (!currentQuestion) {
    return null;
  }

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
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            level={level}
          />

          <AnimatePresence>
            {lastAnswer && currentQuestionIndex > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
                transition={{ duration: 0.21, ease: [0, 0, 0.2, 1] }}
              >
                <FeedbackBanner
                  lastAnswer={lastAnswer}
                  durationMs={FEEDBACK_DELAY_MS}
                  onCountdownComplete={handleFeedbackComplete}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
              transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
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
            </motion.div>
          </AnimatePresence>
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
