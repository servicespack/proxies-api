import request from 'supertest'
import { beforeEach, describe, it } from '@jest/globals'
import { faker } from '@faker-js/faker'

import { loadApp } from './helpers/load-app'
import { loadDb } from './helpers/load-db'

describe.skip('Proxies CRUD', () => {
  /**
   * @type {import('express').Express}
   */
  let app
  /**
   * @type {import('lowdb').Low}
   */
  let db

  beforeEach(async () => {
    process.env = {
      ...process.env,
      TOKEN: faker.lorem.word()
    }

    app = await loadApp()
    db = await loadDb()
  })

  describe('POST /proxies', () => {
    it('Should return status code 201', () => {
      return request(app)
        .post(`/proxies?token=${process.env.TOKEN}`)
        .send({
          namespace: faker.internet.domainWord(),
          target: faker.internet.url()
        })
        .expect(201, {})
    })
  })
})
