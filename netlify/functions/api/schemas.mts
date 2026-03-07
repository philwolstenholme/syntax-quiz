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
  code: z.string().describe('The code snippet to display'),
  highlight: z.string().describe('The portion of the code to highlight'),
  question: z.string().describe('The question to ask about the highlighted code'),
  answers: z.array(z.string()).describe('Four shuffled answer choices — exactly one is correct'),
})

export const FeedbackSchema = z.object({
  correct: z.boolean().describe('Whether the submitted answer was correct'),
  skipped: z.boolean().describe('Whether the question was skipped (answer was null)'),
  correctAnswer: z.string().describe('The correct answer for this question'),
  userAnswer: z.string().nullable().describe('The answer that was submitted, or null if skipped'),
  explanation: z.string().describe('An explanation of why the correct answer is correct'),
  docsLink: z.string().url().optional().describe('Link to relevant documentation'),
  pointsEarned: z.number().int().min(0).describe('Points earned for this answer (0 if wrong or skipped)'),
})

export const ProgressSchema = z.object({
  score: z.number().int().min(0).describe('Cumulative score'),
  streak: z.number().int().min(0).describe('Current consecutive correct answer streak'),
  correctAnswers: z.number().int().min(0).describe('Total number of questions answered correctly'),
  totalQuestions: z.number().int().min(0).describe('Total number of questions in this level'),
  questionsRemaining: z.number().int().min(0).describe('Number of questions left to answer in this pass'),
  isRetryRound: z.boolean().describe('True if this is a retry round for previously missed questions'),
})
