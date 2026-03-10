import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'wouter';
import { shuffle } from 'es-toolkit';
import { playCorrectSound, playIncorrectSound } from '../utils/sounds';
import { vibrateCorrect, vibrateIncorrect } from '../utils/vibrate';
import { useQuizResult } from '../context/useQuizResult';
import { useScoring } from './useScoring';
import { ROUTES } from '../routes';
import type { ConstructionQuestion, ConstructionLevel } from '../data/constructionQuestions';
import { constructionLevels } from '../data/constructionQuestions';
import type { AnswerFeedback } from './types';
import { MAX_HINTS } from '../constants';

export interface BuildQuestionWithIndex extends ConstructionQuestion {
  originalIndex: number;
  shuffledTokens: string[];
}

interface UseBuildQuizReturn {
  level: ConstructionLevel | undefined;
  currentQuestion: BuildQuestionWithIndex | undefined;
  currentQuestionIndex: number;
  totalLevelQuestions: number;
  answeredSoFar: number;
  score: number;
  streak: number;
  lastAnswer: AnswerFeedback | null;
  isAnswering: boolean;
  hintsUsed: number;
  quizComplete: boolean;
  isRetryRound: boolean;
  retryQuestionCount: number;
  handleSubmit: (arrangedTokens: string[]) => void;
  handleSkip: () => void;
  handleUseHint: () => void;
  handleFeedbackComplete: () => void;
}

export function useBuildQuiz(): UseBuildQuizReturn {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { setResult } = useQuizResult();

  const levelId = params.levelId ?? '';
  const level = constructionLevels.find(l => l.id === levelId);

  const initialQuestions = useMemo((): BuildQuestionWithIndex[] => {
    if (!level) return [];
    return shuffle(
      level.questions.map((q, i) => ({
        ...q,
        originalIndex: i,
        shuffledTokens: shuffle([...q.tokens, ...q.distractors]),
      })),
    );
  }, [level]);

  const [questions, setQuestions] = useState<BuildQuestionWithIndex[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [missedQuestions, setMissedQuestions] = useState<BuildQuestionWithIndex[]>([]);
  const [isRetryRound, setIsRetryRound] = useState(false);

  const { score, streak, correctAnswers, recordCorrect, recordIncorrect } = useScoring();

  const [lastAnswer, setLastAnswer] = useState<AnswerFeedback | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const totalLevelQuestions = level?.questions.length ?? 0;
  const answeredSoFar = isRetryRound ? 0 : totalLevelQuestions - questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const retryQuestionCount = isRetryRound ? questions.length : 0;

  const passComplete = questions.length > 0 && currentQuestionIndex >= questions.length;
  const quizComplete = passComplete && (isRetryRound || missedQuestions.length === 0);

  // Redirect to home if invalid level
  useEffect(() => {
    if (!level) {
      setLocation(ROUTES.home);
    }
  }, [level, setLocation]);

  const handleFeedbackComplete = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    setLastAnswer(null);
    setIsAnswering(false);
    setHintsUsed(0);

    const isPassComplete = questions.length > 0 && nextIndex >= questions.length;
    if (!isPassComplete || !level) return;

    if (!isRetryRound && missedQuestions.length > 0) {
      // Start retry round
      const retryQuestions = shuffle([...missedQuestions]).map(q => ({
        ...q,
        shuffledTokens: shuffle([...q.tokens, ...q.distractors]),
      }));
      setQuestions(retryQuestions);
      setCurrentQuestionIndex(0);
      setIsRetryRound(true);
      setMissedQuestions([]);
      return;
    }

    // Quiz complete
    setResult({ score, correctAnswers, totalQuestions: totalLevelQuestions, levelId });
    setLocation(ROUTES.buildScore(levelId));
  }, [currentQuestionIndex, questions.length, level, isRetryRound, missedQuestions, score, correctAnswers, totalLevelQuestions, levelId, setResult, setLocation]);

  const handleSubmit = useCallback((arrangedTokens: string[]) => {
    if (isAnswering || !currentQuestion) return;

    const correct =
      arrangedTokens.length === currentQuestion.tokens.length &&
      arrangedTokens.every((t, i) => t === currentQuestion.tokens[i]);

    if (correct) {
      vibrateCorrect();
      playCorrectSound();
      recordCorrect(hintsUsed);
    } else {
      vibrateIncorrect();
      playIncorrectSound();
      recordIncorrect();
      setMissedQuestions(prev => [...prev, currentQuestion]);
    }

    setIsAnswering(true);
    setLastAnswer({
      correct,
      term: currentQuestion.tokens.join(' '),
      userAnswer: correct ? null : arrangedTokens.join(' '),
      explanation: currentQuestion.explanation,
      docsLink: currentQuestion.docsLink,
    });
  }, [isAnswering, currentQuestion, hintsUsed, recordCorrect, recordIncorrect]);

  const handleSkip = useCallback(() => {
    if (isAnswering || !currentQuestion) return;

    setMissedQuestions(prev => [...prev, currentQuestion]);
    setIsAnswering(true);
    setLastAnswer({
      correct: false,
      skipped: true,
      term: currentQuestion.tokens.join(' '),
      userAnswer: null,
      explanation: currentQuestion.explanation,
      docsLink: currentQuestion.docsLink,
    });
  }, [isAnswering, currentQuestion]);

  const handleUseHint = useCallback(() => {
    if (isAnswering || !currentQuestion) return;

    if (hintsUsed === 0 && currentQuestion.distractors.length > 0) {
      // First hint: remove distractors from the shuffled tokens
      const updated = {
        ...currentQuestion,
        shuffledTokens: currentQuestion.shuffledTokens.filter(
          t => !currentQuestion.distractors.includes(t),
        ),
      };
      const newQuestions = [...questions];
      newQuestions[currentQuestionIndex] = updated;
      setQuestions(newQuestions);
      setHintsUsed(1);
    } else if (hintsUsed < MAX_HINTS) {
      // Second hint: show hint text (handled by HintButton reading hintsUsed)
      setHintsUsed(MAX_HINTS);
    }
  }, [isAnswering, currentQuestion, hintsUsed, questions, currentQuestionIndex]);

  return {
    level,
    currentQuestion,
    currentQuestionIndex,
    totalLevelQuestions,
    answeredSoFar,
    score,
    streak,
    lastAnswer,
    isAnswering,
    hintsUsed,
    quizComplete,
    isRetryRound,
    retryQuestionCount,
    handleSubmit,
    handleSkip,
    handleUseHint,
    handleFeedbackComplete,
  };
}
