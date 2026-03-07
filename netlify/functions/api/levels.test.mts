import { call } from '@orpc/server'
import { describe, expect, it } from 'vitest'
import { levels } from '../../../src/data/questions.js'
import { levelsRoute } from './levels.mjs'

describe('GET /levels', () => {
  it('returns all levels with correct metadata', async () => {
    const result = await call(levelsRoute, undefined)

    expect(result).toHaveLength(levels.length)
    for (const level of result) {
      expect(level).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        subtitle: expect.any(String),
        description: expect.any(String),
        questionCount: expect.any(Number),
      })
    }
  })

  it('returns accurate question counts', async () => {
    const result = await call(levelsRoute, undefined)

    for (const level of result) {
      const sourceLevel = levels.find((l) => l.id === level.id)!
      expect(level.questionCount).toBe(sourceLevel.questions.length)
    }
  })

  it('does not expose the color field', async () => {
    const result = await call(levelsRoute, undefined)

    for (const level of result) {
      expect(level).not.toHaveProperty('color')
    }
  })
})
