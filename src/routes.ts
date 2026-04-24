export const ROUTES = {
  home: "/",
  questions: (levelId: number | string) => `/level/${levelId}/questions` as const,
  score: (levelId: number | string) => `/level/${levelId}/score` as const,
} as const;

export const ROUTE_PATTERNS = {
  questions: "/level/:levelId/questions",
  score: "/level/:levelId/score",
} as const;
