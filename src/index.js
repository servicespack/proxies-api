import { db } from './db.js'
import { logger } from './logger.js'
import { server } from './server.js'

async function main () {
  const { PORT } = process.env

  await db.read()
  db.data ||= { proxies: [] }
  await db.write()

  server.listen(PORT, () => logger.info(`Listening on ${PORT}`))
}

main()
