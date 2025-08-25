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
import { PaymentError, PaymentNotFoundError } from './errors';
class PaymentNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PaymentNotFoundError';
  }
}
class PaymentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PaymentError';
  }
}
import axios from 'axios';
import axiosRetry from 'axios-retry';

const API_BASE_URL = process.env.PAYMENT_API_BASE_URL;
const API_KEY = process.env.PAYMENT_API_KEY;
const TIMEOUT = process.env.PAYMENT_API_TIMEOUT || 5000;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error)
});
class PaymentService {
  async processPayment({ amount, currency, customerId, requestId, userId, correlationId }) {
    const logMeta = { timestamp: new Date().toISOString(), requestId, userId, correlationId };
    logger.info({ message: 'Process payment request', amount, currency, customerId, ...logMeta });
    try {
      const response = await axiosInstance.post('/payments', {
        amount,
        currency,
        customerId
      });
      const data = response.data;
      logger.info({ message: 'Process payment response', response: data, ...logMeta });
      return {
        transactionId: data.transactionId || data.id,
        status: data.status,
        amount: data.amount,
        currency: data.currency
      };
    } catch (error) {
      logger.error({ message: 'Process payment error', error: error.message, stack: error.stack, ...logMeta });
      throw new PaymentError(error.response?.data?.message || error.message || 'Payment processing failed');
    }
  }

  async refundPayment(transactionId, refundAmount, requestId, userId, correlationId) {
    const logMeta = { timestamp: new Date().toISOString(), requestId, userId, correlationId };
    logger.info({ message: 'Refund payment request', transactionId, refundAmount, ...logMeta });
    try {
      const response = await axiosInstance.post(`/payments/${transactionId}/refund`, {
        amount: refundAmount
      });
      const data = response.data;
      logger.info({ message: 'Refund payment response', response: data, ...logMeta });
      return {
        refundId: data.refundId || data.id,
        status: data.status,
        refundedAmount: data.refundedAmount || data.amount
      };
    } catch (error) {
      let message = 'Refund failed';
      if (error.response) {
        const apiMsg = error.response.data?.message || '';
        if (apiMsg.includes('invalid transaction')) {
          message = 'Invalid transaction ID. Please check and try again.';
          logger.error({ message, error: error.message, stack: error.stack, ...logMeta });
          throw new PaymentNotFoundError(message);
        } else if (apiMsg.includes('insufficient funds')) {
          message = 'Refund failed due to insufficient funds.';
        } else if (apiMsg) {
          message = apiMsg;
        }
      } else if (error.message) {
        message = error.message;
      }
      logger.error({ message, error: error.message, stack: error.stack, ...logMeta });
      throw new PaymentError(message);
    }
  }

  async checkPaymentStatus(transactionId, requestId, userId, correlationId) {
    const logMeta = { timestamp: new Date().toISOString(), requestId, userId, correlationId };
    logger.info({ message: 'Check payment status request', transactionId, ...logMeta });
    try {
      const response = await axiosInstance.get(`/payments/${transactionId}/status`);
      const data = response.data;
      logger.info({ message: 'Check payment status response', response: data, ...logMeta });
      return {
        transactionId: data.transactionId || data.id,
        status: data.status,
        lastUpdated: data.lastUpdated || data.updatedAt
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        logger.error({ message: 'Payment not found', transactionId, error: error.message, stack: error.stack, ...logMeta });
        throw new PaymentNotFoundError('Payment not found for the given transaction ID.');
      }
      logger.error({ message: 'Check payment status error', error: error.message, stack: error.stack, ...logMeta });
      throw new PaymentError(error.response?.data?.message || error.message || 'Failed to check payment status');
    }
  }
}

export default PaymentService;
