import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { experimental_ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { Hono } from 'hono'
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

// Cookie convenience layer for play endpoints — allows playing via Scalar without manual copy-paste.
// If the request body omits gameState, inject it from the cookie before forwarding to oRPC.
// After oRPC responds, sync the cookie with the gameState in the response body.
app.post('/play/answer', async (c, next) => {
  const body = await c.req.json()
  if (!body.gameState) {
    const cookie = getCookie(c, GAME_STATE_COOKIE)
    if (cookie) {
      body.gameState = cookie
      // Replace the request with the patched body so oRPC sees it
      const patchedRequest = new Request(c.req.raw, {
        body: JSON.stringify(body),
        headers: c.req.raw.headers,
      })
      // Swap out the raw request on the context
      c.req.raw = patchedRequest
    }
  }
  await next()
})

app.post('/play/*', async (c, next) => {
  await next()
  if (!c.res.ok) return

  const resBody = await c.res.json()
  const newRes = c.newResponse(JSON.stringify(resBody), c.res)

  if (resBody.gameState) {
    setCookie(c, GAME_STATE_COOKIE, resBody.gameState, {
      path: '/api/play',
      httpOnly: true,
      sameSite: 'Strict',
    })
  } else {
    deleteCookie(c, GAME_STATE_COOKIE, { path: '/api/play' })
  }

  c.res = newRes
})

app.all('/*', async (c) => {
  const { matched, response } = await openAPIHandler.handle(c.req.raw, {
    prefix: '/api',
    context: {},
  })
  if (matched) return response!
  return c.notFound()
})

export default (request: Request) => app.fetch(request)
