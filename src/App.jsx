import { useState } from 'react';
import { shuffle } from 'es-toolkit';
import { motion, AnimatePresence } from 'motion/react';
import { BASE_SCORE_POINTS, FEEDBACK_DELAY_MS } from './constants';
import { feedbackCorrect, feedbackIncorrect } from './utils/feedback';
import { PageLayout } from './components/PageLayout';
import { QuizHeader } from './components/QuizHeader';
import { FeedbackBanner } from './components/FeedbackBanner';
import { QuestionCard } from './components/QuestionCard';
import { AnswerOptions } from './components/AnswerOptions';
import { CompletionScreen } from './components/CompletionScreen';
import { LevelSelect } from './components/LevelSelect';

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
  const [quizComplete, setQuizComplete] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

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
    setQuizComplete(false);
  };

  const handleAnswer = (answer) => {
    if (isAnswering) return;
    setIsAnswering(true);

    const correct = answer === currentQuestion.correct;

    if (correct) {
      feedbackCorrect();
      setScore((prev) => prev + BASE_SCORE_POINTS * (streak + 1));
      setStreak((prev) => prev + 1);
      setCorrectAnswers((prev) => prev + 1);
    } else {
      feedbackIncorrect();
      setStreak(0);
    }

    setLastAnswer({
      correct,
      term: currentQuestion.correct,
      userAnswer: correct ? null : answer
    });

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsAnswering(false);
      } else {
        setQuizComplete(true);
      }
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

  const handleRestart = () => {
    handleSelectLevel(selectedLevel);
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setQuestions([]);
    setQuizComplete(false);
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
          <PageLayout>
            <div className="max-w-4xl mx-auto">
              <QuizHeader
                score={score}
                streak={streak}
                currentQuestion={currentQuestionIndex}
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
