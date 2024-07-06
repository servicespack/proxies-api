import { faker } from '@faker-js/faker';
import request from 'supertest';

import { loadDb } from './helpers/load-db';
import { loadServer } from './helpers/load-server';

describe('Proxies CRUD', () => {
  /**
   * @type {import('http').Server}
   */
  let server;
  /**
   * @type {import('lowdb').Low}
   */
  let db;

  beforeEach(async () => {
    process.env = {
      ...process.env,
      TOKEN: faker.lorem.word(),
    };

    server = await loadServer();
    db = await loadDb();

    console.log(db);
  });

  describe('POST /proxies', () => {
    it('Should return status code 201', async () => {
      const namespace = faker.internet.domainWord();
      const target = faker.internet.url();

      const { body, status } = await request(server)
        .post(`/proxies?token=${process.env.TOKEN}`)
        .send({
          namespace,
          target,
        });

      expect(status).toBe(201);
      expect(body).toEqual({
        id: expect.any(String),
        namespace,
        target,
        createdAt: expect.any(String),
      });
    });
  });
});
