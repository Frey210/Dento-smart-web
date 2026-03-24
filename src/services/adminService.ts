import { apiRequest } from './apiClient';
import type { AdminDevice, AdminUser } from '../types';

export async function getAdminDevices(): Promise<AdminDevice[]> {
  return apiRequest<AdminDevice[]>('/admin/devices');
}

export async function provisionDevice(payload: {
  deviceId: string;
  deviceName?: string;
  firmware?: string;
}): Promise<AdminDevice> {
  return apiRequest<AdminDevice>('/admin/devices/provision', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function unassignDevice(deviceId: string): Promise<AdminDevice> {
  return apiRequest<AdminDevice>(`/admin/devices/${deviceId}/unassign`, {
    method: 'POST',
  });
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  return apiRequest<AdminUser[]>('/admin/users');
}

export async function updateUserRole(userId: string, role: AdminUser['role']): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/admin/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

export async function updateUserStatus(userId: string, isActive: boolean): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/admin/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
}
