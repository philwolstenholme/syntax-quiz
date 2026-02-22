# Quiz Questions

Guidelines for writing and editing quiz questions in `src/data/questions.ts`.

## Question structure

Each question follows the `Question` interface:

```ts
interface Question {
  code: string;        // Code snippet shown to the user
  highlight: string;   // Substring of `code` that gets visually highlighted
  question: string;    // The question prompt
  correct: string;     // The correct answer (must appear in options)
  options: string[];   // Exactly 4 answer choices, correct answer first
  hint: string;        // Clue shown when the user requests a hint
  explanation: string; // Shown after answering — see writing guide below
}
```

## Levels

Questions belong to one of three difficulty levels in the `levels` array:

- **Level 1 (Easy)** — Basic syntax fundamentals (variable names, bracket types, simple methods)
- **Level 2 (Medium)** — Intermediate concepts (generics, destructuring, closures, React hooks)
- **Level 3 (Hard)** — Advanced TypeScript (conditional types, mapped types, `infer`, type predicates)

## Writing the `code` field

- Use template literals (backtick strings) for multi-line code
- Keep snippets short and focused — just enough to show the concept
- Use realistic but simple variable names
- Escape inner backticks and `${}` expressions with backslashes when nesting inside JS template literals

## Writing the `highlight` field

- Must be an exact substring of `code` — the UI highlights this range
- Can span multiple lines
- Should isolate the specific syntax the question asks about

## Writing the `options` array

- Always exactly 4 options
- The correct answer must be the first element (it gets shuffled at runtime)
- Choose plausible distractors — terms the learner might genuinely confuse with the correct answer
- Prefer official JavaScript/TypeScript terminology over informal names

## Writing the `hint` field

- One sentence that nudges toward the answer without giving it away
- Point to a distinguishing feature or mental model
- Don't repeat the question or restate the options

## Writing the `explanation` field

The explanation is the most important educational content. It appears in the feedback banner after the user answers. Follow these principles:

### 1. Fully explain the correct answer first

Open by clearly defining the correct term/concept. Explain *why* it's the right answer in the context of the code shown. Reference the official JavaScript or TypeScript terminology.

### 2. Explain why each incorrect option is wrong

Address every distractor option and explain why it doesn't apply. This is critical for learning — students need to understand the boundaries between similar concepts. Explain what each wrong term *actually* means so the learner builds accurate mental models.

### 3. Use backticks around code references

Wrap any code or syntax references in backticks. These render as `<code>` elements with monospace styling in the UI. This includes:

- Method names: `filter()`, `Array.map()`, `useState`
- Operators and syntax: `=>`, `?.`, `??`, `||`, `...`, `${}`, `? :`
- Keywords and types: `var`, `const`, `null`, `undefined`, `never`, `void`, `this`, `extends`, `implements`
- Type syntax: `<T>`, `Array<number>`, `[P in keyof T]`, `T extends Type`
- Code patterns: `import React from 'react'`, `{ key: value }`, `const { name } = user`
- Naming convention examples: `userFirstName`, `user-first-name`
- Values: `true`, `false`, `0`, `''`

Do **not** use backticks around concept names that aren't code (e.g., "closure", "hoisting", "pure function" are prose, not code).

### 4. Use literal em dashes

Use the literal `—` character, not the `\u2014` escape sequence.

### 5. Tone and style

- Authoritative but conversational
- 2–4 sentences typical length
- Mention what language a term comes from when a distractor is borrowed from another language (e.g., "'Typedef' is C/C++ terminology")
- Use single quotes around distractor terms being discussed as words (e.g., 'placeholder', 'unpacking')

### Example explanation

```
"`Array.find()` returns the first element that satisfies the test function, then stops iterating. It doesn't return all matches (that's `filter()`), a boolean (that's `some()` or `every()`), or an index (that's `findIndex()`). If no element matches, `find()` returns `undefined`."
```

Notice how it: defines `find()`, then explains why each of the three wrong answers is wrong, referencing the correct method for each.

## MDN links

The correct answer term is automatically linked to MDN in the feedback banner. Direct MDN URLs are configured in `src/utils/mdnLinks.ts`. If no direct mapping exists, a Google search fallback is used. When adding a new question, check if the correct answer term needs a direct MDN URL added to the `mdnPages` map.

## Scoring and hints

Relevant constants from `src/constants.ts`:

- `BASE_SCORE_POINTS = 10` — base points per correct answer
- `HINT_SCORE_PENALTY = 0.5` — multiplier per hint used (compounds: 1 hint = 0.5x, 2 hints = 0.25x)
- `MAX_HINTS = 2` — maximum hints per question
- `HINTS_TO_ELIMINATE = 2` — number of wrong options eliminated on first hint

The second hint reveals the text `hint` field. This means the hint should still be useful even after 2 wrong options are eliminated.
