import express from 'express';
import { authRouter } from './auth.js';
import { patientsRouter } from './patients.js';
import { responsesRouter } from './responses.js';
import { aiRouter } from './ai.js';
import { reportsRouter } from './reports.js';
import { notificationsRouter } from './notifications.js';

export const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/patients', patientsRouter);
apiRouter.use('/responses', responsesRouter);
apiRouter.use('/ai', aiRouter);
apiRouter.use('/reports', reportsRouter);
apiRouter.use('/notifications', notificationsRouter);
