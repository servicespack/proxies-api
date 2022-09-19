import { logger } from './logger.js'
import { server } from './server.js'

export async function cooldown () {
  logger.info('Shutting down Node Proxy')

  server.close(() => {
    process.exit(0)
  })
}
