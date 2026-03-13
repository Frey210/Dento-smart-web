import { useEffect, useState, useCallback } from 'react';
import { mockServices } from '../services/mock';
import type { SensorData } from '../types';

export function useRealtimeVitals(isActive: boolean = true) {
  const [data, setData] = useState<SensorData[]>([]);

  // Initialize with some historical data
  useEffect(() => {
    const historicalData = Array.from({ length: 60 }, (_, i) => {
      const point = mockServices.generateRandomSensorData();
      point.timestamp = Date.now() - (60 - i) * 1000;
      return point;
    });
    setData(historicalData);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const intervalId = window.setInterval(() => {
      setData((prevData) => {
        const newDataPoint = mockServices.generateRandomSensorData();
        // Keep the last 60 points (1 minute of data at 1Hz)
        const updatedData = [...prevData.slice(-59), newDataPoint];
        return updatedData;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isActive]);

  const addMarker = useCallback((type: string) => {
    // In a real app, this would send an event to the backend and maybe add a marker to the chart
    console.log(`Marker added: ${type} at ${new Date().toISOString()}`);
  }, []);

  const latestData = data[data.length - 1] || mockServices.generateRandomSensorData();

  return {
    data,
    latestData,
    addMarker,
  };
}
