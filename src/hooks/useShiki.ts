import { createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import tsx from 'shiki/langs/tsx.mjs';
import githubDark from 'shiki/themes/github-dark.mjs';

export const highlighter = createHighlighterCoreSync({
  themes: [githubDark],
  langs: [tsx],
  engine: createJavaScriptRegexEngine(),
});
