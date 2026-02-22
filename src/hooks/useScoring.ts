import { useState } from 'react';
import { BASE_SCORE_POINTS, HINT_SCORE_PENALTY } from '../constants';

interface UseScoringInput {
  initialScore?: number;
  initialStreak?: number;
  initialCorrect?: number;
}

interface UseScoringReturn {
  score: number;
  streak: number;
  correctAnswers: number;
  recordCorrect: (hintsUsed: number) => void;
  recordIncorrect: () => void;
}

export function useScoring({
  initialScore = 0,
  initialStreak = 0,
  initialCorrect = 0,
}: UseScoringInput = {}): UseScoringReturn {
  const [score, setScore] = useState(initialScore);
  const [streak, setStreak] = useState(initialStreak);
  const [correctAnswers, setCorrectAnswers] = useState(initialCorrect);

  const recordCorrect = (hintsUsed: number) => {
    const newStreak = streak + 1;
    const penalty = Math.pow(HINT_SCORE_PENALTY, hintsUsed);
    const points = Math.round(BASE_SCORE_POINTS * newStreak * penalty);
    setStreak(newStreak);
    setScore(s => s + points);
    setCorrectAnswers(c => c + 1);
  };

  const recordIncorrect = () => {
    setStreak(0);
  };

  return { score, streak, correctAnswers, recordCorrect, recordIncorrect };
}
