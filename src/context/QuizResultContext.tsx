import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { QuizResultContext } from './QuizResultState';
import type { QuizResult } from './QuizResultState';

export function QuizResultProvider({ children }: { children: ReactNode }) {
  const [result, setResultState] = useState<QuizResult | null>(null);

  const value = useMemo(() => ({
    result,
    setResult: setResultState,
    clearResult: () => setResultState(null),
  }), [result]);

  return (
    <QuizResultContext.Provider value={value}>
      {children}
    </QuizResultContext.Provider>
  );
}
