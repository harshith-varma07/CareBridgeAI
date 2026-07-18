import { api } from './api';

export type AnalysisResult = {
  response: {
    _id: string;
    painLevel: number;
    fever: boolean;
    redness: boolean;
    discharge: boolean;
    imageUrl?: string;
    submittedAt: string;
  };
  riskReport: {
    _id: string;
    infectionProbability: number;
    rednessScore: number;
    trend: string;
    risk: 'GREEN' | 'YELLOW' | 'RED';
    confidence: number;
    explanation: string;
  };
};

export type HistoryEntry = {
  _id: string;
  painLevel: number;
  fever: boolean;
  redness: boolean;
  discharge: boolean;
  imageUrl?: string;
  submittedAt: string;
  createdAt: string;
};

export async function submitDailyResponse(
  patientId: string,
  painLevel: number,
  fever: boolean,
  redness: boolean,
  discharge: boolean,
  imageUri?: string
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('patientId', patientId);
  formData.append('painLevel', String(painLevel));
  formData.append('fever', String(fever));
  formData.append('redness', String(redness));
  formData.append('discharge', String(discharge));

  if (imageUri) {
    const filename = imageUri.split('/').pop() || 'wound.jpg';
    const match = /\.([\w]+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    formData.append('image', { uri: imageUri, name: filename, type } as any);
  }

  const { data } = await api.post<AnalysisResult>('/responses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  });
  return data;
}

export async function getResponses(patientId: string): Promise<HistoryEntry[]> {
  const { data } = await api.get<HistoryEntry[]>(`/responses/${patientId}`);
  return data;
}
