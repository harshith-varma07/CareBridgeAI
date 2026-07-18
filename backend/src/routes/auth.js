import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, matchedData, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

export const authRouter = express.Router();

authRouter.post(
  '/register',
  body('name').isString().trim().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['PATIENT', 'DOCTOR', 'ADMIN']),
  body('hospitalId').optional().isString().trim(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role, hospitalId } = matchedData(req, { locations: ['body'] });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role, hospitalId });
    return res.status(201).json({ id: user.id, email: user.email, role: user.role });
  }
);

authRouter.post('/login', body('email').isEmail(), body('password').isString(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = matchedData(req, { locations: ['body'] });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '1d' });
  return res.json({ token, user: { id: user.id, role: user.role, name: user.name } });
});
