import { createContext } from 'react';

export interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  levelId: number;
}

export interface QuizResultContextValue {
  result: QuizResult | null;
  setResult: (result: QuizResult) => void;
  clearResult: () => void;
}

export const QuizResultContext = createContext<QuizResultContextValue | null>(null);
