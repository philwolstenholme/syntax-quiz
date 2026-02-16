import { useEffect } from 'react';
import { useParams, useLocation, useSearch } from 'wouter';
import { CompletionScreen } from '../components/CompletionScreen';
import { levels } from '../data/questions';
import { ROUTES } from '../routes';

export const ScorePage = () => {
  const params = useParams();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);

  const levelId = parseInt(params.levelId ?? '0', 10);
  const level = levels.find((l) => l.id === levelId);

  const completed = searchParams.get('completed');
  const score = parseInt(searchParams.get('score') || '0', 10);
  const correctAnswers = parseInt(searchParams.get('correct') || '0', 10);
  const totalQuestions = parseInt(searchParams.get('total') || '0', 10);

  const isValidAccess = completed === 'true' && totalQuestions > 0 && level;

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
      score={score}
      correctAnswers={correctAnswers}
      totalQuestions={totalQuestions}
      level={level}
    />
  );
};
