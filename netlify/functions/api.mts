import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { experimental_ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { levelsRoute } from './api/levels.mjs'
import { playRoute } from './api/play.mjs'
import { questionsRoute } from './api/questions.mjs'

const GAME_STATE_COOKIE = 'gameState'

const router = {
  levels: levelsRoute,
  questions: questionsRoute,
  play: playRoute,
}

const openAPIHandler = new OpenAPIHandler(router, {
  plugins: [
    new experimental_ZodSmartCoercionPlugin(),
    new OpenAPIReferencePlugin({
      docsProvider: 'scalar',
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: 'Syntax Quiz API',
          version: '1.0.0',
          description: 'Retrieve quiz questions and levels for the Syntax Quiz game',
        },
        servers: [{ url: '/api' }],
      },
    }),
  ],
})

const app = new Hono()

// No client caching; Netlify CDN caches GET responses until next deploy (auto-purged on each deploy)
app.use('/*', async (c, next) => {
  await next()
  if (c.req.method === 'GET') {
    c.res.headers.set('Cache-Control', 'no-store')
    c.res.headers.set('Netlify-CDN-Cache-Control', 'public, max-age=31536000')
  }
})

app.all('/*', async (c) => {
  const url = new URL(c.req.url)
  const isPlayAnswer = c.req.method === 'POST' && url.pathname === '/api/play/answer'
  const isPlay = c.req.method === 'POST' && url.pathname.startsWith('/api/play/')

  // Cookie convenience layer for play endpoints — allows playing via Scalar without manual copy-paste.
  // If the answer request body omits gameState, inject it from the cookie before forwarding to oRPC.
  let request = c.req.raw
  if (isPlayAnswer) {
    try {
      const body = await request.clone().json()
      if (!body.gameState) {
        const cookie = getCookie(c, GAME_STATE_COOKIE)
        if (cookie) {
          body.gameState = cookie
          request = new Request(request, {
            body: JSON.stringify(body),
            headers: request.headers,
          })
        }
      }
    } catch {
      // Not valid JSON — let oRPC handle the error
    }
  }

  const { matched, response } = await openAPIHandler.handle(request, {
    prefix: '/api',
    context: {},
  })

  if (!matched) return c.notFound()

  // After oRPC responds, sync the cookie with the gameState in the response body.
  if (isPlay && response!.ok) {
    const resBody = await response!.json()
    if (resBody.gameState) {
      setCookie(c, GAME_STATE_COOKIE, resBody.gameState, {
        path: '/api/play',
        httpOnly: true,
        sameSite: 'Strict',
      })
    } else {
      deleteCookie(c, GAME_STATE_COOKIE, { path: '/api/play' })
    }
    return c.json(resBody)
  }

  return response!
})

export default (request: Request) => app.fetch(request)
