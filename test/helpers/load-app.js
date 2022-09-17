import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * @returns {import('express').Express}
 */
export const loadApp = async () => {
  const { app } = await import(
    join(__dirname, '..', '..', 'src', `app.js?time=${Date.now()}`)
  )
  return app
}
