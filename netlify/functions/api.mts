import { ORPCError, os } from '@orpc/server'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { JSON_SCHEMA_INPUT_REGISTRY, experimental_ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { shuffle } from 'es-toolkit'
import { Hono } from 'hono'
import { z } from 'zod'
import { levels } from '../../src/data/questions.js'

// --- Play state (stateless game token) ---

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

// --- Output schemas ---

const LevelMetaSchema = z.object({
  id: z.number().int().min(1).max(3),
  name: z.string(),
  subtitle: z.string(),
  description: z.string(),
  questionCount: z.number().int().min(0),
})

const QuestionSchema = z.object({
  code: z.string().describe('The code snippet shown to the player'),
  highlight: z.string().describe('The portion of code to highlight'),
  question: z.string(),
  answers: z.array(z.string()).describe('All possible answer choices'),
  metadata: z.object({
    correct: z.string().describe('The correct answer'),
    hint: z.string().describe('A hint that eliminates two wrong answer options'),
    explanation: z.string(),
    docsLink: z.string().url().optional(),
  }),
})

// Runtime: smart coercion converts "1" → 1 from query params
// OpenAPI: registry override adds enum so Scalar shows a dropdown
const levelParamSchema = z
  .number()
  .int()
  .min(1)
  .max(3)
  .describe('Level number (1 = Easy, 2 = Medium, 3 = Hard)')
JSON_SCHEMA_INPUT_REGISTRY.add(levelParamSchema, { type: 'integer', enum: [1, 2, 3] })

// --- Play schemas ---

const PlayQuestionSchema = z.object({
  code: z.string(),
  highlight: z.string(),
  question: z.string(),
  answers: z.array(z.string()),
})

const FeedbackSchema = z.object({
  correct: z.boolean(),
  skipped: z.boolean(),
  correctAnswer: z.string(),
  userAnswer: z.string().nullable(),
  explanation: z.string(),
  docsLink: z.string().url().optional(),
  pointsEarned: z.number().int(),
})

const ProgressSchema = z.object({
  score: z.number().int(),
  streak: z.number().int(),
  correctAnswers: z.number().int(),
  totalQuestions: z.number().int(),
  questionsRemaining: z.number().int(),
  isRetryRound: z.boolean(),
})

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

// --- oRPC router ---

const router = {
  levels: os
    .route({ method: 'GET', path: '/levels' })
    .output(z.array(LevelMetaSchema))
    .handler(async () =>
      levels.map((l) => ({
        id: l.id,
        name: l.name,
        subtitle: l.subtitle,
        description: l.description,
        questionCount: l.questions.length,
      }))
    ),

  questions: os
    .route({ method: 'GET', path: '/questions' })
    .input(
      z.object({
        level: levelParamSchema,
      })
    )
    .output(z.array(QuestionSchema))
    .handler(async ({ input }) => {
      const levelData = levels.find((l) => l.id === input.level)
      if (!levelData) {
        throw new ORPCError('NOT_FOUND', { message: `Level ${input.level} not found` })
      }
      return levelData.questions.map((q) => ({
        code: q.code,
        highlight: q.highlight,
        question: q.question,
        answers: q.options,
        metadata: {
          correct: q.correct,
          hint: q.hint,
          explanation: q.explanation,
          docsLink: q.docsLink,
        },
      }))
    }),

  play: {
    start: os
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
      }),

    answer: os
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
      }),
  },
}

// --- OpenAPI handler with Scalar docs ---

const openAPIHandler = new OpenAPIHandler(router, {
  plugins: [
    new experimental_ZodSmartCoercionPlugin(),
    new OpenAPIReferencePlugin({
      docsProvider: 'scalar',
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: 'Syntax Quiz API',
          version: '1.0.0',
          description: 'Retrieve quiz questions and levels for the Syntax Quiz game',
        },
        servers: [{ url: '/api' }],
      },
    }),
  ],
})

// --- Hono app (modern Netlify Functions v2 format) ---

const app = new Hono()

// No client caching; Netlify CDN caches GET responses until next deploy (auto-purged on each deploy)
app.use('/*', async (c, next) => {
  await next()
  if (c.req.method === 'GET') {
    c.res.headers.set('Cache-Control', 'no-store')
    c.res.headers.set('Netlify-CDN-Cache-Control', 'public, max-age=31536000')
  }
})

app.all('/*', async (c) => {
  const { matched, response } = await openAPIHandler.handle(c.req.raw, {
    prefix: '/api',
    context: {},
  })
  if (matched) return response!
  return c.notFound()
})

export default (request: Request) => app.fetch(request)
