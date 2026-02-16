import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'wouter';
import { shuffle } from 'es-toolkit';
import { playCorrectSound, playIncorrectSound } from '../utils/sounds';
import { vibrateCorrect, vibrateIncorrect } from '../utils/vibrate';
import { encodeSaveState, decodeSaveState } from '../utils/saveState';
import type { SaveState } from '../utils/saveState';
import type { Question, Level } from '../data/questions';
import { levels } from '../data/questions';
import { ROUTES } from '../routes';
import {
  BASE_SCORE_POINTS,
  HINT_SCORE_PENALTY,
  MAX_HINTS,
  HINTS_TO_ELIMINATE,
} from '../constants';
import type { AnswerFeedback } from '../components/FeedbackBanner';

type QuestionWithIndex = Question & { originalIndex: number };

interface UseQuizReturn {
  level: Level | undefined;
  currentQuestion: QuestionWithIndex | undefined;
  currentQuestionIndex: number;
  totalLevelQuestions: number;
  answeredSoFar: number;
  score: number;
  streak: number;
  correctAnswers: number;
  lastAnswer: AnswerFeedback | null;
  isAnswering: boolean;
  hintsUsed: number;
  eliminatedOptions: string[];
  quizComplete: boolean;
  handleAnswer: (answer: string) => void;
  handleUseHint: () => void;
  handleFeedbackComplete: () => void;
  handleSave: () => string;
}

export function useQuiz(): UseQuizReturn {
  const params = useParams();
  const [, setLocation] = useLocation();
  const levelId = parseInt(params.levelId ?? '0', 10);
  const level = levels.find((l) => l.id === levelId);

  const saveState = useMemo((): SaveState | null => {
    const searchParams = new URLSearchParams(window.location.search);
    const saveParam = searchParams.get('s');
    if (!saveParam || !level) return null;
    const state = decodeSaveState(saveParam);
    if (!state || state.l !== levelId) return null;
    if (state.r.some(i => i < 0 || i >= level.questions.length)) return null;
    return state;
  }, [level, levelId]);

  const initialQuestions = useMemo((): QuestionWithIndex[] => {
    if (!level) return [];
    if (saveState) {
      return saveState.r.flatMap(originalIndex => {
        const q = level.questions[originalIndex];
        if (!q) return [];
        return [{
          ...q,
          originalIndex,
          options: shuffle(q.options),
        }];
      });
    }
    return shuffle(
      level.questions.map((q, i) => ({ ...q, originalIndex: i }))
    ).map(q => ({
      ...q,
      options: shuffle(q.options),
    }));
  }, [level, saveState]);

  const [questions] = useState<QuestionWithIndex[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(saveState?.s ?? 0);
  const [streak, setStreak] = useState(saveState?.k ?? 0);
  const [correctAnswers, setCorrectAnswers] = useState(saveState?.c ?? 0);
  const [lastAnswer, setLastAnswer] = useState<AnswerFeedback | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(saveState?.h ?? 0);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>(saveState?.e ?? []);

  const totalLevelQuestions = level?.questions.length ?? 0;
  const answeredSoFar = totalLevelQuestions - questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const quizComplete = questions.length > 0 && currentQuestionIndex >= questions.length;

  // Redirect to home if invalid level
  useEffect(() => {
    if (!level) {
      setLocation(ROUTES.home);
    }
  }, [level, setLocation]);

  // Replace URL to remove save param on mount
  useEffect(() => {
    if (saveState) {
      window.history.replaceState({}, '', ROUTES.questions(levelId));
    }
  }, [saveState, levelId]);

  // Navigate to score page when quiz is complete
  useEffect(() => {
    if (quizComplete && level) {
      const searchParams = new URLSearchParams({
        completed: 'true',
        score: score.toString(),
        correct: correctAnswers.toString(),
        total: totalLevelQuestions.toString(),
      });
      setLocation(`${ROUTES.score(levelId)}?${searchParams.toString()}`);
    }
  }, [quizComplete, level, levelId, score, correctAnswers, totalLevelQuestions, setLocation]);

  const handleFeedbackComplete = useCallback(() => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setIsAnswering(false);
    setHintsUsed(0);
    setEliminatedOptions([]);
  }, []);

  const handleAnswer = useCallback((answer: string): void => {
    if (isAnswering || !currentQuestion) return;
    setIsAnswering(true);

    const correct = answer === currentQuestion.correct;

    if (correct) {
      vibrateCorrect();
      playCorrectSound();
      const penalty = Math.pow(HINT_SCORE_PENALTY, hintsUsed);
      const points = Math.round(BASE_SCORE_POINTS * (streak + 1) * penalty);
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      setCorrectAnswers((prev) => prev + 1);
    } else {
      vibrateIncorrect();
      playIncorrectSound();
      setStreak(0);
    }

    setLastAnswer({
      correct,
      term: currentQuestion.correct,
      userAnswer: correct ? null : answer,
      explanation: currentQuestion.explanation,
    });
  }, [isAnswering, currentQuestion, hintsUsed, streak]);

  const handleUseHint = useCallback((): void => {
    if (isAnswering || !currentQuestion) return;
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
  }, [isAnswering, currentQuestion, hintsUsed]);

  const handleSave = useCallback((): string => {
    const remainingIndices = questions
      .slice(currentQuestionIndex)
      .map(q => q.originalIndex);

    const state: SaveState = {
      v: 1,
      l: levelId,
      s: score,
      k: streak,
      c: correctAnswers,
      h: hintsUsed,
      r: remainingIndices,
      e: eliminatedOptions,
    };

    const encoded = encodeSaveState(state);
    const path = `${ROUTES.questions(levelId)}?s=${encoded}`;
    const url = `${window.location.origin}${path}`;

    window.history.replaceState({}, '', path);

    return url;
  }, [questions, currentQuestionIndex, levelId, score, streak, correctAnswers, hintsUsed, eliminatedOptions]);

  return {
    level,
    currentQuestion,
    currentQuestionIndex,
    totalLevelQuestions,
    answeredSoFar,
    score,
    streak,
    correctAnswers,
    lastAnswer,
    isAnswering,
    hintsUsed,
    eliminatedOptions,
    quizComplete,
    handleAnswer,
    handleUseHint,
    handleFeedbackComplete,
    handleSave,
  };
}
