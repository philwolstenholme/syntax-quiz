import { useContext } from 'react';
import { QuizResultContext } from './QuizResultState';
import type { QuizResultContextValue } from './QuizResultState';

export function useQuizResult(): QuizResultContextValue {
  const ctx = useContext(QuizResultContext);
  if (!ctx) throw new Error('useQuizResult must be used within QuizResultProvider');
  return ctx;
}
