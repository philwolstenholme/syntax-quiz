import type { Question } from '../data/questions';

export interface QuestionWithIndex extends Question {
  originalIndex: number;
}

export interface AnswerFeedback {
  correct: boolean;
  skipped?: boolean;
  term: string;
  userAnswer: string | null;
  explanation: string;
  docsLink?: string;
}
