import { call } from '@orpc/server'
import { describe, expect, it } from 'vitest'
import { levels } from '../../../src/data/questions.js'
import { questionsRoute } from './questions.mjs'

describe('GET /questions', () => {
  it('returns all questions for a valid level', async () => {
    const result = await call(questionsRoute, { level: 1 })

    const sourceLevel = levels.find((l) => l.id === 1)!
    expect(result).toHaveLength(sourceLevel.questions.length)
  })

  it('returns questions with the correct shape', async () => {
    const result = await call(questionsRoute, { level: 1 })

    for (const q of result) {
      expect(q).toMatchObject({
        code: expect.any(String),
        highlight: expect.any(String),
        question: expect.any(String),
        answers: expect.any(Array),
        metadata: {
          correct: expect.any(String),
          hint: expect.any(String),
          explanation: expect.any(String),
        },
      })
      expect(q.answers.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('includes the correct answer in the answers array', async () => {
    const result = await call(questionsRoute, { level: 1 })

    for (const q of result) {
      expect(q.answers).toContain(q.metadata.correct)
    }
  })

  it('returns questions for all three levels', async () => {
    for (const level of [1, 2, 3]) {
      const result = await call(questionsRoute, { level })
      const sourceLevel = levels.find((l) => l.id === level)!
      expect(result).toHaveLength(sourceLevel.questions.length)
    }
  })

  it('rejects an invalid level', async () => {
    await expect(call(questionsRoute, { level: 99 })).rejects.toThrow()
  })
})
