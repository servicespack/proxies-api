import { createRequire } from 'node:module';

import { Router } from 'express';
import swaggerUI from 'swagger-ui-express';

const require = createRequire(import.meta.url);

const packageJson = require('../../package.json');
const swaggerJson = require('../swagger.json');

const router = Router();

const { ENABLE_SWAGGER = 'true' } = process.env;

if (ENABLE_SWAGGER === 'true') {
  router
    .use(
      swaggerUI.serve,
      swaggerUI.setup({
        ...swaggerJson,
        info: {
          ...swaggerJson.info,
          version: packageJson.version,
        },
        servers: [
          ...swaggerJson.servers,
          {
            url: 'http://localhost:3000',
          },
        ],
      }),
    );
}

export const docs = router;
