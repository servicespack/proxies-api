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

    ProxiesEmitter.emitter.emit(ProxiesEmitter.Events.NEW_PROXY, proxy)
    return response.status(201).json(proxy)
  })
  .get('/:proxyId', (request, response) => {
    const { proxyId } = request.params
    const proxy = db.data.proxies.find(({ id }) => id === proxyId)

    if (!proxy) {
      return response.status(404).json({ error: 'Not found' })
    }

    return response.json(proxy)
  })
  .patch('/:proxyId', async (request, response) => {
    const { proxyId } = request.params
    const proxyIndex = db.data.proxies.findIndex(({ id }) => id === proxyId)
    const NOT_FOUND_INDEX = -1

    if (proxyIndex === NOT_FOUND_INDEX) {
      return response.status(404).json({ error: 'Not found' })
    }

    db.data.proxies = db.data.proxies.map(({ id, ...rest }) => {
      if (id === proxyId) {
        return {
          ...rest,
          ...request.body,
          id
        }
      }

      return { id, ...rest }
    })
    await db.write()

    const proxy = db.data.proxies[proxyIndex]
    ProxiesEmitter.emitter.emit(ProxiesEmitter.Events.UPDATED_PROXY, proxy)
    return response.json(proxy)
  })
  .delete('/:proxyId', async (request, response) => {
    const { proxyId } = request.params
    const proxy = db.data.proxies.find(({ id }) => id === proxyId)

    if (!proxy) {
      return response.status(404).json({ error: 'Not found' })
    }

    db.data.proxies = db.data.proxies.filter(({ id }) => id !== proxyId)
    await db.write()

    ProxiesEmitter.emitter.emit(ProxiesEmitter.Events.DELETED_PROXY, proxy)
    return response.json(proxy)
  })

export const proxies = router