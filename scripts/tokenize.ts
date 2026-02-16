/**
 * Pre-tokenizes all question code snippets with shiki at build time.
 * Run: npx tsx scripts/tokenize.ts
 *
 * Writes src/data/tokens.json with shape:
 *   { [code: string]: Array<Array<{ content: string; color?: string; offset: number }>> }
 */
import { createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import tsx from 'shiki/langs/tsx.mjs';
import githubDark from 'shiki/themes/github-dark.mjs';
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { level1Questions, level2Questions, level3Questions } from '../src/data/questions.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

const highlighter = createHighlighterCoreSync({
  themes: [githubDark],
  langs: [tsx],
  engine: createJavaScriptRegexEngine(),
});

interface MinimalToken {
  content: string;
  color?: string;
  offset: number;
}

const allQuestions = [...level1Questions, ...level2Questions, ...level3Questions];
const seen = new Set<string>();
const tokenMap: Record<string, MinimalToken[][]> = {};

for (const q of allQuestions) {
  if (seen.has(q.code)) continue;
  seen.add(q.code);

  const { tokens } = highlighter.codeToTokens(q.code, {
    lang: 'tsx',
    theme: 'github-dark',
  });

  tokenMap[q.code] = tokens.map((line) =>
    line.map((t) => {
      const tok: MinimalToken = { content: t.content, offset: t.offset };
      if (t.color) tok.color = t.color;
      return tok;
    }),
  );
}

const outPath = resolve(__dirname, '..', 'src', 'data', 'tokens.json');
writeFileSync(outPath, JSON.stringify(tokenMap));

const entries = Object.keys(tokenMap).length;
const bytes = Buffer.byteLength(JSON.stringify(tokenMap));
console.log(`Tokenized ${entries} snippets → ${(bytes / 1024).toFixed(1)} KB → ${outPath}`);
