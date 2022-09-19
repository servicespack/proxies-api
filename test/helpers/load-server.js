import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * @returns {import('http').Server}
 */
export const loadServer = async () => {
  const { server } = await import(
    join(__dirname, '..', '..', 'src', `server.js?time=${Date.now()}`)
  )
  return server
}
