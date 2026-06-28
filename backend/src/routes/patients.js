import express from 'express';
import bcrypt from 'bcryptjs';
import { body, matchedData, validationResult } from 'express-validator';
import { Patient } from '../models/Patient.js';
import { User } from '../models/User.js';
import { authRequired } from '../middleware/auth.js';
import { rolesRequired } from '../middleware/roles.js';

export const patientsRouter = express.Router();
patientsRouter.use(authRequired);

patientsRouter.get('/', async (req, res) => {
  const filter = req.user.role === 'DOCTOR' ? { doctorId: req.user.id } : {};
  const patients = await Patient.find(filter).populate('userId doctorId', 'name email');
  return res.json(patients);
});

patientsRouter.get('/:id', async (req, res) => {
  const patient = await Patient.findById(req.params.id).populate('userId doctorId', 'name email');
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  return res.json(patient);
});

patientsRouter.post(
  '/',
  rolesRequired('DOCTOR', 'ADMIN'),
  body('name').isString(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('age').isInt({ min: 0 }),
  body('gender').isIn(['Male', 'Female', 'Other']),
  body('surgeryType').isString(),
  body('surgeryDate').isISO8601(),
  body('expectedRecoveryDuration').isInt({ min: 1 }),
  body('doctorId').optional().isMongoId(),
  body('hospitalId').optional().isString(),
  body('medicalNotes').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const data = matchedData(req, { locations: ['body'] });

    const passwordHash = await bcrypt.hash(data.password, 10);
    const patientUser = await User.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: 'PATIENT',
      hospitalId: data.hospitalId
    });

    const patient = await Patient.create({
      userId: patientUser.id,
      doctorId: data.doctorId || req.user.id,
      age: data.age,
      gender: data.gender,
      surgeryType: data.surgeryType,
      surgeryDate: data.surgeryDate,
      expectedRecoveryDuration: data.expectedRecoveryDuration,
      medicalNotes: data.medicalNotes || ''
    });

    return res.status(201).json(patient);
  }
);

patientsRouter.put('/:id', rolesRequired('DOCTOR', 'ADMIN'), async (req, res) => {
  const allowed = ['doctorId', 'age', 'gender', 'surgeryType', 'surgeryDate', 'expectedRecoveryDuration', 'medicalNotes'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const patient = await Patient.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  return res.json(patient);
});
