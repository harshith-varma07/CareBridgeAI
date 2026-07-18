import { api } from './api';

export type Medication = {
  _id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  instructions: string;
  active: boolean;
  createdAt: string;
};

export type MedicationLog = {
  _id: string;
  medicationId: string;
  patientId: string;
  scheduledTime: string;
  takenAt?: string;
  skipped: boolean;
  notes: string;
  createdAt: string;
};

export async function getMedications(patientId: string): Promise<Medication[]> {
  const { data } = await api.get<Medication[]>(`/medications/${patientId}`);
  return data;
}

export async function logMedicationDose(medicationId: string, scheduledTime: string): Promise<MedicationLog> {
  const { data } = await api.post<MedicationLog>(`/medications/${medicationId}/log`, { scheduledTime });
  return data;
}

export async function getMedicationLogs(patientId: string): Promise<MedicationLog[]> {
  const { data } = await api.get<MedicationLog[]>(`/medications/${patientId}/logs`);
  return data;
}
