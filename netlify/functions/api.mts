import { ORPCError, os } from '@orpc/server'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { JSON_SCHEMA_INPUT_REGISTRY, experimental_ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { Hono } from 'hono'
import { z } from 'zod'
import { levels } from '../../src/data/questions.js'

// --- Output schemas ---

const LevelMetaSchema = z.object({
  id: z.number().int().min(1).max(3),
  name: z.string(),
  subtitle: z.string(),
  description: z.string(),
  color: z.string(),
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
        color: l.color,
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

// No client caching; Netlify CDN caches until next deploy (auto-purged on each deploy)
app.use('/*', async (c, next) => {
  await next()
  c.res.headers.set('Cache-Control', 'no-store')
  c.res.headers.set('Netlify-CDN-Cache-Control', 'public, max-age=31536000')
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
