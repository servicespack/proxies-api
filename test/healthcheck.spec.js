import request from 'supertest'
import { beforeEach, describe, it } from '@jest/globals'

import { loadServer } from './helpers/load-server.js'

describe('Healthcheck', () => {
  /**
   * @type {import('http').Server}
   */
  let server

  beforeEach(async () => {
    server = await loadServer()
  })

  it('Should return the healthcheck correctly', () => {
    return request(server)
      .get('/')
      .expect(200, {
        I: 'am alive'
      })
  })
})
