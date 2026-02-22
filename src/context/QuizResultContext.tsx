import { useState } from 'react';
import type { ReactNode } from 'react';
import { QuizResultContext } from './QuizResultState';
import type { QuizResult } from './QuizResultState';

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
