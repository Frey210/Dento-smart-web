export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  guardianName: string;
  medicalNotes: string;
}

export interface Device {
  id: string;
  deviceId: string;
  deviceName: string;
  firmware: string;
  status: 'online' | 'offline' | 'calibrating';
  batteryLevel?: number;
  lastConnectionTime?: string;
}

export interface Session {
  id: string;
  patientId: string;
  patientName: string;
  deviceId?: string | null;
  status: 'active' | 'completed';
  started_at?: string;
  ended_at?: string | null;
  duration_seconds?: number | null;
  date?: string;
  duration?: string | null;
  notes?: string | null;
}

export interface SensorData {
  timestamp: number;
  gsr: number;
  heart_rate: number;
  temperature: number;
  systolic: number;
  diastolic: number;
}

export interface EventMarker {
  id: string;
  session_id: string;
  marker_type: string;
  note?: string | null;
  created_at: string;
}

export interface AdminDevice extends Device {
  ownerId?: string | null;
  ownerEmail?: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'researcher';
  is_active: boolean;
  created_at: string;
}
