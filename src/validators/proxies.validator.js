import { body } from 'express-validator'

import { validation } from '../middlewares/validation.middleware.js'

export class ProxiesValidator {
  static create = [
    body('namespace').exists().isString(),
    body('target').exists().isURL(),
    validation
  ]

  static update = [
    body('namespace').optional().isString(),
    body('target').optional().isURL(),
    validation
  ]
}
