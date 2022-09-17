/**
 * @param {Object} params
 * @param {String} params.token
 */
export function auth (params) {
  /**
   * @param {import('express').Request} request
   * @param {import('express').Response} _response
   * @param {import('express').NextFunction} next
   */
  return function (request, response, next) {
    const { token } = request.query
    if (token !== params.token) {
      return response.status(401).json({
        error: 'Unauthorized'
      })
    }

    return next()
  }
}
