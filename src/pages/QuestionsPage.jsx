import { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import { shuffle } from 'es-toolkit';
import { motion, AnimatePresence } from 'motion/react';
import { playCorrectSound, playIncorrectSound } from '../utils/sounds';
import { vibrateCorrect, vibrateIncorrect } from '../utils/vibrate';
import { PageLayout } from '../components/PageLayout';
import { QuizHeader } from '../components/QuizHeader';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { QuestionCard } from '../components/QuestionCard';
import { AnswerOptions } from '../components/AnswerOptions';
import { levels } from '../data/questions';

const BASE_SCORE_POINTS = 10;
const FEEDBACK_DELAY_MS = 1500;

export const QuestionsPage = () => {
  const params = useParams();
  const [, setLocation] = useLocation();
  const levelId = parseInt(params.levelId, 10);
  const level = levels.find((l) => l.id === levelId);

  // Initialize shuffled questions once when level changes using useMemo
  const initialQuestions = useMemo(() => {
    if (!level) return [];
    return shuffle(level.questions).map((q) => ({
      ...q,
      options: shuffle(q.options)
    }));
  }, [level]);

  const [questions] = useState(() => initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);

  // Redirect to home if level not found
  useEffect(() => {
    if (!level) {
      setLocation('/');
    }
  }, [level, setLocation]);

  const currentQuestion = questions[currentQuestionIndex];
  // Note: questions.length > 0 is needed to prevent false positive when questions haven't loaded yet
  // (0 >= 0 is true, which would incorrectly mark quiz as complete)
  const quizComplete = questions.length > 0 && currentQuestionIndex >= questions.length;

  useEffect(() => {
    if (quizComplete && level) {
      // Navigate to score page with state indicating completion
      setLocation(`/syntax-quiz/level/${levelId}/score?completed=true&score=${score}&correct=${correctAnswers}&total=${questions.length}`);
    }
  }, [quizComplete, levelId, score, correctAnswers, questions.length, setLocation, level]);

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

  const handleDragOver = (e) => {
    if (isAnswering) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isAnswering) return;

    const answer = e.dataTransfer.getData('text/plain');
    if (answer) {
      handleAnswer(answer);
    }
  };

  if (!level || questions.length === 0 || !currentQuestion) {
    return null;
  }

  return (
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
            <QuestionCard
              question={currentQuestion}
              isDragOver={isDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />

            <AnswerOptions
              options={currentQuestion.options}
              onAnswer={handleAnswer}
              disabled={isAnswering}
              onDragOverChange={setIsDragOver}
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
  );
};
