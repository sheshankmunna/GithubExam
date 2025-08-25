import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});
function handleError(error, req, res, next) {
  const logMeta = {
    timestamp: new Date().toISOString(),
    errorType: error.name,
    stack: error.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    params: req.params
  };
  let statusCode = 500;
  let message = 'An unexpected error occurred.';
  let details = {};

  if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message || 'Validation failed.';
    logger.warn({ message, ...logMeta });
    if (error.details) {
      details = error.details;
    }
  } else if (error.name === 'BusinessLogicError') {
    statusCode = 422;
    message = error.message || 'The request could not be processed due to business rules.';
    logger.info({ message, ...logMeta });
  } else if (error.name === 'AuthenticationError') {
    statusCode = 401;
    message = error.message || 'Authentication failed.';
    logger.error({ message, ...logMeta });
  } else if (error.name === 'AuthorizationError') {
    statusCode = 403;
    message = error.message || 'Not authorized.';
    logger.error({ message, ...logMeta });
  } else if (error.name === 'PaymentNotFoundError') {
    statusCode = 404;
    message = error.message || 'Payment not found.';
    logger.error({ message, ...logMeta });
  } else if (error.name === 'PaymentError') {
    statusCode = 400;
    message = error.message || 'Payment error.';
    logger.error({ message, ...logMeta });
  } else if (error.name === 'SystemError') {
    statusCode = 500;
    message = 'Something went wrong. Please try again later.';
    logger.error({ message, error: error.message, stack: error.stack, ...logMeta });
  } else {
    statusCode = 500;
    message = 'Something went wrong. Please try again later.';
    logger.error({ message, error: error.message, stack: error.stack, ...logMeta });
  }

  if (error.details) {
    details = error.details;
  } else if (error.stack) {
    details = { stack: error.stack };
  }

  res.status(statusCode).json({
    success: false,
    errorCode: error.name || 'SystemError',
    message,
    details,
    timestamp: new Date().toISOString()
  });
}

export default handleError;
