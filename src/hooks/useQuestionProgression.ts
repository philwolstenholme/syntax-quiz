import { useState } from 'react';
import { shuffle } from 'es-toolkit';
import type { Level } from '../data/questions';
import type { QuestionWithIndex } from './types';

interface UseQuestionProgressionInput {
  initialQuestions: QuestionWithIndex[];
  level: Level | undefined;
}

interface UseQuestionProgressionReturn {
  questions: QuestionWithIndex[];
  currentQuestion: QuestionWithIndex | undefined;
  currentQuestionIndex: number;
  totalLevelQuestions: number;
  answeredSoFar: number;
  quizComplete: boolean;
  isRetryRound: boolean;
  retryQuestionCount: number;
  missedQuestions: QuestionWithIndex[];
  advanceQuestion: () => { isPassComplete: boolean };
  addMissedQuestion: (q: QuestionWithIndex) => void;
  startRetryRound: () => void;
}

export function useQuestionProgression({
  initialQuestions,
  level,
}: UseQuestionProgressionInput): UseQuestionProgressionReturn {
  const [questions, setQuestions] = useState<QuestionWithIndex[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [missedQuestions, setMissedQuestions] = useState<QuestionWithIndex[]>([]);
  const [isRetryRound, setIsRetryRound] = useState(false);

  const totalLevelQuestions = level?.questions.length ?? 0;
  const answeredSoFar = isRetryRound ? 0 : totalLevelQuestions - questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const passComplete = questions.length > 0 && currentQuestionIndex >= questions.length;
  const quizComplete = passComplete && (isRetryRound || missedQuestions.length === 0);
  const retryQuestionCount = isRetryRound ? questions.length : 0;

  const advanceQuestion = (): { isPassComplete: boolean } => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    const isPassComplete = questions.length > 0 && nextIndex >= questions.length;
    return { isPassComplete };
  };

  const addMissedQuestion = (q: QuestionWithIndex) => {
    setMissedQuestions(prev => [...prev, q]);
  };

  const startRetryRound = () => {
    setMissedQuestions(prev => {
      const retryQuestions = shuffle([...prev]).map(q => ({
        ...q,
        options: shuffle(q.options),
      }));
      setQuestions(retryQuestions);
      setCurrentQuestionIndex(0);
      setIsRetryRound(true);
      return [];
    });
  };

  return {
    questions,
    currentQuestion,
    currentQuestionIndex,
    totalLevelQuestions,
    answeredSoFar,
    quizComplete,
    isRetryRound,
    retryQuestionCount,
    missedQuestions,
    advanceQuestion,
    addMissedQuestion,
    startRetryRound,
  };
}
