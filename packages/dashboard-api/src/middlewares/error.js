const debug = require('debug')('app');
const Boom = require('@hapi/boom');

function errorHandlerMiddleware(logger) {
  // eslint-disable-next-line no-unused-vars
  return function (error, request, response, next) {
    debug(error);
    logger.error(error);

    // Failed to authenticate with JWT by express-jwt.
    if (error.name && 'UnauthorizedError' === error.name) {
      return response.status(401).json({
        error: {
          code: UserError.AccessDenied,
          message: error.message
        }
      });
    }

    if (Boom.isBoom(error)) {
      let payload = error.output.payload;

      response.status(payload.statusCode).json({
        error: {
          code: UserError.UnknownError,
          message: payload.message
        }
      });
    } else {
      response.status(500).json({
        error: {
          code: UserError.UnknownError,
          message: error.message
        }
      });
    }
  };
}

module.exports = errorHandlerMiddleware;
