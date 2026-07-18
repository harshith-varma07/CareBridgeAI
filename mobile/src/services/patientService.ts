import { api } from './api';

export type PatientDetail = {
  _id: string;
  userId: { _id: string; name: string; email: string };
  doctorId: { _id: string; name: string; email: string };
  age: number;
  gender: string;
  surgeryType: string;
  surgeryDate: string;
  expectedRecoveryDuration: number;
  medicalNotes: string;
};

export type RiskReport = {
  _id: string;
  patientId: string;
  dailyResponseId: string;
  infectionProbability: number;
  rednessScore: number;
  trend: string;
  risk: 'GREEN' | 'YELLOW' | 'RED';
  confidence: number;
  explanation: string;
  createdAt: string;
};

export async function getPatients(): Promise<PatientDetail[]> {
  const { data } = await api.get<PatientDetail[]>('/patients');
  return data;
}

export async function getPatient(id: string): Promise<PatientDetail> {
  const { data } = await api.get<PatientDetail>(`/patients/${id}`);
  return data;
}

export async function getRiskReports(patientId: string): Promise<RiskReport[]> {
  const { data } = await api.get<RiskReport[]>(`/reports/${patientId}`);
  return data;
}
