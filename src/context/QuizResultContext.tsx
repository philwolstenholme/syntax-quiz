import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  levelId: number;
}

interface QuizResultContextValue {
  result: QuizResult | null;
  setResult: (result: QuizResult) => void;
  clearResult: () => void;
}

const QuizResultContext = createContext<QuizResultContextValue | null>(null);

export function QuizResultProvider({ children }: { children: ReactNode }) {
  const [result, setResultState] = useState<QuizResult | null>(null);

  const setResult = (r: QuizResult) => setResultState(r);
  const clearResult = () => setResultState(null);

  return (
    <QuizResultContext.Provider value={{ result, setResult, clearResult }}>
      {children}
    </QuizResultContext.Provider>
  );
}

export function useQuizResult(): QuizResultContextValue {
  const ctx = useContext(QuizResultContext);
  if (!ctx) throw new Error('useQuizResult must be used within QuizResultProvider');
  return ctx;
}
