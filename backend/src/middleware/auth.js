import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const authRequired = async (req, res, next) => {
  try {
    const raw = req.headers.authorization;
    if (!raw?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing token' });
    }
    const token = raw.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = { id: user.id, role: user.role };
    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
