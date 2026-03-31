import { os } from '@orpc/server'
import { z } from 'zod'
import { levelMap } from './data.mjs'
import { buildLevelsPayload } from './payloads.mjs'
import { LevelMetaSchema } from './schemas.mjs'

export const levelsRoute = os
  .route({ method: 'GET', path: '/levels', tags: ['Reference'], summary: 'List all levels' })
  .output(z.array(LevelMetaSchema))
  .handler(async () => buildLevelsPayload(Array.from(levelMap.values())))
