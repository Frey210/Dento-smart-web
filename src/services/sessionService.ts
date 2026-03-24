import { apiRequest } from './apiClient';
import type { Session } from '../types';

export async function getSessions(): Promise<Session[]> {
  return apiRequest<Session[]>('/sessions');
}

export async function getSessionData(sessionId: string): Promise<any[]> {
  return apiRequest<any[]>(`/export/${sessionId}?format=json`);
}

export async function getSessionSummary(sessionId: string): Promise<any> {
  return apiRequest<any>(`/sessions/${sessionId}/summary`);
}

export async function getSessionDetail(sessionId: string): Promise<any> {
  return apiRequest<any>(`/sessions/${sessionId}`);
}

export async function startSession(payload: {
  patientId?: string;
  patientName?: string;
  deviceId?: string;
  notes?: string;
}): Promise<Session> {
  return apiRequest<Session>('/sessions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function stopSession(sessionId: string, notes?: string): Promise<Session> {
  return apiRequest<Session>(`/sessions/${sessionId}/stop`, {
    method: 'POST',
    body: JSON.stringify({ notes }),
  });
}

export async function deleteSession(sessionId: string): Promise<void> {
  await apiRequest(`/sessions/${sessionId}`, { method: 'DELETE' });
}
