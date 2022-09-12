import { randomUUID } from 'crypto'

import { Router } from 'express'

import { ProxiesEmitter } from '../emitters/proxies.emitter.js'
import { db } from '../db.js'

const router = Router()

router
  .get('/', (_request, response) => {
    return response.json({
      data: db.data.proxies
    })
  })
  .post('/', async (request, response) => {
    const { namespace, target } = request.body

    const proxy = {
      id: randomUUID(),
      namespace,
      target,
      createdAt: new Date().toISOString()
    }
    db.data.proxies.push(proxy)
    await db.write()

    response.status(201).json(proxy)

    ProxiesEmitter.emitter.emit(ProxiesEmitter.Events.NEW_PROXY, proxy)
  })

export const proxies = router
