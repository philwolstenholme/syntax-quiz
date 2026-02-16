export const ROUTES = {
  home: '/',
  questions: (levelId: number | string) =>
    `/syntax-quiz/level/${levelId}/questions` as const,
  score: (levelId: number | string) =>
    `/syntax-quiz/level/${levelId}/score` as const,
} as const;

export const ROUTE_PATTERNS = {
  questions: '/syntax-quiz/level/:levelId/questions',
  score: '/syntax-quiz/level/:levelId/score',
} as const;
