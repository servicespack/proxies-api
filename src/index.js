import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import pino from 'pino-http'
import proxy from 'express-http-proxy'

import { Routers } from './routers/index.js'
import { auth } from './middlewares/auth.middleware.js'
import { db } from './db.js'
import { logger } from './logger.js'

async function main () {
  const { PORT, TOKEN } = process.env

  await db.read()
  db.data ||= { proxies: [] }
  await db.write()

  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(helmet())
  app.use(pino({
    ...process.env.NODE_ENV !== 'production'
      ? {
          transport: {
            target: 'pino-pretty'
          }
        }
      : {}
  }))

  app.get('/health', (_request, response) => response.json({ I: 'am alive' }))
  app.use('/proxies', auth({ token: TOKEN }), Routers.proxies)
  app.use('/:namespace', proxy(request => {
    const { target } = db
      .data
      .proxies
      .find(({ namespace }) => namespace === request.params.namespace)

    return target
  }))
  app.use('/', Routers.docs)

  app.listen(PORT, () => logger.info(`Listening on ${PORT}`))
}

main()
