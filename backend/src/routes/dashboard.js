import express from 'express';
import { Patient } from '../models/Patient.js';
import { RiskReport } from '../models/RiskReport.js';
import { DailyResponse } from '../models/DailyResponse.js';
import { Medication } from '../models/Medication.js';
import { MedicationLog } from '../models/MedicationLog.js';
import { rolesRequired } from '../middleware/roles.js';

export const dashboardRouter = express.Router();

// GET /patient — Patient dashboard
dashboardRouter.get('/patient', rolesRequired('PATIENT'), async (req, res) => {
  const patient = await Patient.findOne({ userId: req.user.id })
    .populate('userId', 'name email')
    .populate('doctorId', 'name email');

  if (!patient) return res.status(404).json({ message: 'Patient record not found' });

  // Surgery day count
  const surgeryDayCount = Math.ceil((Date.now() - new Date(patient.surgeryDate).getTime()) / 86400000);

  // Latest risk report
  const latestRisk = await RiskReport.findOne({ patientId: patient._id }).sort({ createdAt: -1 });

  // Last 7 daily responses for trend
  const recentResponses = await DailyResponse.find({ patientId: patient._id })
    .sort({ submittedAt: -1 })
    .limit(7);

  // Medication compliance calculation
  const activeMedications = await Medication.find({ patientId: patient._id, active: true });
  let medicationCompliance = 100;

  if (activeMedications.length > 0) {
    // Calculate expected doses from all active medications over the last 7 days
    let totalExpectedDoses = 0;
    for (const med of activeMedications) {
      const timesPerDay = med.times.length || 1;
      const medStartDate = new Date(med.startDate);
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
      const effectiveStart = medStartDate > sevenDaysAgo ? medStartDate : sevenDaysAgo;
      const daysActive = Math.max(1, Math.ceil((Date.now() - effectiveStart.getTime()) / 86400000));
      totalExpectedDoses += timesPerDay * Math.min(daysActive, 7);
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
    const takenLogs = await MedicationLog.countDocuments({
      patientId: patient._id,
      skipped: false,
      createdAt: { $gte: sevenDaysAgo },
    });

    medicationCompliance = totalExpectedDoses > 0
      ? Math.min(100, Math.round((takenLogs / totalExpectedDoses) * 100))
      : 100;
  }

  // Recovery score: weighted combination of compliance, risk, and trend
  let riskScore = 100;
  if (latestRisk) {
    if (latestRisk.risk === 'RED') riskScore = 20;
    else if (latestRisk.risk === 'YELLOW') riskScore = 60;
  }

  const progressRatio = Math.min(1, surgeryDayCount / (patient.expectedRecoveryDuration || 30));
  const recoveryScore = Math.round(
    (medicationCompliance * 0.3) + (riskScore * 0.5) + (progressRatio * 100 * 0.2)
  );

  return res.json({
    patient,
    surgeryDayCount,
    latestRisk,
    recentResponses,
    medicationCompliance,
    recoveryScore: Math.min(100, recoveryScore),
  });
});

// GET /doctor — Doctor dashboard
dashboardRouter.get('/doctor', rolesRequired('DOCTOR'), async (req, res) => {
  const patients = await Patient.find({ doctorId: req.user.id })
    .populate('userId', 'name email');

  // For each patient, get the latest risk report and last check-in
  const patientDetails = await Promise.all(
    patients.map(async (patient) => {
      const latestRisk = await RiskReport.findOne({ patientId: patient._id }).sort({ createdAt: -1 });
      const lastCheckIn = await DailyResponse.findOne({ patientId: patient._id }).sort({ submittedAt: -1 });
      return { patient, latestRisk, lastCheckIn };
    })
  );

  // Count check-ins submitted today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const patientIds = patients.map((p) => p._id);
  const todayCheckIns = await DailyResponse.countDocuments({
    patientId: { $in: patientIds },
    submittedAt: { $gte: startOfDay },
  });

  // Count critical (RED) patients
  const criticalCount = patientDetails.filter(
    (pd) => pd.latestRisk && pd.latestRisk.risk === 'RED'
  ).length;

  return res.json({
    totalPatients: patients.length,
    criticalCount,
    todayCheckIns,
    patients: patientDetails,
  });
});
