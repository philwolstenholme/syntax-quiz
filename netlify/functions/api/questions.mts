import { ORPCError, os } from '@orpc/server'
import { z } from 'zod'
import { levelMap } from './data.mjs'
import { buildQuestionsPayload } from './payloads.mjs'
import { levelParamSchema, QuestionSchema } from './schemas.mjs'

export const questionsRoute = os
  .route({ method: 'GET', path: '/questions', tags: ['Reference'], summary: 'Get all questions for a level' })
  .input(
    z.object({
      level: levelParamSchema,
    })
  )
  .output(z.array(QuestionSchema))
  .handler(async ({ input }) => {
    const levelData = levelMap.get(input.level)
    if (!levelData) {
      throw new ORPCError('NOT_FOUND', { message: `Level ${input.level} not found` })
    }
    return buildQuestionsPayload(levelData)
  })
