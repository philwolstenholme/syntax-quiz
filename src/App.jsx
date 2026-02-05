import { useState } from 'react';
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
import { GripVertical } from 'lucide-react';
import { playCorrectSound, playIncorrectSound } from './utils/sounds';
import { vibrateCorrect, vibrateIncorrect } from './utils/vibrate';
import { PageLayout } from './components/PageLayout';
import { QuizHeader } from './components/QuizHeader';
import { FeedbackBanner } from './components/FeedbackBanner';
import { QuestionCard } from './components/QuestionCard';
import { AnswerOptions } from './components/AnswerOptions';
import { CompletionScreen } from './components/CompletionScreen';
import { LevelSelect } from './components/LevelSelect';

const BASE_SCORE_POINTS = 10;
const FEEDBACK_DELAY_MS = 1500;

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

function App() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [activeId, setActiveId] = useState(null);

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

  const handleSelectLevel = (level) => {
    const shuffledQuestions = shuffle(level.questions).map((q) => ({
      ...q,
      options: shuffle(q.options)
    }));

    setSelectedLevel(level);
    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setCorrectAnswers(0);
    setLastAnswer(null);
  };

  const handleAnswer = (answer) => {
    if (isAnswering) return;
    setIsAnswering(true);

    const correct = answer === currentQuestion.correct;

    if (correct) {
      vibrateCorrect();
      playCorrectSound();
      setScore((prev) => prev + BASE_SCORE_POINTS * (streak + 1));
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
      userAnswer: correct ? null : answer
    });

    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswering(false);
    }, FEEDBACK_DELAY_MS);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    
    if (over && over.id === 'dropzone' && active.data.current?.answer) {
      handleAnswer(active.data.current.answer);
    }
  };

  const handleRestart = () => {
    handleSelectLevel(selectedLevel);
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setQuestions([]);
  };

  return (
    <AnimatePresence mode="wait">
      {!selectedLevel && (
        <motion.div key="levels" {...pageTransition}>
          <LevelSelect onSelectLevel={handleSelectLevel} />
        </motion.div>
      )}

      {selectedLevel && !quizComplete && (
        <motion.div key="quiz" {...pageTransition}>
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
                  level={selectedLevel}
                />

                <AnimatePresence>
                  {lastAnswer && currentQuestionIndex > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
                      transition={{ duration: 0.21, ease: [0, 0, 0.2, 1] }}
                    >
                      <FeedbackBanner lastAnswer={lastAnswer} />
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

                    <AnswerOptions
                      options={currentQuestion.options}
                      onAnswer={handleAnswer}
                      disabled={isAnswering}
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
        </motion.div>
      )}

      {selectedLevel && quizComplete && (
        <motion.div key="complete" {...pageTransition}>
          <CompletionScreen
            score={score}
            correctAnswers={correctAnswers}
            totalQuestions={questions.length}
            level={selectedLevel}
            onRestart={handleRestart}
            onBackToLevels={handleBackToLevels}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
