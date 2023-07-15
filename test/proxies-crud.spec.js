import { faker } from '@faker-js/faker';
import request from 'supertest';

import { loadDb } from './helpers/load-db';
import { loadServer } from './helpers/load-server';

describe.skip('Proxies CRUD', () => {
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
    it('Should return status code 201', () => request(server)
      .post(`/proxies?token=${process.env.TOKEN}`)
      .send({
        namespace: faker.internet.domainWord(),
        target: faker.internet.url(),
      })
      .expect(201, {}));
  });
});
