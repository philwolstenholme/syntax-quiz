import { useState, useEffect } from 'react';
import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

let instance: HighlighterCore | null = null;
let pending: Promise<HighlighterCore> | null = null;

export function preloadShiki(): void {
  if (!pending) {
    pending = createHighlighterCore({
      themes: [import('shiki/themes/github-dark.mjs')],
      langs: [import('shiki/langs/tsx.mjs')],
      engine: createJavaScriptRegexEngine(),
    }).then((h) => {
      instance = h;
      return h;
    });
  }
}

export function useShiki(): HighlighterCore | null {
  const [highlighter, setHighlighter] = useState<HighlighterCore | null>(instance);

  useEffect(() => {
    if (!instance) {
      preloadShiki();
      pending!.then(setHighlighter);
    }
  }, []);

  return highlighter;
}
