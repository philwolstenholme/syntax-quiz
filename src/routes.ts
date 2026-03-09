export const ROUTES = {
  home: '/',
  questions: (levelId: number | string) =>
    `/level/${levelId}/questions` as const,
  score: (levelId: number | string) =>
    `/level/${levelId}/score` as const,
  build: (levelId: string) =>
    `/build/${levelId}` as const,
  buildScore: (levelId: string) =>
    `/build/${levelId}/score` as const,
} as const;

export const ROUTE_PATTERNS = {
  questions: '/level/:levelId/questions',
  score: '/level/:levelId/score',
  build: '/build/:levelId',
  buildScore: '/build/:levelId/score',
} as const;
