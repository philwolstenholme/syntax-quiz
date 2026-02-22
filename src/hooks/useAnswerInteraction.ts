import { useState, useCallback } from 'react';
import { shuffle } from 'es-toolkit';
import { MAX_HINTS, HINTS_TO_ELIMINATE } from '../constants';
import type { AnswerFeedback } from '../components/FeedbackBanner';
import type { QuestionWithIndex } from './types';

interface UseAnswerInteractionInput {
  initialHintsUsed?: number;
  initialEliminatedOptions?: string[];
}

interface UseAnswerInteractionReturn {
  lastAnswer: AnswerFeedback | null;
  isAnswering: boolean;
  hintsUsed: number;
  eliminatedOptions: string[];
  canInteract: boolean;
  submitAnswer: (feedback: AnswerFeedback) => void;
  useHint: (currentQuestion: QuestionWithIndex) => void;
  resetForNextQuestion: () => void;
}

export function useAnswerInteraction({
  initialHintsUsed = 0,
  initialEliminatedOptions = [],
}: UseAnswerInteractionInput = {}): UseAnswerInteractionReturn {
  const [lastAnswer, setLastAnswer] = useState<AnswerFeedback | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(initialHintsUsed);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>(initialEliminatedOptions);

  const canInteract = !isAnswering;

  const submitAnswer = useCallback((feedback: AnswerFeedback) => {
    setIsAnswering(true);
    setLastAnswer(feedback);
  }, []);

  const useHint = useCallback((currentQuestion: QuestionWithIndex) => {
    if (hintsUsed === 0) {
      const wrongOptions = currentQuestion.options.filter(
        (opt: string) => opt !== currentQuestion.correct
      );
      const shuffledWrong = shuffle(wrongOptions);
      setEliminatedOptions(shuffledWrong.slice(0, HINTS_TO_ELIMINATE));
      setHintsUsed(1);
    } else if (hintsUsed < MAX_HINTS) {
      setHintsUsed(MAX_HINTS);
    }
  }, [hintsUsed]);

  const resetForNextQuestion = useCallback(() => {
    setIsAnswering(false);
    setHintsUsed(0);
    setEliminatedOptions([]);
  }, []);

  return {
    lastAnswer,
    isAnswering,
    hintsUsed,
    eliminatedOptions,
    canInteract,
    submitAnswer,
    useHint,
    resetForNextQuestion,
  };
}
