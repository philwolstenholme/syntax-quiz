import { JSON_SCHEMA_INPUT_REGISTRY } from '@orpc/zod/zod4'
import { z } from 'zod'

// Runtime: smart coercion converts "1" → 1 from query params
// OpenAPI: registry override adds enum so Scalar shows a dropdown
export const levelParamSchema = z
  .number()
  .int()
  .min(1)
  .max(3)
  .describe('Level number (1 = Easy, 2 = Medium, 3 = Hard)')
JSON_SCHEMA_INPUT_REGISTRY.add(levelParamSchema, { type: 'integer', enum: [1, 2, 3] })

export const LevelMetaSchema = z.object({
  id: z.number().int().min(1).max(3),
  name: z.string(),
  subtitle: z.string(),
  description: z.string(),
  questionCount: z.number().int().min(0),
})

export const QuestionSchema = z.object({
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

export const PlayQuestionSchema = z.object({
  code: z.string(),
  highlight: z.string(),
  question: z.string(),
  answers: z.array(z.string()),
})

export const FeedbackSchema = z.object({
  correct: z.boolean(),
  skipped: z.boolean(),
  correctAnswer: z.string(),
  userAnswer: z.string().nullable(),
  explanation: z.string(),
  docsLink: z.string().url().optional(),
  pointsEarned: z.number().int(),
})

export const ProgressSchema = z.object({
  score: z.number().int(),
  streak: z.number().int(),
  correctAnswers: z.number().int(),
  totalQuestions: z.number().int(),
  questionsRemaining: z.number().int(),
  isRetryRound: z.boolean(),
})
