import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

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
