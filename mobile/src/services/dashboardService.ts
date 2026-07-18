import { api } from './api';

export type PatientDashboardData = {
  patient: {
    _id: string;
    surgeryType: string;
    surgeryDate: string;
    expectedRecoveryDuration: number;
    medicalNotes: string;
  };
  surgeryDayCount: number;
  latestRisk: {
    risk: 'GREEN' | 'YELLOW' | 'RED';
    infectionProbability: number;
    trend: string;
    explanation: string;
    confidence: number;
  } | null;
  recentResponses: Array<{
    _id: string;
    painLevel: number;
    fever: boolean;
    redness: boolean;
    discharge: boolean;
    imageUrl?: string;
    submittedAt: string;
  }>;
  medicationCompliance: number;
  recoveryScore: number;
};

export type DoctorPatientSummary = {
  patient: {
    _id: string;
    userId: { _id: string; name: string; email: string };
    surgeryType: string;
    surgeryDate: string;
  };
  latestRisk: {
    risk: 'GREEN' | 'YELLOW' | 'RED';
    infectionProbability: number;
    trend: string;
    explanation: string;
    createdAt: string;
  } | null;
  lastCheckIn: string | null;
};

export type DoctorDashboardData = {
  totalPatients: number;
  criticalCount: number;
  todayCheckIns: number;
  patients: DoctorPatientSummary[];
};

export async function getPatientDashboard(): Promise<PatientDashboardData> {
  const { data } = await api.get<PatientDashboardData>('/dashboard/patient');
  return data;
}

export async function getDoctorDashboard(): Promise<DoctorDashboardData> {
  const { data } = await api.get<DoctorDashboardData>('/dashboard/doctor');
  return data;
}
