class ValidationError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
  }
}

class BusinessLogicError extends Error {
  constructor(message, statusCode = 422) {
    super(message);
    this.name = 'BusinessLogicError';
    this.statusCode = statusCode;
  }
}

class SystemError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'SystemError';
    this.statusCode = statusCode;
  }
}
class PaymentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PaymentError';
  }
}

class PaymentNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PaymentNotFoundError';
  }
}
class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export { AuthenticationError, AuthorizationError, PaymentError, PaymentNotFoundError, ValidationError, BusinessLogicError, SystemError };
