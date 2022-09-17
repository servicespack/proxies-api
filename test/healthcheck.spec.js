import request from 'supertest'
import { beforeEach, describe, it } from '@jest/globals'
import {  } from 'module'

import { loadApp } from './helpers/load-app.js'

describe('Healthcheck', () => {
  /**
   * @type {import('express').Express}
   */
  let app

  beforeEach(async () => {
    app = await loadApp()
  })

  it('Should return the healthcheck correctly', () => {
    return request(app)
      .get('/')
      .expect(200, {
        I: 'am alive'
      })
  })
})
