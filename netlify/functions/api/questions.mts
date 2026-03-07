import { ORPCError, os } from '@orpc/server'
import { z } from 'zod'
import { levels } from '../../../src/data/questions.js'
import { levelParamSchema, QuestionSchema } from './schemas.mjs'

export const questionsRoute = os
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
  })
