import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * @returns {import('lowdb').Low}
 */
export const loadDb = async () => {
  const { db } = await import(
    join(__dirname, '..', '..', 'src', `db.js?time=${Date.now()}`)
  )

  await db.read()
  db.data ||= { proxies: [] }
  await db.write()

  return db
}
