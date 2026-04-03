import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import tsxLang from 'shiki/langs/tsx.mjs'
import githubDark from 'shiki/themes/github-dark.mjs'
import githubLight from 'shiki/themes/github-light.mjs'
import { levels } from './src/data/questions'

// WCAG AA contrast helpers — used to ensure syntax token colors meet 4.5:1 ratio
function srgbToLinear(c: number): number {
  c = c / 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
}

/**
 * Darkens a hex color (towards black) until it achieves the target contrast
 * ratio against the given background luminance. Used to ensure WCAG AA
 * compliance for syntax-highlight token colours on light backgrounds.
 */
function enforceContrastOnLightBg(hex: string, bgLuminance = 0.9560, minRatio = 4.5): string {
  if (!hex || hex.length < 7 || !hex.startsWith('#')) return hex
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const fgL = relativeLuminance(r, g, b)
  if ((bgLuminance + 0.05) / (fgL + 0.05) >= minRatio) return hex
  // Scale towards black in small steps until the ratio passes
  for (let scale = 0.99; scale >= 0; scale -= 0.005) {
    const nr = Math.round(r * scale)
    const ng = Math.round(g * scale)
    const nb = Math.round(b * scale)
    if ((bgLuminance + 0.05) / (relativeLuminance(nr, ng, nb) + 0.05) >= minRatio) {
      return '#' + [nr, ng, nb].map(v => v.toString(16).padStart(2, '0')).join('')
    }
  }
  return '#000000'
}

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

  const allQuestions = levels.flatMap((l) => l.questions)
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
    lightTokenMap[q.code] = processTokens('github-light').map((line) =>
      line.map((tok) => ({
        ...tok,
        ...(tok.color ? { color: enforceContrastOnLightBg(tok.color) } : {}),
      })),
    )
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
