import type { Patient, Device, Session, SensorData } from '../../types';

export const mockPatients: Patient[] = [
  { id: 'p1', name: 'Emma Wilson', dateOfBirth: '2015-04-12', age: 10, gender: 'Female', guardianName: 'Sarah Wilson', medicalNotes: 'Mild anxiety' },
  { id: 'p2', name: 'Noah Miller', dateOfBirth: '2014-08-22', age: 11, gender: 'Male', guardianName: 'David Miller', medicalNotes: 'No known allergies' },
  { id: 'p3', name: 'Olivia Davis', dateOfBirth: '2016-11-05', age: 9, gender: 'Female', guardianName: 'Michael Davis', medicalNotes: 'Asthma' },
  { id: 'p4', name: 'James Taylor', dateOfBirth: '2013-02-18', age: 13, gender: 'Male', guardianName: 'Jessica Taylor', medicalNotes: 'Severe dental anxiety' },
];

export const mockDevices: Device[] = [
  { id: 'd1', deviceId: 'ESP32-A1', deviceName: 'Chair 1 Monitor', firmware: 'v1.4.2', status: 'online', batteryLevel: 85, lastConnectionTime: new Date().toISOString() },
  { id: 'd2', deviceId: 'ESP32-B2', deviceName: 'Chair 2 Monitor', firmware: 'v1.4.2', status: 'offline', batteryLevel: 12, lastConnectionTime: new Date(Date.now() - 3600000).toISOString() },
  { id: 'd3', deviceId: 'ESP32-C3', deviceName: 'Mobile Cart', firmware: 'v1.4.1', status: 'online', batteryLevel: 100, lastConnectionTime: new Date().toISOString() },
];

export const mockSessions: Session[] = [
  { id: 's1', patientId: 'p1', patientName: 'Emma Wilson', date: new Date().toISOString().split('T')[0], duration: '45 min', status: 'completed' },
  { id: 's2', patientId: 'p4', patientName: 'James Taylor', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], duration: '60 min', status: 'completed' },
  { id: 's3', patientId: 'p2', patientName: 'Noah Miller', date: new Date(Date.now() - 172800000).toISOString().split('T')[0], duration: '30 min', status: 'completed' },
];

export const mockServices = {
  getPatients: async (): Promise<Patient[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockPatients), 500));
  },
  
  getPatientById: async (id: string): Promise<Patient | undefined> => {
    return new Promise(resolve => setTimeout(() => resolve(mockPatients.find(p => p.id === id)), 300));
  },

  getDevices: async (): Promise<Device[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockDevices), 500));
  },

  getSessions: async (): Promise<Session[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockSessions), 500));
  },

  generateRandomSensorData: (): SensorData => {
    const time = Date.now();
    return {
      timestamp: time,
      gsr: +(2.0 + Math.random() * 1.5).toFixed(2),
      heart_rate: Math.floor(75 + Math.random() * 30),
      temperature: +(36.5 + Math.random() * 0.8).toFixed(1),
      systolic: Math.floor(100 + Math.random() * 25),
      diastolic: Math.floor(65 + Math.random() * 15),
    };
  }
};
