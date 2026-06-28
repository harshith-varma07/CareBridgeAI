import express from 'express';
import { authRequired } from '../middleware/auth.js';
import { Notification } from '../models/Notification.js';

export const notificationsRouter = express.Router();
notificationsRouter.use(authRequired);

notificationsRouter.get('/', async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
  return res.json(notifications);
});
