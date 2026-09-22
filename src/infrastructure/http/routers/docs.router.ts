import { Router } from 'express';
import swaggerUI from 'swagger-ui-express';

import packageJson from '../../../../package.json';
import swaggerJson from '../../../docs/swagger.json';

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
