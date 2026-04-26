import { createContext } from "react";
import type { QuestionWithIndex } from "../hooks/types";

export interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  levelId: number;
  flawless: boolean;
  missedQuestions: QuestionWithIndex[];
}

export interface QuizResultContextValue {
  result: QuizResult | null;
  setResult: (result: QuizResult) => void;
  clearResult: () => void;
}

export const QuizResultContext = createContext<QuizResultContextValue | null>(null);
