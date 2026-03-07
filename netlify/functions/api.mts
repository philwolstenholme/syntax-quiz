import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { experimental_ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { Hono } from 'hono'
import { levelsRoute } from './api/levels.mjs'
import { playRoute } from './api/play.mjs'
import { questionsRoute } from './api/questions.mjs'

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
  const { matched, response } = await openAPIHandler.handle(c.req.raw, {
    prefix: '/api',
    context: {},
  })
  if (matched) return response!
  return c.notFound()
})

export default (request: Request) => app.fetch(request)
