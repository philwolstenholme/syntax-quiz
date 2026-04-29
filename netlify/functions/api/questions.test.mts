import { call } from "@orpc/server";
import { beforeAll, describe, expect, it } from "vitest";
import { levels } from "../../../src/data/questions.js";
import { questionsRoute } from "./questions.mjs";

describe("GET /questions", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let level1Result: any[];

  beforeAll(async () => {
    level1Result = await call(questionsRoute, { level: 1 });
  });

  it("returns all questions for a valid level", () => {
    const sourceLevel = levels.find((l) => l.id === 1)!;
    expect(level1Result).toHaveLength(sourceLevel.questions.length);
  });

  it("returns questions with the correct shape", () => {
    for (const q of level1Result) {
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
      });
      expect(q.answers.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("flattens newlines in code snippets", () => {
    for (const q of level1Result) {
      expect(q.code).not.toContain("\n");
      expect(q.highlight).not.toContain("\n");
    }
  });

  it("includes the correct answer in the answers array", () => {
    for (const q of level1Result) {
      expect(q.answers).toContain(q.metadata.correct);
    }
  });

  it("returns questions for every available level", async () => {
    for (const level of levels) {
      const result = await call(questionsRoute, { level: level.id });
      const sourceLevel = levels.find((entry) => entry.id === level.id)!;
      expect(result).toHaveLength(sourceLevel.questions.length);
    }
  });

  it("rejects an invalid level", async () => {
    await expect(call(questionsRoute, { level: 99 })).rejects.toThrow();
  });
});
