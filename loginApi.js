import express from 'express';
import LoginService from './src/LoginService';
import ApiResponse from './src/ApiResponse';

const router = express.Router();
const loginService = new LoginService();


// Test login user: username: testuser, password: testpass
(async () => {
  const bcryptjs = await import('bcryptjs');
  loginService.users.push({ username: 'testuser', passwordHash: bcryptjs.hashSync('testpass', 10), role: 'user' });
})();

router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await loginService.login(username, password);
    res.json(ApiResponse.success({ token }, 'Login successful').toJSON());
  } catch (err) {
    res.status(401).json(ApiResponse.error('AUTH_ERROR', err.message, req.id).toJSON());
  }
});

export default router;
