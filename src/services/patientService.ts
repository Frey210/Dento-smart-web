import { apiRequest } from './apiClient';
import type { Patient } from '../types';

export async function getPatients(): Promise<Patient[]> {
  return apiRequest<Patient[]>('/patients');
}

export async function createPatient(payload: Omit<Patient, 'id'>): Promise<Patient> {
  return apiRequest<Patient>('/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deletePatient(patientId: string): Promise<void> {
  await apiRequest(`/patients/${patientId}`, { method: 'DELETE' });
}
