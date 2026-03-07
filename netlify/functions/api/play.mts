import type { OpenAPIV3_1 } from 'openapi-types'
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

const SET_COOKIE_HEADER = {
  'Set-Cookie': {
    schema: { type: 'string' as const },
    description: 'Sets the `gameState` cookie (Path=/api/play; HttpOnly; SameSite=Strict). Cleared when the game is complete.',
  },
}

function addHeadersToResponses(
  responses: OpenAPIV3_1.ResponsesObject | undefined,
  headers: Record<string, OpenAPIV3_1.HeaderObject>,
): OpenAPIV3_1.ResponsesObject {
  if (!responses) return {}
  const result: OpenAPIV3_1.ResponsesObject = {}
  for (const [status, res] of Object.entries(responses)) {
    if ('$ref' in (res as object)) {
      result[status] = res
    } else {
      const response = res as OpenAPIV3_1.ResponseObject
      result[status] = { ...response, headers: { ...response.headers, ...headers } }
    }
  }
  return result
}

const GAME_STATE_COOKIE_PARAM = {
  name: 'gameState',
  in: 'cookie' as const,
  required: false,
  schema: { type: 'string' as const },
  description: 'The game state token, automatically sent by the browser if the cookie was set by a previous response.',
}

const start = os
  .route({
    method: 'POST',
    path: '/play/start',
    tags: ['Play'],
    summary: 'Start a new game',
    description:
      'Begins a new quiz game for the chosen level. Returns a shuffled first question and an opaque `gameState` token.\n\n' +
      '## How to play\n\n' +
      '1. Call this endpoint with a level (1 = Easy, 2 = Medium, 3 = Hard) to get your first question and a `gameState` token.\n' +
      '2. Read the `question` object — it contains a code snippet, a highlighted portion, and four shuffled answer choices.\n' +
      '3. Submit your answer (or `null` to skip) to `POST /play/answer` along with the `gameState` token.\n' +
      '4. The response includes feedback on whether you were correct, the next question, and an updated `gameState`. Pass the new token back with your next answer.\n' +
      '5. Keep answering until `complete` is `true`.\n\n' +
      '## Scoring\n\n' +
      '- Each correct answer earns `10 × (current streak + 1)` points — consecutive correct answers build a streak multiplier.\n' +
      '- Wrong answers and skips reset the streak to 0 and queue the question for a retry round.\n\n' +
      '## Retry round\n\n' +
      'After you finish all questions, any you missed are reshuffled into a retry round. The game is only complete once every question has been answered correctly (or the retry round ends).\n\n' +
      '## Game state\n\n' +
      'The `gameState` token is opaque — receive it from the response and send it back unchanged with your next request. Do not modify or inspect it.\n\n' +
      '## Playing via Scalar / browser\n\n' +
      'When playing from the Scalar docs UI, you don\'t need to copy-paste the `gameState` token. ' +
      'It is automatically stored as a cookie and sent with subsequent requests. ' +
      'Just call `/play/start`, then repeatedly call `/play/answer` with only `{ "answer": "your choice" }` — the game state is handled for you.',
    spec: (current) => {
      const responses = addHeadersToResponses(current.responses, SET_COOKIE_HEADER)
      return { ...current, responses }
    },
  })
  .input(z.object({ level: levelParamSchema }))
  .output(z.object({
    gameState: z.string().describe('Opaque token encoding the game state — send this back with your next answer'),
    question: PlayQuestionSchema.describe('The first question to answer'),
    progress: ProgressSchema.describe('Initial progress (score 0, streak 0)'),
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
  .route({
    method: 'POST',
    path: '/play/answer',
    tags: ['Play'],
    summary: 'Submit an answer or skip',
    description:
      'Submit your answer to the current question. Send `answer: null` to skip.\n\n' +
      'The response includes:\n' +
      '- **feedback** — whether you were correct, the correct answer, an explanation, and points earned.\n' +
      '- **question** — the next question (or `null` if the game is complete).\n' +
      '- **progress** — your running score, streak, and how many questions remain.\n' +
      '- **complete** — `true` when the game is over (all questions answered, including retries).\n' +
      '- **gameState** — the updated token to send with your next request (`null` when complete).',
    spec: (current) => {
      const responses = addHeadersToResponses(current.responses, SET_COOKIE_HEADER)
      return {
        ...current,
        parameters: [...(current.parameters ?? []), GAME_STATE_COOKIE_PARAM],
        responses,
      }
    },
  })
  .input(z.object({
    gameState: z.string().optional().describe('The opaque game state token from the previous response. Optional when playing via the browser — the cookie is used automatically.'),
    answer: z.string().nullable().describe('Your answer choice (must match one of the provided answers exactly), or null to skip'),
  }))
  .output(z.object({
    gameState: z.string().nullable().describe('Updated game state token for the next request, or null when the game is complete'),
    feedback: FeedbackSchema.describe('Feedback on the question you just answered'),
    question: PlayQuestionSchema.nullable().describe('The next question, or null when the game is complete'),
    progress: ProgressSchema.describe('Updated score, streak, and remaining question count'),
    complete: z.boolean().describe('True when the game is over — no more questions to answer'),
  }))
  .handler(async ({ input }) => {
    if (!input.gameState) {
      throw new ORPCError('BAD_REQUEST', { message: 'Missing game state — provide gameState in the request body or start a game first to set the cookie' })
    }
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
