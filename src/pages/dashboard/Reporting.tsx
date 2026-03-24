import { useEffect, useState } from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { getSessions } from '../../services/sessionService';
import { getPatients } from '../../services/patientService';
import type { Session } from '../../types';
import { useToast } from '../../components/Toast';

export function Reporting() {
  const defaultHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const apiBase = import.meta.env.VITE_API_BASE_URL || `http://${defaultHost}:8000/api`;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [patients, setPatients] = useState<{ id: string; name: string }[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('all');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [rangePreset, setRangePreset] = useState('7');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [includePatient, setIncludePatient] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const [sessionData, patientData] = await Promise.all([getSessions(), getPatients()]);
        setSessions(sessionData);
        setPatients(patientData);
        if (sessionData.length > 0) {
          setSelectedSessionId(sessionData[0].id);
        }
      } catch (error) {
        console.error('Failed to load sessions', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter((session) => {
    const matchesPatient =
      selectedPatientId === 'all' || session.patientId === selectedPatientId;
    if (!matchesPatient) return false;
    if (!session.started_at) return true;
    const sessionDate = new Date(session.started_at);
    if (rangePreset === 'custom' && customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      end.setHours(23, 59, 59, 999);
      return sessionDate >= start && sessionDate <= end;
    }
    if (rangePreset === '7' || rangePreset === '30') {
      const days = rangePreset === '7' ? 7 : 30;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      return sessionDate >= cutoff;
    }
    if (rangePreset === 'ytd') {
      const start = new Date(new Date().getFullYear(), 0, 1);
      return sessionDate >= start;
    }
    return true;
  });

  useEffect(() => {
    if (filteredSessions.length > 0) {
      setSelectedSessionId(filteredSessions[0].id);
    } else {
      setSelectedSessionId('');
    }
  }, [selectedPatientId, rangePreset, customStart, customEnd, sessions.length]);

  const downloadExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    if (!selectedSessionId) {
      addToast('Select a session first.', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${apiBase}/export/${selectedSessionId}?format=${format}&include_patient=${includePatient}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `session-${selectedSessionId}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      addToast(`Report exported as ${format.toUpperCase()}.`, 'success');
    } catch (error) {
      console.error('Export failed', error);
      addToast('Failed to export report.', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Data Reporting
          </h2>
          <p className="mt-1 text-sm text-gray-500">Generate and export clinical and research reports.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Export Configuration</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient</label>
            <select
              value={selectedPatientId}
              onChange={(event) => setSelectedPatientId(event.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring-medical-blue sm:text-sm p-2 border"
            >
              <option value="all">All Patients</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Session</label>
            <select
              value={selectedSessionId}
              onChange={(event) => setSelectedSessionId(event.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring-medical-blue sm:text-sm p-2 border"
            >
              {isLoading ? (
                <option>Loading sessions...</option>
              ) : filteredSessions.length === 0 ? (
                <option>No sessions available</option>
              ) : (
                filteredSessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.patientName ? `${session.patientName} • ` : ''}{session.id}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Range</label>
            <select
              value={rangePreset}
              onChange={(event) => setRangePreset(event.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring-medical-blue sm:text-sm p-2 border"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="ytd">Year to Date</option>
              <option value="custom">Custom Range...</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="include-patient"
              type="checkbox"
              checked={includePatient}
              onChange={(event) => setIncludePatient(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-medical-blue focus:ring-medical-blue"
            />
            <label htmlFor="include-patient" className="text-sm font-medium text-gray-700">
              Include patient details in export
            </label>
          </div>
        </div>

        {rangePreset === 'custom' ? (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={customStart}
                onChange={(event) => setCustomStart(event.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring-medical-blue sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={customEnd}
                onChange={(event) => setCustomEnd(event.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring-medical-blue sm:text-sm p-2 border"
              />
            </div>
          </div>
        ) : null}
        
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Export Formats</h4>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => downloadExport('csv')}
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <FileSpreadsheet className="-ml-1 mr-2 h-5 w-5 text-green-600" />
              Export as CSV
            </button>
            <button
              onClick={() => downloadExport('xlsx')}
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <FileSpreadsheet className="-ml-1 mr-2 h-5 w-5 text-emerald-600" />
              Export as Excel
            </button>
            <button
              onClick={() => downloadExport('pdf')}
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <FileText className="-ml-1 mr-2 h-5 w-5 text-red-600" />
              Export as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
