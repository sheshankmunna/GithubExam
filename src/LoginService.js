import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError } from './errors';

const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRY = process.env.JWT_EXPIRY || '1h';

class LoginService {
  // Simulated user data for demonstration
  users = [
    { username: 'admin', passwordHash: bcrypt.hashSync('admin123', 10), role: 'admin' },
    { username: 'user', passwordHash: bcrypt.hashSync('user123', 10), role: 'user' }
  ];

  // Store blacklisted tokens in memory
  blacklistedTokens = new Set();

  roleHierarchy = ['user', 'admin'];

  async login(username, password) {
    const user = this.users.find(u => u.username === username);
    if (!user) {
      throw new AuthenticationError('Invalid username or password');
    }
    // Compare password using bcrypt
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AuthenticationError('Invalid username or password');
    }
    // Create JWT token with role, using env variables
    if (!SECRET_KEY) {
      throw new Error('JWT secret is not set in environment variables');
    }
    const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
    return token;
  }

  checkAuthorization(token, requiredRole) {
    if (this.blacklistedTokens.has(token)) {
      throw new AuthorizationError('Token has been invalidated.');
    }
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      throw new AuthorizationError('Invalid token');
    }
    const userRole = decoded.role;
    const requiredIdx = this.roleHierarchy.indexOf(requiredRole);
    const userIdx = this.roleHierarchy.indexOf(userRole);
    if (userIdx === -1 || requiredIdx === -1 || userIdx < requiredIdx) {
      throw new AuthorizationError('User is not authorized for this action.');
    }
    return decoded;
  }

  async logout(token) {
    // Simulate token blacklisting
    this.blacklistedTokens.add(token);
    return true;
  }

  async validateToken(token) {
    if (this.blacklistedTokens.has(token)) {
      throw new AuthenticationError('Token has been invalidated.');
    }
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      return decoded;
    } catch (err) {
      throw new AuthenticationError('Invalid token');
    }
  }
}

export default LoginService;
