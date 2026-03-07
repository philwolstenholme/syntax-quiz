import { ORPCError, os } from '@orpc/server'
import { shuffle } from 'es-toolkit'
import { z } from 'zod'
import { levels } from '../../../src/data/questions.js'
import { FeedbackSchema, levelParamSchema, PlayQuestionSchema, ProgressSchema } from './schemas.mjs'

const BASE_SCORE_POINTS = 10

interface PlayState {
  v: 1
  l: number
  s: number // score
  k: number // streak
  c: number // correct answers count
  q: number[] // remaining question indices (q[0] = current)
  m: number[] // missed question indices (for retry)
  r: boolean // is retry round
}

const PlayStateSchema = z.object({
  v: z.literal(1),
  l: z.number().int(),
  s: z.number().int(),
  k: z.number().int().min(0),
  c: z.number().int().min(0),
  q: z.array(z.number().int()),
  m: z.array(z.number().int()),
  r: z.boolean(),
})

function encodePlayState(state: PlayState): string {
  return btoa(JSON.stringify(state))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function decodePlayState(encoded: string): PlayState | null {
  try {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    while (base64.length % 4) base64 += '='
    const result = PlayStateSchema.safeParse(JSON.parse(atob(base64)))
    return result.success ? result.data : null
  } catch {
    return null
  }
}

function buildPlayQuestion(state: PlayState) {
  const levelData = levels.find((l) => l.id === state.l)!
  const q = levelData.questions[state.q[0]!]!
  return {
    code: q.code,
    highlight: q.highlight,
    question: q.question,
    answers: shuffle([...q.options]) as string[],
  }
}

function buildProgress(state: PlayState, totalQuestions: number) {
  return {
    score: state.s,
    streak: state.k,
    correctAnswers: state.c,
    totalQuestions,
    questionsRemaining: state.q.length,
    isRetryRound: state.r,
  }
}

const start = os
  .route({ method: 'POST', path: '/play/start' })
  .input(z.object({ level: levelParamSchema }))
  .output(z.object({
    gameState: z.string(),
    question: PlayQuestionSchema,
    progress: ProgressSchema,
  }))
  .handler(async ({ input }) => {
    const levelData = levels.find((l) => l.id === input.level)
    if (!levelData) {
      throw new ORPCError('NOT_FOUND', { message: `Level ${input.level} not found` })
    }

    const indices = shuffle(Array.from({ length: levelData.questions.length }, (_, i) => i))
    const state: PlayState = {
      v: 1,
      l: input.level,
      s: 0,
      k: 0,
      c: 0,
      q: indices,
      m: [],
      r: false,
    }

    return {
      gameState: encodePlayState(state),
      question: buildPlayQuestion(state),
      progress: buildProgress(state, levelData.questions.length),
    }
  })

const answer = os
  .route({ method: 'POST', path: '/play/answer' })
  .input(z.object({
    gameState: z.string(),
    answer: z.string().nullable(),
  }))
  .output(z.object({
    gameState: z.string().nullable(),
    feedback: FeedbackSchema,
    question: PlayQuestionSchema.nullable(),
    progress: ProgressSchema,
    complete: z.boolean(),
  }))
  .handler(async ({ input }) => {
    const state = decodePlayState(input.gameState)
    if (!state) {
      throw new ORPCError('BAD_REQUEST', { message: 'Invalid game state' })
    }
    if (state.q.length === 0) {
      throw new ORPCError('BAD_REQUEST', { message: 'Game is already complete' })
    }

    const levelData = levels.find((l) => l.id === state.l)
    if (!levelData) {
      throw new ORPCError('BAD_REQUEST', { message: 'Invalid level in game state' })
    }

    const totalQuestions = levelData.questions.length
    const currentQ = levelData.questions[state.q[0]!]!
    const skipped = input.answer === null
    const correct = !skipped && input.answer === currentQ.correct
    const pointsEarned = correct ? BASE_SCORE_POINTS * (state.k + 1) : 0

    // Update state
    const newState: PlayState = {
      ...state,
      s: state.s + pointsEarned,
      k: correct ? state.k + 1 : 0,
      c: state.c + (correct ? 1 : 0),
      q: state.q.slice(1),
      m: correct ? state.m : [...state.m, state.q[0]!],
    }

    // Check pass completion
    let complete = false
    if (newState.q.length === 0) {
      if (newState.m.length > 0) {
        // Start retry round
        newState.q = shuffle(newState.m)
        newState.m = []
        newState.r = true
      } else {
        complete = true
      }
    }

    const feedback = {
      correct,
      skipped,
      correctAnswer: currentQ.correct,
      userAnswer: input.answer,
      explanation: currentQ.explanation,
      docsLink: currentQ.docsLink,
      pointsEarned,
    }

    return {
      gameState: complete ? null : encodePlayState(newState),
      feedback,
      question: complete ? null : buildPlayQuestion(newState),
      progress: buildProgress(newState, totalQuestions),
      complete,
    }
  })

export const playRoute = { start, answer }
