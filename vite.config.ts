import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import tsxLang from 'shiki/langs/tsx.mjs'
import githubDark from 'shiki/themes/github-dark.mjs'
import githubLight from 'shiki/themes/github-light.mjs'
import { level1Questions, level2Questions, level3Questions } from './src/data/questions'

/**
 * Vite plugin that pre-tokenizes all question code snippets with shiki
 * and serves the result as a virtual module (`virtual:tokens`).
 *
 * Both a dark (github-dark) and light (github-light) token map are generated
 * so the UI can switch syntax highlighting colour schemes with the theme.
 *
 * This runs at config-load time so tokens are available instantly in
 * both dev and production builds — no external script or generated file.
 */
function tokenizePlugin(): Plugin {
  const highlighter = createHighlighterCoreSync({
    themes: [githubDark, githubLight],
    langs: [tsxLang],
    engine: createJavaScriptRegexEngine(),
  })

  const allQuestions = [...level1Questions, ...level2Questions, ...level3Questions]
  const seen = new Set<string>()
  const darkTokenMap: Record<string, Array<Array<{ content: string; color?: string; offset: number }>>> = {}
  const lightTokenMap: Record<string, Array<Array<{ content: string; color?: string; offset: number }>>> = {}

  for (const q of allQuestions) {
    if (seen.has(q.code)) continue
    seen.add(q.code)

    const processTokens = (theme: string) =>
      highlighter.codeToTokens(q.code, { lang: 'tsx', theme }).tokens.map((line) =>
        line.map((t) => {
          const tok: { content: string; color?: string; offset: number } = {
            content: t.content,
            offset: t.offset,
          }
          if (t.color) tok.color = t.color
          return tok
        }),
      )

    darkTokenMap[q.code] = processTokens('github-dark')
    lightTokenMap[q.code] = processTokens('github-light')
  }

  const moduleCode = `export const darkTokenMap = ${JSON.stringify(darkTokenMap)};\nexport const lightTokenMap = ${JSON.stringify(lightTokenMap)};`

  return {
    name: 'tokenize-questions',
    resolveId(id) {
      if (id === 'virtual:tokens') return '\0virtual:tokens'
    },
    load(id) {
      if (id === '\0virtual:tokens') return moduleCode
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tokenizePlugin(),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  base: '/',
})
