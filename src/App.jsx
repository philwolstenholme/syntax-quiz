import { useState, useMemo } from 'react';
import { shuffle } from 'es-toolkit';
import { questions as rawQuestions } from './data/questions';
import { vibrateCorrect, vibrateIncorrect } from './utils/vibrate';
import { playCorrectSound, playIncorrectSound } from './utils/sounds';
import { useViewTransition } from './hooks/useViewTransition';
import { QuizHeader } from './components/QuizHeader';
import { FeedbackBanner } from './components/FeedbackBanner';
import { QuestionCard } from './components/QuestionCard';
import { AnswerOptions } from './components/AnswerOptions';
import { CompletionScreen } from './components/CompletionScreen';

function App() {
  const withTransition = useViewTransition();

  const [questions] = useState(() =>
    shuffle(rawQuestions).map((q) => ({
      ...q,
      options: shuffle(q.options)
    }))
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answer) => {
    if (isAnswering) return;
    setIsAnswering(true);

    const correct = answer === currentQuestion.correct;

    if (correct) {
      vibrateCorrect();
      playCorrectSound();
      const points = 10 * (streak + 1);
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
      userAnswer: correct ? null : answer
    });

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        withTransition(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
          setIsAnswering(false);
        });
      } else {
        withTransition(() => {
          setQuizComplete(true);
        });
      }
    }, 1500);
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
    window.location.reload();
  };

  if (quizComplete) {
    return (
      <CompletionScreen
        score={score}
        correctAnswers={correctAnswers}
        totalQuestions={questions.length}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <QuizHeader
          score={score}
          streak={streak}
          currentQuestion={currentQuestionIndex}
          totalQuestions={questions.length}
        />

        {lastAnswer && currentQuestionIndex > 0 && (
          <FeedbackBanner lastAnswer={lastAnswer} />
        )}

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
        />
      </div>
    </div>
  );
}

export default App;
