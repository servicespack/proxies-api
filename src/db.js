import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { JSONFile, Low } from 'lowdb'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const db = new Low(
  new JSONFile(
    join(__dirname, '..', 'config.json')
  )
)
