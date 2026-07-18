import express from 'express';
import { authRequired } from '../middleware/auth.js';
import { Notification } from '../models/Notification.js';

export const notificationsRouter = express.Router();
notificationsRouter.use(authRequired);

// GET / — List notifications for the authenticated user
notificationsRouter.get('/', async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
  return res.json(notifications);
});

// PUT /read-all — Mark all notifications as read for the authenticated user
// NOTE: This route must be defined BEFORE /:id/read to prevent "read-all" matching as :id
notificationsRouter.put('/read-all', async (req, res) => {
  const result = await Notification.updateMany(
    { userId: req.user.id, read: false },
    { $set: { read: true } }
  );
  return res.json({ message: 'All notifications marked as read', modifiedCount: result.modifiedCount });
});

// PUT /:id/read — Mark a single notification as read (ownership check)
notificationsRouter.put('/:id/read', async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) return res.status(404).json({ message: 'Notification not found' });

  // Ownership check: user can only mark their own notifications
  if (String(notification.userId) !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  notification.read = true;
  await notification.save();
  return res.json(notification);
});
