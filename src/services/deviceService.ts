import { apiRequest } from './apiClient';
import type { Device } from '../types';

export async function getDevices(): Promise<Device[]> {
  return apiRequest<Device[]>('/devices');
}

export async function registerDevice(payload: {
  deviceId: string;
  deviceName?: string;
  firmware?: string;
}): Promise<Device> {
  return apiRequest<Device>('/devices', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteDevice(deviceId: string): Promise<void> {
  await apiRequest(`/devices/${deviceId}`, { method: 'DELETE' });
}
