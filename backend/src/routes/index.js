import express from 'express';
import { authRouter } from './auth.js';
import { patientsRouter } from './patients.js';
import { responsesRouter } from './responses.js';
import { aiRouter } from './ai.js';
import { reportsRouter } from './reports.js';
import { notificationsRouter } from './notifications.js';
import { clinicalNotesRouter } from './clinicalNotes.js';
import { medicationsRouter } from './medications.js';
import { dashboardRouter } from './dashboard.js';
import { authRequired } from '../middleware/auth.js';

export const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/patients', patientsRouter);
apiRouter.use('/responses', responsesRouter);
apiRouter.use('/ai', aiRouter);
apiRouter.use('/reports', reportsRouter);
apiRouter.use('/notifications', notificationsRouter);
apiRouter.use('/clinical-notes', authRequired, clinicalNotesRouter);
apiRouter.use('/medications', authRequired, medicationsRouter);
apiRouter.use('/dashboard', authRequired, dashboardRouter);
