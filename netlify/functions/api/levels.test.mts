import { call } from '@orpc/server'
import { beforeAll, describe, expect, it } from 'vitest'
import { levels } from '../../../src/data/questions.js'
import { levelsRoute } from './levels.mjs'

describe('GET /levels', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any[]

  beforeAll(async () => {
    result = await call(levelsRoute, undefined)
  })

  it('returns all levels with correct metadata', () => {
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

  it('returns accurate question counts', () => {
    for (const level of result) {
      const sourceLevel = levels.find((l) => l.id === level.id)!
      expect(level.questionCount).toBe(sourceLevel.questions.length)
    }
  })

  it('does not expose the color field', () => {
    for (const level of result) {
      expect(level).not.toHaveProperty('color')
    }
  })
})
