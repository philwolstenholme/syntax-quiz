import { call } from '@orpc/server'
import { describe, expect, it } from 'vitest'
import type { Question } from '../../../src/data/questions.js'
import { levels } from '../../../src/data/questions.js'
import { BASE_SCORE_POINTS, playRoute } from './play.mjs'
import { flattenCode } from './payloads.mjs'

const dummyRequest = new Request('http://localhost')

/** Find the source question matching an API play question by code + highlight + question text. */
function findSourceQuestion(
  levelId: number,
  playQ: { code: string; highlight: string; question: string },
): Question {
  const levelData = levels.find((l) => l.id === levelId)!
  const match = levelData.questions.find(
    (q) => flattenCode(q.code) === playQ.code && q.highlight === playQ.highlight && q.question === playQ.question,
  )
  if (!match) throw new Error('Could not find matching source question')
  return match
}

describe('POST /play/start', () => {
  it('returns a first question, gameState, and initial progress', async () => {
    const result = await call(playRoute.start, { level: 1 }, { context: { request: dummyRequest } })

    expect(result.gameState).toBeTypeOf('string')
    expect(result.question).toMatchObject({
      code: expect.any(String),
      highlight: expect.any(String),
      question: expect.any(String),
      answers: expect.any(Array),
    })
    expect(result.question.answers).toHaveLength(4)
    expect(result.question.code).not.toContain('\n')
    expect(result.progress).toMatchObject({
      score: 0,
      streak: 0,
      correctAnswers: 0,
      totalQuestions: levels[0]!.questions.length,
      questionsRemaining: levels[0]!.questions.length,
      isRetryRound: false,
    })
  })

  it('rejects an invalid level', async () => {
    await expect(
      call(playRoute.start, { level: 99 }, { context: { request: dummyRequest } }),
    ).rejects.toThrow()
  })
})

describe('POST /play/answer', () => {
  async function startGame(level = 1) {
    return call(playRoute.start, { level }, { context: { request: dummyRequest } })
  }

  it('accepts a correct answer via gameState in request body', async () => {
    const { gameState, question } = await startGame()
    const sourceQ = findSourceQuestion(1, question)

    const result = await call(
      playRoute.answer,
      { gameState, answer: sourceQ.correct },
      { context: { request: dummyRequest } },
    )

    expect(result.feedback.correct).toBe(true)
    expect(result.feedback.skipped).toBe(false)
    expect(result.feedback.correctAnswer).toBe(sourceQ.correct)
    expect(result.feedback.userAnswer).toBe(sourceQ.correct)
    expect(result.feedback.pointsEarned).toBe(BASE_SCORE_POINTS) // first correct = 10 * (0 + 1)
    expect(result.progress.score).toBe(BASE_SCORE_POINTS)
    expect(result.progress.streak).toBe(1)
    expect(result.progress.correctAnswers).toBe(1)
    expect(result.complete).toBe(false)
  })

  it('accepts gameState from a cookie when body gameState is omitted', async () => {
    const { gameState, question } = await startGame()
    const sourceQ = findSourceQuestion(1, question)

    const requestWithCookie = new Request('http://localhost', {
      headers: { cookie: `gameState=${gameState}` },
    })

    const result = await call(
      playRoute.answer,
      { answer: sourceQ.correct },
      { context: { request: requestWithCookie } },
    )

    expect(result.feedback.correct).toBe(true)
    expect(result.progress.streak).toBe(1)
  })

  it('falls back to cookie when gameState is an empty string', async () => {
    const { gameState, question } = await startGame()
    const sourceQ = findSourceQuestion(1, question)

    const requestWithCookie = new Request('http://localhost', {
      headers: { cookie: `gameState=${gameState}` },
    })

    const result = await call(
      playRoute.answer,
      { gameState: '', answer: sourceQ.correct },
      { context: { request: requestWithCookie } },
    )

    expect(result.feedback.correct).toBe(true)
  })

  it('handles an incorrect answer', async () => {
    const { gameState, question } = await startGame()
    const sourceQ = findSourceQuestion(1, question)
    const wrongAnswer = question.answers.find((a) => a !== sourceQ.correct)!

    const result = await call(
      playRoute.answer,
      { gameState, answer: wrongAnswer },
      { context: { request: dummyRequest } },
    )

    expect(result.feedback.correct).toBe(false)
    expect(result.feedback.skipped).toBe(false)
    expect(result.feedback.pointsEarned).toBe(0)
    expect(result.progress.streak).toBe(0)
    expect(result.progress.correctAnswers).toBe(0)
  })

  it('handles a skip (answer: null)', async () => {
    const { gameState } = await startGame()

    const result = await call(
      playRoute.answer,
      { gameState, answer: null },
      { context: { request: dummyRequest } },
    )

    expect(result.feedback.correct).toBe(false)
    expect(result.feedback.skipped).toBe(true)
    expect(result.feedback.userAnswer).toBeNull()
    expect(result.feedback.pointsEarned).toBe(0)
    expect(result.progress.streak).toBe(0)
  })

  it('builds a streak multiplier for consecutive correct answers', async () => {
    let { gameState, question } = await startGame()
    let expectedScore = 0

    // Answer 3 questions correctly in a row
    for (let i = 0; i < 3; i++) {
      const sourceQ = findSourceQuestion(1, question)
      const result = await call(
        playRoute.answer,
        { gameState, answer: sourceQ.correct },
        { context: { request: dummyRequest } },
      )
      // streak was i before answering, so points = 10 * (i + 1)
      expect(result.feedback.pointsEarned).toBe(BASE_SCORE_POINTS * (i + 1))
      expect(result.progress.streak).toBe(i + 1)
      expectedScore += BASE_SCORE_POINTS * (i + 1)
      expect(result.progress.score).toBe(expectedScore)
      if (!result.complete) {
        gameState = result.gameState!
        question = result.question!
      }
    }
  })

  it('resets streak on incorrect answer', async () => {
    let { gameState, question } = await startGame()

    // Answer correctly first
    const sourceQ = findSourceQuestion(1, question)
    const r1 = await call(
      playRoute.answer,
      { gameState, answer: sourceQ.correct },
      { context: { request: dummyRequest } },
    )
    expect(r1.progress.streak).toBe(1)

    // Answer incorrectly
    const nextSourceQ = findSourceQuestion(1, r1.question!)
    const wrongAnswer = r1.question!.answers.find((a) => a !== nextSourceQ.correct)!
    const r2 = await call(
      playRoute.answer,
      { gameState: r1.gameState!, answer: wrongAnswer },
      { context: { request: dummyRequest } },
    )
    expect(r2.progress.streak).toBe(0)
  })

  it('completes a full game with retry round', async () => {
    let { gameState, question } = await startGame()
    const totalQuestions = levels[0]!.questions.length

    // Skip the first question so it goes to retry
    let result = await call(
      playRoute.answer,
      { gameState, answer: null },
      { context: { request: dummyRequest } },
    )
    gameState = result.gameState!
    question = result.question!

    // Answer remaining questions correctly
    for (let i = 1; i < totalQuestions; i++) {
      const sourceQ = findSourceQuestion(1, question)
      result = await call(
        playRoute.answer,
        { gameState, answer: sourceQ.correct },
        { context: { request: dummyRequest } },
      )
      if (!result.complete) {
        gameState = result.gameState!
        question = result.question!
      }
    }

    // Should now be in retry round with 1 question
    expect(result.complete).toBe(false)
    expect(result.progress.isRetryRound).toBe(true)
    expect(result.progress.questionsRemaining).toBe(1)

    // Answer the retry question correctly
    const retryQ = findSourceQuestion(1, question)
    result = await call(
      playRoute.answer,
      { gameState, answer: retryQ.correct },
      { context: { request: dummyRequest } },
    )

    expect(result.complete).toBe(true)
    expect(result.gameState).toBeNull()
    expect(result.question).toBeNull()
    expect(result.progress.questionsRemaining).toBe(0)
    expect(result.progress.correctAnswers).toBe(totalQuestions)
  })

  it('rejects when no gameState is provided at all', async () => {
    await expect(
      call(playRoute.answer, { answer: 'test' }, { context: { request: dummyRequest } }),
    ).rejects.toThrow(/[Mm]issing game state/)
  })

  it('rejects an invalid gameState', async () => {
    await expect(
      call(
        playRoute.answer,
        { gameState: 'not-valid-base64-state', answer: 'test' },
        { context: { request: dummyRequest } },
      ),
    ).rejects.toThrow(/[Ii]nvalid game state/)
  })
})
