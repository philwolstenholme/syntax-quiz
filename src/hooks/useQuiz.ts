import { playCorrectSound, playIncorrectSound } from "../utils/sounds";
import { vibrateCorrect, vibrateIncorrect } from "../utils/vibrate";
import { encodeSaveState } from "../utils/saveState";
import type { SaveState } from "../utils/saveState";
import { ROUTES } from "../routes";
import { useQuizResult } from "../context/useQuizResult";
import type { AnswerFeedback } from "./types";
import type { Level } from "../data/questions";
import type { QuestionWithIndex } from "./types";
import { useQuizLevel } from "./useQuizLevel";
import { useScoring } from "./useScoring";
import { useAnswerInteraction } from "./useAnswerInteraction";
import { useQuestionProgression } from "./useQuestionProgression";

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
  isRetryRound: boolean;
  retryQuestionCount: number;
  handleAnswer: (answer: string) => void;
  handleSkip: () => void;
  handleUseHint: () => void;
  handleFeedbackComplete: () => void;
  handleSave: () => string;
}

export function useQuiz(): UseQuizReturn {
  const { level, levelId, saveState, initialQuestions, setLocation } = useQuizLevel();
  const { setResult } = useQuizResult();

  const { score, streak, correctAnswers, totalAttempts, recordCorrect, recordIncorrect } =
    useScoring({
      initialScore: saveState?.s,
      initialStreak: saveState?.k,
      initialCorrect: saveState?.c,
    });

  const {
    lastAnswer,
    isAnswering,
    hintsUsed,
    eliminatedOptions,
    canInteract,
    submitAnswer,
    applyHint,
    resetForNextQuestion,
  } = useAnswerInteraction({
    initialHintsUsed: saveState?.h,
    initialEliminatedOptions: saveState?.e,
  });

  const {
    questions,
    currentQuestion,
    currentQuestionIndex,
    totalLevelQuestions,
    answeredSoFar,
    quizComplete,
    isRetryRound,
    retryQuestionCount,
    missedQuestions,
    allMissedQuestions,
    advanceQuestion,
    addMissedQuestion,
    startRetryRound,
  } = useQuestionProgression({ initialQuestions, level });

  const handleFeedbackComplete = () => {
    const { isPassComplete } = advanceQuestion();
    resetForNextQuestion();

    if (!isPassComplete || !level) return;

    if (!isRetryRound && missedQuestions.length > 0) {
      startRetryRound();
      return;
    }

    // Quiz truly complete — navigate to score page via context
    setResult({
      score,
      correctAnswers,
      totalQuestions: totalAttempts,
      levelId,
      flawless: !isRetryRound,
      missedQuestions: allMissedQuestions,
    });
    setLocation(ROUTES.score(levelId));
  };

  const handleAnswer = (answer: string): void => {
    if (!canInteract || !currentQuestion) return;

    const correct = answer === currentQuestion.correct;

    if (correct) {
      vibrateCorrect();
      playCorrectSound();
      recordCorrect(hintsUsed);
    } else {
      vibrateIncorrect();
      playIncorrectSound();
      recordIncorrect();
      addMissedQuestion(currentQuestion);
    }

    submitAnswer({
      correct,
      term: currentQuestion.correct,
      userAnswer: correct ? null : answer,
      explanation: currentQuestion.explanation,
      docsLink: currentQuestion.docsLink,
    });
  };

  const handleSkip = (): void => {
    if (!canInteract || !currentQuestion) return;

    addMissedQuestion(currentQuestion);

    submitAnswer({
      correct: false,
      skipped: true,
      term: currentQuestion.correct,
      userAnswer: null,
      explanation: currentQuestion.explanation,
      docsLink: currentQuestion.docsLink,
    });
  };

  const handleUseHint = (): void => {
    if (!canInteract || !currentQuestion) return;
    applyHint(currentQuestion);
  };

  const handleSave = (): string => {
    const remainingIndices = questions.slice(currentQuestionIndex).map((q) => q.originalIndex);

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
    return `${window.location.origin}${ROUTES.questions(levelId)}?s=${encoded}`;
  };

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
    isRetryRound,
    retryQuestionCount,
    handleAnswer,
    handleSkip,
    handleUseHint,
    handleFeedbackComplete,
    handleSave,
  };
}
