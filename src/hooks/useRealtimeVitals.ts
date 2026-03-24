import { useEffect, useState } from 'react';
import type { SensorData } from '../types';
import { apiRequest } from '../services/apiClient';

const defaultHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const WS_BASE = import.meta.env.VITE_WS_BASE_URL || `ws://${defaultHost}:8000`;

export function useRealtimeVitals(isActive: boolean = true, sessionId?: string) {
  const [data, setData] = useState<SensorData[]>([]);

  // Initialize with some historical data
  useEffect(() => {
    if (!sessionId) {
      setData([]);
      return;
    }
    let isMounted = true;
    apiRequest<any[]>(`/export/${sessionId}?format=json`)
      .then((rows) => {
        if (!isMounted) return;
        const mapped = rows.map((row: any) => ({
          timestamp: typeof row.timestamp === 'string' ? Date.parse(row.timestamp) : row.timestamp,
          gsr: row.gsr,
          heart_rate: row.heart_rate ?? row.heartRate,
          temperature: row.temperature,
          systolic: row.systolic ?? row.blood_pressure_sys,
          diastolic: row.diastolic ?? row.blood_pressure_dia,
        })) as SensorData[];
        setData(mapped.slice(-60));
      })
      .catch(() => {
        if (!isMounted) return;
        setData([]);
      });
    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  useEffect(() => {
    if (!isActive) return;

    if (sessionId && WS_BASE) {
      const ws = new WebSocket(`${WS_BASE.replace(/^http/, 'ws')}/ws/session/${sessionId}`);
      ws.onmessage = (event) => {
        const raw = JSON.parse(event.data);
        const payload: SensorData = {
          timestamp: typeof raw.timestamp === 'string' ? Date.parse(raw.timestamp) : raw.timestamp,
          gsr: raw.gsr,
          heart_rate: raw.heart_rate ?? raw.heartRate,
          temperature: raw.temperature,
          systolic: raw.systolic ?? raw.blood_pressure_sys,
          diastolic: raw.diastolic ?? raw.blood_pressure_dia,
        };
        setData((prevData) => [...prevData.slice(-59), payload]);
      };
      return () => ws.close();
    }
  }, [isActive, sessionId]);

  const latestData =
    data[data.length - 1] || {
      timestamp: Date.now(),
      gsr: 0,
      heart_rate: 0,
      temperature: 0,
      systolic: 0,
      diastolic: 0,
    };

  return {
    data,
    latestData,
  };
}
