import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { JSONFile, Low } from 'lowdb'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const db = new Low(
  new JSONFile(
    join(__dirname, '..', 'config.json')
  )
)
