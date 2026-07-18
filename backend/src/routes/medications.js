import express from 'express';
import { body, validationResult } from 'express-validator';
import { Medication } from '../models/Medication.js';
import { MedicationLog } from '../models/MedicationLog.js';
import { Patient } from '../models/Patient.js';
import { rolesRequired } from '../middleware/roles.js';

export const medicationsRouter = express.Router();

// POST / — Add a medication (DOCTOR/ADMIN only)
medicationsRouter.post(
  '/',
  rolesRequired('DOCTOR', 'ADMIN'),
  body('patientId').isMongoId().withMessage('Valid patientId is required'),
  body('name').isString().trim().isLength({ min: 1 }).withMessage('Medication name is required'),
  body('dosage').isString().trim().isLength({ min: 1 }).withMessage('Dosage is required'),
  body('frequency').isString().trim().isLength({ min: 1 }).withMessage('Frequency is required'),
  body('times').optional().isArray().withMessage('Times must be an array'),
  body('times.*').optional().isString().withMessage('Each time must be a string'),
  body('startDate').isISO8601().withMessage('Valid startDate is required'),
  body('endDate').optional().isISO8601().withMessage('endDate must be a valid date'),
  body('instructions').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const patient = await Patient.findById(req.body.patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const medication = await Medication.create({
      patientId: req.body.patientId,
      name: req.body.name.trim(),
      dosage: req.body.dosage.trim(),
      frequency: req.body.frequency.trim(),
      times: req.body.times || [],
      startDate: req.body.startDate,
      endDate: req.body.endDate || undefined,
      instructions: req.body.instructions || '',
    });

    return res.status(201).json(medication);
  }
);

// GET /:patientId — List active medications for a patient
medicationsRouter.get('/:patientId', async (req, res) => {
  const patient = await Patient.findById(req.params.patientId);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });

  // Ownership check
  if (
    (req.user.role === 'PATIENT' && String(patient.userId) !== req.user.id) ||
    (req.user.role === 'DOCTOR' && String(patient.doctorId) !== req.user.id)
  ) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const medications = await Medication.find({ patientId: req.params.patientId, active: true })
    .sort({ createdAt: -1 });

  return res.json(medications);
});

// PUT /:id — Update a medication (DOCTOR/ADMIN only)
medicationsRouter.put(
  '/:id',
  rolesRequired('DOCTOR', 'ADMIN'),
  async (req, res) => {
    const allowed = ['name', 'dosage', 'frequency', 'times', 'startDate', 'endDate', 'instructions', 'active'];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowed.includes(key))
    );

    const medication = await Medication.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!medication) return res.status(404).json({ message: 'Medication not found' });
    return res.json(medication);
  }
);

// POST /:id/log — Log a dose taken (PATIENT only)
medicationsRouter.post(
  '/:id/log',
  rolesRequired('PATIENT'),
  body('scheduledTime').isString().trim().isLength({ min: 1 }).withMessage('scheduledTime is required'),
  body('takenAt').optional().isISO8601().withMessage('takenAt must be a valid date'),
  body('skipped').optional().isBoolean().withMessage('skipped must be a boolean'),
  body('notes').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const medication = await Medication.findById(req.params.id);
    if (!medication) return res.status(404).json({ message: 'Medication not found' });

    // Verify the patient owns this medication
    const patient = await Patient.findById(medication.patientId);
    if (!patient || String(patient.userId) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const skipped = req.body.skipped === true || req.body.skipped === 'true';

    const log = await MedicationLog.create({
      medicationId: medication._id,
      patientId: patient._id,
      scheduledTime: req.body.scheduledTime.trim(),
      takenAt: skipped ? undefined : (req.body.takenAt || new Date()),
      skipped,
      notes: req.body.notes || '',
    });

    return res.status(201).json(log);
  }
);

// GET /:patientId/logs — Get medication logs for compliance tracking
medicationsRouter.get('/:patientId/logs', async (req, res) => {
  const patient = await Patient.findById(req.params.patientId);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });

  // Ownership check
  if (
    (req.user.role === 'PATIENT' && String(patient.userId) !== req.user.id) ||
    (req.user.role === 'DOCTOR' && String(patient.doctorId) !== req.user.id)
  ) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const logs = await MedicationLog.find({ patientId: req.params.patientId })
    .populate('medicationId', 'name dosage frequency')
    .sort({ createdAt: -1 });

  return res.json(logs);
});

// DELETE /:id — Deactivate medication (soft delete, DOCTOR/ADMIN only)
medicationsRouter.delete(
  '/:id',
  rolesRequired('DOCTOR', 'ADMIN'),
  async (req, res) => {
    const medication = await Medication.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!medication) return res.status(404).json({ message: 'Medication not found' });
    return res.json({ message: 'Medication deactivated', medication });
  }
);
