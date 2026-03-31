import type { Level } from '../../../src/data/questions.js'

/** Collapse multi-line code snippets to a single line for JSON responses. */
export function flattenCode(code: string): string {
  return code.replaceAll('\n', ' ')
}

export function buildLevelsPayload(levels: Level[]) {
  return levels.map((l) => ({
    id: l.id,
    name: l.name,
    subtitle: l.subtitle,
    description: l.description,
    questionCount: l.questions.length,
  }))
}

export function buildQuestionsPayload(level: Level) {
  return level.questions.map((q) => ({
    code: flattenCode(q.code),
    highlight: q.highlight,
    question: q.question,
    answers: q.options,
    metadata: {
      correct: q.correct,
      hint: q.hint,
      explanation: q.explanation,
      ...(q.docsLink ? { docsLink: q.docsLink } : {}),
    },
  }))
}
