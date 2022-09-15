import { app } from './app.js'
import { db } from './db.js'
import { logger } from './logger.js'

async function main () {
  const { PORT } = process.env

  await db.read()
  db.data ||= { proxies: [] }
  await db.write()

  app.listen(PORT, () => logger.info(`Listening on ${PORT}`))
}

main()
