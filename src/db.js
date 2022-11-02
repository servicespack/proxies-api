import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const db = new Low(
  new JSONFile(
    join(__dirname, '..', 'config.json')
  )
)
