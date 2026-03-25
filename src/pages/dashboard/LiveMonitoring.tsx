import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, MonitorCheck, Baby, History, HeartPulse, Thermometer, Waves } from 'lucide-react';
import { MetricCard } from '../../components/Card';
import { MultiSignalChart } from '../../components/MultiSignalChart';
import { SessionRightPanel } from '../../components/SessionRightPanel';
import { SessionControlBar } from '../../components/SessionControlBar';
import { useRealtimeVitals } from '../../hooks/useRealtimeVitals';
import { getDevices } from '../../services/deviceService';
import { getPatients } from '../../services/patientService';
import { startSession, stopSession } from '../../services/sessionService';
import { createEventMarker, getEventMarkers } from '../../services/eventMarkerService';
import type { Device, EventMarker, Patient, Session } from '../../types';
import { Link } from 'react-router-dom';

export function LiveMonitoring() {
  const [isActive, setIsActive] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState('00:00:00');
  const [markers, setMarkers] = useState<EventMarker[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const runningSinceRef = useRef<number | null>(null);

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === selectedPatientId) || null,
    [patients, selectedPatientId]
  );
  const selectedDevice = useMemo(
    () => devices.find((device) => device.deviceId === selectedDeviceId) || null,
    [devices, selectedDeviceId]
  );

  const { data, latestData } = useRealtimeVitals(isActive, session?.id);

  const activeMarker = useMemo(() => {
    if (markers.length === 0) return null;
    return markers[markers.length - 1].marker_type;
  }, [markers]);

  const activePhase = useMemo(() => {
    if (!activeMarker) return null;
    if (activeMarker === 'Baseline') return 'Baseline';
    if (activeMarker === 'Recovery') return 'Recovery';
    return 'Intervention';
  }, [activeMarker]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getPatients(), getDevices()])
      .then(([patientList, deviceList]) => {
        if (!isMounted) return;
        setPatients(patientList);
        setDevices(deviceList);
        if (patientList.length > 0) {
          setSelectedPatientId(patientList[0].id);
        }
        if (deviceList.length > 0) {
          setSelectedDeviceId(deviceList[0].deviceId);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Failed to load patients or devices.');
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!session) return;
    let isMounted = true;
    const refresh = async () => {
      try {
        const deviceList = await getDevices();
        if (!isMounted) return;
        setDevices(deviceList);
        if (!selectedDeviceId && deviceList.length > 0) {
          setSelectedDeviceId(deviceList[0].deviceId);
        }
      } catch {
        // ignore refresh errors
      }
    };
    const timer = window.setInterval(refresh, 8000);
    return () => {
      isMounted = false;
      window.clearInterval(timer);
    };
  }, [session?.id, selectedDeviceId]);

  useEffect(() => {
    if (!session) {
      setMarkers([]);
      return;
    }
    let isMounted = true;
    getEventMarkers(session.id)
      .then((items) => {
        if (!isMounted) return;
        setMarkers(items);
      })
      .catch(() => {
        if (!isMounted) return;
        setMarkers([]);
      });
    return () => {
      isMounted = false;
    };
  }, [session?.id]);

  useEffect(() => {
    if (!session) {
      runningSinceRef.current = null;
      setElapsedMs(0);
      setDuration('00:00:00');
      return;
    }
    setElapsedMs(0);
    runningSinceRef.current = isActive ? Date.now() : null;
  }, [session?.id]);

  useEffect(() => {
    if (!session) return;
    if (isActive) {
      if (!runningSinceRef.current) {
        runningSinceRef.current = Date.now();
      }
    } else if (runningSinceRef.current) {
      const delta = Date.now() - runningSinceRef.current;
      runningSinceRef.current = null;
      setElapsedMs((prev) => prev + delta);
    }
  }, [isActive, session?.id]);

  useEffect(() => {
    if (!session) return;
    const tick = () => {
      const base = elapsedMs + (runningSinceRef.current ? Date.now() - runningSinceRef.current : 0);
      const totalSeconds = Math.floor(base / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      setDuration(`${hours}:${minutes}:${seconds}`);
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [elapsedMs, session?.id]);

  const handleStartSession = async () => {
    setError(null);
    if (!selectedPatient || !selectedDevice) {
      setError('Select a patient and device before starting a session.');
      return;
    }
    try {
      const created = await startSession({
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        deviceId: selectedDevice.deviceId,
      });
      setSession(created);
      setIsActive(true);
    } catch {
      setError('Failed to start session. Please try again.');
    }
  };

  const handleEndSession = async () => {
    if (!session) return;
    setError(null);
    try {
      await stopSession(session.id);
      setSession(null);
      setIsActive(false);
    } catch {
      setError('Failed to stop session.');
    }
  };

  const handleAddMarker = async (type: string) => {
    if (!session) {
      setError('Start a session before adding event markers.');
      return;
    }
    try {
      const created = await createEventMarker(session.id, { marker_type: type });
      setMarkers((prev) => [...prev, created]);
    } catch {
      setError('Failed to add event marker.');
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] pb-32 sm:pb-24 space-y-6">
      
      {/* Pre-session Setup / Patient Info Header Area */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-medical-blue/20 flex flex-wrap items-end gap-6">
        <div className="flex-1">
          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Select Patient</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm font-medium focus:ring-medical-blue focus:border-medical-blue outline-none"
              value={selectedPatientId}
              onChange={(event) => setSelectedPatientId(event.target.value)}
            >
              {patients.length === 0 ? (
                <option value="">No patients registered</option>
              ) : (
                patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Connect Device</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm font-medium focus:ring-medical-blue focus:border-medical-blue outline-none"
              value={selectedDeviceId}
              onChange={(event) => setSelectedDeviceId(event.target.value)}
            >
              {devices.length === 0 ? (
                <option value="">No devices registered</option>
              ) : (
                devices.map((device) => (
                  <option key={device.id} value={device.deviceId}>
                    {device.deviceId} ({device.status})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleStartSession}
            className="rounded-lg bg-medical-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-medical-blue-dark"
          >
            Start Session
          </button>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              session || selectedDevice?.status === 'online'
                ? 'bg-green-50 text-green-600 border-green-100'
                : 'bg-gray-50 text-gray-500 border-gray-200'
            }`}
          >
            <MonitorCheck className="w-4 h-4" />
            <span className="text-xs font-bold">
              {session
                ? 'Session Active'
                : selectedDevice
                  ? selectedDevice.status === 'online'
                    ? 'Device Online'
                    : 'Device Offline'
                  : 'Ready'}
            </span>
          </div>
        </div>
        {error ? <div className="w-full text-sm text-red-600">{error}</div> : null}
        {patients.length === 0 || devices.length === 0 ? (
          <div className="w-full text-xs text-gray-500">
            {patients.length === 0 ? (
              <span>
                Add a patient in <Link to="/patients/new" className="text-medical-blue hover:underline">Patient Registration</Link>.
              </span>
            ) : null}
            {devices.length === 0 ? (
              <span className="ml-2">
                Register a device in <Link to="/dashboard/device-management" className="text-medical-blue hover:underline">Device Management</Link>.
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Main Left Timeline and Metrics */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          
          {/* Patient Info Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full items-start gap-4 sm:gap-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-medical-blue/10 flex items-center justify-center text-medical-blue">
                <Baby className="w-8 h-8" />
              </div>
              <div className="grid w-full grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Patient ID</p>
                  <p className="font-bold text-lg text-gray-900">{selectedPatient ? selectedPatient.id : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Age / Gender</p>
                  <p className="font-bold text-lg text-gray-700">
                    {selectedPatient ? `${selectedPatient.age}Y • ${selectedPatient.gender}` : 'N/A'}
                  </p>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Session Time</p>
                  <p className="font-bold text-lg text-medical-blue">{duration}</p>
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activePhase === 'Baseline' ? 'bg-medical-blue' : 'bg-gray-300'}`}></span>
                      <span className={`text-xs font-medium ${activePhase === 'Baseline' ? 'text-medical-blue font-bold' : 'text-gray-500'}`}>Baseline</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activePhase === 'Intervention' ? 'bg-medical-blue' : 'bg-gray-300'}`}></span>
                      <span className={`text-xs font-medium ${activePhase === 'Intervention' ? 'text-medical-blue font-bold' : 'text-gray-500'}`}>Intervention</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className={`w-2 h-2 rounded-full ${activePhase === 'Recovery' ? 'bg-medical-blue' : 'border border-gray-300'}`}></span>
                      <span className={`text-xs font-medium ${activePhase === 'Recovery' ? 'text-medical-blue font-bold' : 'text-gray-500'}`}>Recovery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-auto">
              <button className="w-full sm:w-auto text-medical-blue text-sm font-bold flex items-center justify-center gap-1 hover:underline">
                <History className="w-5 h-5" />
                View History
              </button>
            </div>
          </div>

          {/* Key Metrics Cards Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* GSR */}
            <MetricCard
              title="GSR (μS)"
              value={latestData.gsr.toFixed(2)}
              trendExtra={
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-medical-blue/10 text-medical-blue">
                    <Waves className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-bold">LIVE</span>
                </div>
              }
            >
              <div className="h-10 w-full flex items-center">
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-medical-blue rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, (latestData.gsr / 5) * 100))}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-gray-400">Range 0 - 5 μS</div>
            </MetricCard>

            {/* Heart Rate */}
            <MetricCard
              title="HEART RATE"
              value={latestData.heart_rate}
              unit="BPM"
              trendExtra={
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <HeartPulse className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">
                    {latestData.heart_rate > 90 ? 'HIGH' : 'NORMAL'}
                  </span>
                </div>
              }
            >
              <div className="h-10 w-full bg-gray-50 rounded relative overflow-hidden">
                <div className="absolute inset-0 flex items-center px-1">
                  <svg className="w-full h-8 stroke-red-500 fill-none" preserveAspectRatio="none" viewBox="0 0 100 20">
                    <path className="animate-[pulse_1s_ease-in-out_infinite]" d="M0 10 L10 10 L12 2 L15 18 L18 10 L40 10 L42 2 L45 18 L48 10 L70 10 L72 2 L75 18 L78 10 L100 10" strokeWidth="1.5"></path>
                  </svg>
                </div>
              </div>
            </MetricCard>

            {/* Body Temp */}
            <MetricCard
              title="BODY TEMP"
              value={latestData.temperature.toFixed(1)}
              unit="°C"
              trendExtra={
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <Thermometer className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold">
                    {(latestData.temperature * 9/5 + 32).toFixed(1)}°F
                  </span>
                </div>
              }
            >
               <div className="h-10 w-full flex items-center">
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-medical-blue rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, ((latestData.temperature - 34) / 6) * 100))}%` }}
                  ></div>
                </div>
              </div>
            </MetricCard>

            {/* Blood Pressure */}
            <MetricCard
              title="BP (SYS/DIA)"
              value={`${latestData.systolic}/${latestData.diastolic}`}
              trendExtra={
                <div className="flex items-center gap-2 text-[10px] font-bold text-medical-blue">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-medical-blue/10 text-medical-blue">
                    <Activity className="h-4 w-4" />
                  </span>
                  MAP: {Math.round((latestData.systolic + 2 * latestData.diastolic) / 3)}
                </div>
              }
            >
              <div className="h-10 w-full flex items-center">
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-medical-blue rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, ((latestData.systolic - 80) / 80) * 100))}%` }}
                  ></div>
                </div>
              </div>
            </MetricCard>
          </div>

          {/* Combined Signal Chart */}
          <div className="w-full h-[350px]">
            <MultiSignalChart
              data={data}
              markers={markers.map((marker) => ({
                timestamp: Date.parse(marker.created_at),
                type: marker.marker_type,
              }))}
              height="h-full"
            />
          </div>
        </div>

        {/* Right Insights and Marker Panel */}
        <div className="col-span-12 lg:col-span-3 pb-6">
          <SessionRightPanel 
            onAddMarker={handleAddMarker} 
            latestData={latestData} 
            markers={markers}
            activeMarker={activeMarker}
          />
        </div>
      </div>

      {/* Floating Sticky Bottom Control Bar */}
      <SessionControlBar 
        isActive={isActive} 
        onTogglePlay={() => setIsActive(!isActive)} 
        elapsedTime={duration}
        onEnd={session ? handleEndSession : undefined}
      />
    </div>
  );
}


