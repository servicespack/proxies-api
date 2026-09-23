import { body } from 'express-validator';

import { validation } from '@/adapters/middlewares/validation.middleware.js';

export const proxiesValidator = {
  create: [
    body('namespace').exists().isString(),
    body('target').exists().isURL(),
    validation,
  ],
  update: [
    body('namespace').optional().isString(),
    body('target').optional().isURL(),
    validation,
  ],
};
