import { useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { CompletionScreen } from '../components/CompletionScreen';
import { levels } from '../data/questions';
import { ROUTES } from '../routes';
import { useQuizResult } from '../context/QuizResultContext';

export const ScorePage = () => {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { result } = useQuizResult();

  const levelId = parseInt(params.levelId ?? '0', 10);
  const level = levels.find((l) => l.id === levelId);

  const isValidAccess = result !== null && result.levelId === levelId && level;

  useEffect(() => {
    if (!isValidAccess) {
      setLocation(ROUTES.home);
    }
  }, [isValidAccess, setLocation]);

  if (!isValidAccess) {
    return null;
  }

  return (
    <CompletionScreen
      score={result.score}
      correctAnswers={result.correctAnswers}
      totalQuestions={result.totalQuestions}
      level={level}
    />
  );
};
