import express from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import { DailyResponse } from '../models/DailyResponse.js';
import { RiskReport } from '../models/RiskReport.js';
import { Patient } from '../models/Patient.js';
import { authRequired } from '../middleware/auth.js';
import { analyzeWithAiService } from '../services/aiService.js';
import { createRiskNotifications } from '../services/notificationService.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
export const responsesRouter = express.Router();
responsesRouter.use(authRequired);

responsesRouter.post(
  '/',
  upload.single('image'),
  body('patientId').isMongoId(),
  body('painLevel').isInt({ min: 0, max: 10 }),
  body('fever').isBoolean(),
  body('redness').isBoolean(),
  body('discharge').isBoolean(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const payload = {
      patientId: req.body.patientId,
      painLevel: Number(req.body.painLevel),
      fever: req.body.fever === true || req.body.fever === 'true',
      redness: req.body.redness === true || req.body.redness === 'true',
      discharge: req.body.discharge === true || req.body.discharge === 'true',
      imageBase64: req.file ? req.file.buffer.toString('base64') : undefined
    };

    const dailyResponse = await DailyResponse.create({
      patientId: payload.patientId,
      painLevel: payload.painLevel,
      fever: payload.fever,
      redness: payload.redness,
      discharge: payload.discharge,
      imageUrl: req.file ? `data:${req.file.mimetype};base64,${payload.imageBase64}` : undefined
    });

    const aiResult = await analyzeWithAiService(payload);
    const report = await RiskReport.create({ ...aiResult, patientId: payload.patientId, dailyResponseId: dailyResponse.id });

    // Generate notifications based on risk level
    const patient = await Patient.findById(payload.patientId);
    if (patient) {
      await createRiskNotifications(patient, report);
    }

    return res.status(201).json({ dailyResponse, report });
  }
);

responsesRouter.get('/:patientId', async (req, res) => {
  const patient = await Patient.findById(req.params.patientId);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  if (
    (req.user.role === 'PATIENT' && String(patient.userId) !== req.user.id) ||
    (req.user.role === 'DOCTOR' && String(patient.doctorId) !== req.user.id)
  ) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const items = await DailyResponse.find({ patientId: req.params.patientId }).sort({ submittedAt: -1 });
  return res.json(items);
});
