import express from 'express';
import { body, validationResult } from 'express-validator';
import { ClinicalNote } from '../models/ClinicalNote.js';
import { Patient } from '../models/Patient.js';
import { rolesRequired } from '../middleware/roles.js';

export const clinicalNotesRouter = express.Router();

// POST / — Doctor creates a clinical note
clinicalNotesRouter.post(
  '/',
  rolesRequired('DOCTOR', 'ADMIN'),
  body('patientId').isMongoId().withMessage('Valid patientId is required'),
  body('note').isString().trim().isLength({ min: 1 }).withMessage('Note is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const patient = await Patient.findById(req.body.patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const clinicalNote = await ClinicalNote.create({
      patientId: req.body.patientId,
      doctorId: req.user.id,
      note: req.body.note.trim(),
    });

    return res.status(201).json(clinicalNote);
  }
);

// GET /:patientId — Get all clinical notes for a patient
clinicalNotesRouter.get('/:patientId', async (req, res) => {
  const patient = await Patient.findById(req.params.patientId);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });

  // Ownership check: PATIENT can only view own notes, DOCTOR can view their patients' notes
  if (
    (req.user.role === 'PATIENT' && String(patient.userId) !== req.user.id) ||
    (req.user.role === 'DOCTOR' && String(patient.doctorId) !== req.user.id)
  ) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const notes = await ClinicalNote.find({ patientId: req.params.patientId })
    .populate('doctorId', 'name email')
    .sort({ createdAt: -1 });

  return res.json(notes);
});
