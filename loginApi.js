
const express = require('express');
const { validationResult } = require('express-validator');
const { validateLoginInput } = require('./validators');
const { generateToken, verifyUser } = require('./auth');
const { logAuditEvent } = require('./auditLogger');
const ApiResponse = require('./ApiResponse');

const router = express.Router();

// POST /api/login
router.post(
  '/api/login',
  validateLoginInput,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logAuditEvent('LOGIN_FAILED', req.body.username, 'Validation error');
      return res.status(400).json(ApiResponse.error('Invalid input', errors.array()));
    }

    const { username, password } = req.body;
    try {
      const user = await verifyUser(username, password);
      if (!user) {
        logAuditEvent('LOGIN_FAILED', username, 'Invalid credentials');
        return res.status(401).json(ApiResponse.error('Invalid credentials'));
      }
      const token = generateToken(user);
      logAuditEvent('LOGIN_SUCCESS', username, 'User logged in');
      return res.json(ApiResponse.success({ token, user: { id: user.id, username: user.username } }));
    } catch (err) {
      logAuditEvent('LOGIN_ERROR', username, err.message);
      return res.status(500).json(ApiResponse.error('Internal server error'));
    }
  }
);

module.exports = router;
