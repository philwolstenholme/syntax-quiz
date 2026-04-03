import { useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { shuffle } from 'es-toolkit';
import { decodeSaveState } from '../utils/saveState';
import type { SaveState } from '../utils/saveState';
import type { Level } from '../data/questions';
import { levels } from '../data/questions';
import { ROUTES } from '../routes';
import type { QuestionWithIndex } from './types';

interface UseQuizLevelReturn {
  level: Level | undefined;
  levelId: number;
  saveState: SaveState | null;
  initialQuestions: QuestionWithIndex[];
  setLocation: (to: string) => void;
}

export function useQuizLevel(): UseQuizLevelReturn {
  const params = useParams();
  const [, setLocation] = useLocation();
  const levelId = parseFloat(params.levelId ?? '0');
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

  return { level, levelId, saveState, initialQuestions, setLocation };
}
