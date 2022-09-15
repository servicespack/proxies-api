import request from 'supertest'
import { describe, it } from '@jest/globals'

describe('healthcheck', () => {
  /**
   * @type {import('express').Express}
   */
  let app

  beforeEach(async () => {
    app = (await import('../src/app')).app
  })

  it('Should return the healthcheck', () => {
    return request(app)
      .get('/')
      .expect(200, {
        I: 'am alive'
      })
  })
})
