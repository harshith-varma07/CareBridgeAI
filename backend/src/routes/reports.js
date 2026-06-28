import express from 'express';
import { authRequired } from '../middleware/auth.js';
import { Patient } from '../models/Patient.js';
import { RiskReport } from '../models/RiskReport.js';

export const reportsRouter = express.Router();
reportsRouter.use(authRequired);

reportsRouter.get('/:patientId', async (req, res) => {
  const patient = await Patient.findById(req.params.patientId);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  if (
    (req.user.role === 'PATIENT' && String(patient.userId) !== req.user.id) ||
    (req.user.role === 'DOCTOR' && String(patient.doctorId) !== req.user.id)
  ) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const reports = await RiskReport.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
  return res.json(reports);
});
