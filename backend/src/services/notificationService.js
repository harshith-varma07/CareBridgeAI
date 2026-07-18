import { Notification } from '../models/Notification.js';

/**
 * Create a single notification for a user.
 * @param {string} userId - The target user's ObjectId.
 * @param {string} type - One of the Notification type enum values.
 * @param {string} title - Notification title.
 * @param {string} body - Notification body text.
 * @returns {Promise<Document>} The created Notification document.
 */
export async function createNotification(userId, type, title, body) {
  return Notification.create({ userId, type, title, body });
}

/**
 * Create risk-based notifications after a daily response is analyzed.
 *
 * - RED risk  → HIGH_RISK_ALERT for patient + CRITICAL_PATIENT_NOTIFICATION for doctor
 * - YELLOW risk → DOCTOR_NOTIFICATION for doctor
 * - Always → DAILY_REMINDER for patient confirming submission
 *
 * @param {Document} patient - The Patient document (must have userId and doctorId populated or set).
 * @param {Document} riskReport - The RiskReport document with risk level.
 */
export async function createRiskNotifications(patient, riskReport) {
  const notifications = [];

  // Always notify the patient that their daily check-in was received
  notifications.push(
    createNotification(
      patient.userId,
      'DAILY_REMINDER',
      'Daily Check-In Received',
      `Your daily check-in has been recorded. Current risk level: ${riskReport.risk}.`
    )
  );

  if (riskReport.risk === 'RED') {
    // Alert the patient about high risk
    notifications.push(
      createNotification(
        patient.userId,
        'HIGH_RISK_ALERT',
        'High Risk Alert',
        'Your latest check-in indicates a high risk of complications. Please contact your doctor immediately.'
      )
    );

    // Alert the doctor about this critical patient
    notifications.push(
      createNotification(
        patient.doctorId,
        'CRITICAL_PATIENT_NOTIFICATION',
        'Critical Patient Alert',
        `Patient (ID: ${patient._id}) has been flagged as HIGH RISK. Immediate review is recommended. Explanation: ${riskReport.explanation}`
      )
    );
  }

  if (riskReport.risk === 'YELLOW') {
    // Notify the doctor about a moderate-risk patient
    notifications.push(
      createNotification(
        patient.doctorId,
        'DOCTOR_NOTIFICATION',
        'Patient Requires Attention',
        `Patient (ID: ${patient._id}) shows moderate risk indicators. Please review when available. Explanation: ${riskReport.explanation}`
      )
    );
  }

  await Promise.all(notifications);
}
