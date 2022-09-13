import { createRequire } from 'module'
import { join } from 'path'

import swaggerUI from 'swagger-ui-express'
import { Router } from 'express'

const require = createRequire(import.meta.url)

const packageJson = require(join('..', '..', 'package.json'))
const swaggerJson = require(join('..', 'swagger.json'))

const router = Router()

if (process.env.ENABLE_SWAGGER === 'true') {
  router
    .use(
      swaggerUI.serve,
      swaggerUI.setup({
        ...swaggerJson,
        info: {
          ...swaggerJson.info,
          version: packageJson.version
        },
        servers: [
          ...swaggerJson.servers,
          {
            url: 'http://localhost:3000'
          }
        ]
      })
    )
}

export const docs = router
