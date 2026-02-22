import type { Question } from '../data/questions';

export type QuestionWithIndex = Question & { originalIndex: number };
