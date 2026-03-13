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
  date: string;
  duration: string;
  status: 'active' | 'completed';
}

export interface SensorData {
  timestamp: number;
  gsr: number;
  heart_rate: number;
  temperature: number;
  systolic: number;
  diastolic: number;
}
