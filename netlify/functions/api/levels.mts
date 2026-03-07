import { os } from '@orpc/server'
import { z } from 'zod'
import { levels } from '../../../src/data/questions.js'
import { LevelMetaSchema } from './schemas.mjs'

export const levelsRoute = os
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
  )
