import { apiRequest } from './apiClient';
import type { EventMarker } from '../types';

export async function getEventMarkers(sessionId: string): Promise<EventMarker[]> {
  return apiRequest<EventMarker[]>(`/sessions/${sessionId}/markers`);
}

export async function createEventMarker(
  sessionId: string,
  payload: { marker_type: string; note?: string }
): Promise<EventMarker> {
  return apiRequest<EventMarker>(`/sessions/${sessionId}/markers`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
