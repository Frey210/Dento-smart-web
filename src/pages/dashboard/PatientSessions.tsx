import { useEffect, useState } from 'react';
import { Calendar, Clock, Filter, Search } from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { deleteSession, getSessions, getSessionData, getSessionSummary } from '../../services/sessionService';
import { getEventMarkers } from '../../services/eventMarkerService';
import type { Session } from '../../types';
import { MultiSignalChart } from '../../components/MultiSignalChart';
import { useToast } from '../../components/Toast';

export function PatientSessions() {
  const defaultHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const apiBase = import.meta.env.VITE_API_BASE_URL || `http://${defaultHost}:8000/api`;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessionRows, setSessionRows] = useState<any[]>([]);
  const [sessionSummary, setSessionSummary] = useState<any | null>(null);
  const [sessionMarkers, setSessionMarkers] = useState<any[]>([]);
  const [isRowsLoading, setIsRowsLoading] = useState(false);
  const [rowsError, setRowsError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [patientFilter, setPatientFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (error) {
        console.error("Failed to load sessions", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
    const timer = window.setInterval(fetchSessions, 8000);
    return () => window.clearInterval(timer);
  }, []);

  const handleView = async (session: Session) => {
    setSelectedSession(session);
    setIsRowsLoading(true);
    setRowsError(null);
    try {
      const [rows, summary, markers] = await Promise.all([
        getSessionData(session.id),
        getSessionSummary(session.id),
        getEventMarkers(session.id),
      ]);
      setSessionRows(rows);
      setSessionSummary(summary);
      setSessionMarkers(markers);
    } catch (error) {
      console.error('Failed to load session data', error);
      setRowsError('Failed to load session data.');
      setSessionRows([]);
      setSessionSummary(null);
      setSessionMarkers([]);
    } finally {
      setIsRowsLoading(false);
    }
  };

  const handleExport = async (sessionId: string, format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${apiBase}/export/${sessionId}?format=${format}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `session-${sessionId}.${format}`;
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

  const columns: Column<Session>[] = [
    {
      header: 'Session ID',
      accessorKey: 'id',
      className: 'font-medium text-gray-900',
    },
    {
      header: 'Patient Name',
      accessorKey: 'patientName',
    },
    {
      header: 'Date',
      cell: (session) => (
        <div className="flex items-center text-gray-500">
          <Calendar className="mr-2 h-4 w-4" />
          {session.date}
        </div>
      ),
    },
    {
      header: 'Duration',
      cell: (session) => (
        <div className="flex items-center text-gray-500">
          <Clock className="mr-2 h-4 w-4" />
          {session.duration}
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (session) => (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
          session.status === 'active' 
            ? 'bg-green-50 text-green-700 ring-green-600/20' 
            : 'bg-gray-50 text-gray-600 ring-gray-500/10'
        }`}>
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (session) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleView(session)}
            className="text-medical-blue hover:text-medical-blue-dark font-medium text-sm"
          >
            View Report
          </button>
          <button
            onClick={async () => {
              if (!window.confirm('Delete this session? This cannot be undone.')) return;
              try {
                await deleteSession(session.id);
                setSessions((prev) => prev.filter((item) => item.id !== session.id));
                if (selectedSession?.id === session.id) {
                  setSelectedSession(null);
                  setSessionRows([]);
                  setSessionSummary(null);
                }
                addToast('Session deleted.', 'success');
              } catch (error) {
                console.error('Failed to delete session', error);
                addToast('Failed to delete session.', 'error');
              }
            }}
            className="text-red-600 hover:text-red-700 font-medium text-sm"
          >
            Delete
          </button>
        </div>
      ),
    }
  ];

  const patientOptions = Array.from(
    new Set(sessions.map((session) => session.patientName).filter(Boolean))
  ).sort();

  const toDateValue = (value?: string | null) => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  };

  const filteredSessions = sessions.filter((session) => {
    const term = query.trim().toLowerCase();
    const matchesQuery =
      !term ||
      session.id.toLowerCase().includes(term) ||
      (session.patientName ?? '').toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesPatient =
      patientFilter === 'all' || (session.patientName ?? '') === patientFilter;
    const sessionDate =
      toDateValue(session.started_at) ||
      toDateValue(session.date) ||
      toDateValue(session.ended_at);
    const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const toDate = dateTo ? new Date(`${dateTo}T23:59:59`) : null;
    const matchesDate =
      (!fromDate && !toDate) ||
      (sessionDate &&
        (!fromDate || sessionDate >= fromDate) &&
        (!toDate || sessionDate <= toDate));
    return matchesQuery && matchesStatus && matchesPatient && matchesDate;
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Patient Sessions
          </h2>
          <p className="mt-1 text-sm text-gray-500">View and manage all recorded monitoring sessions.</p>
        </div>
      <div className="mt-4 flex sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={() =>
              setStatusFilter((prev) =>
                prev === 'all' ? 'active' : prev === 'active' ? 'completed' : 'all'
              )
            }
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <Filter className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
            {statusFilter === 'all' ? 'All Sessions' : statusFilter === 'active' ? 'Active Only' : 'Completed Only'}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-medical-blue sm:text-sm sm:leading-6"
            placeholder="Search sessions by patient name or ID..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <select
          className="w-full rounded-md border-0 bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-medical-blue sm:w-auto"
          value={patientFilter}
          onChange={(event) => setPatientFilter(event.target.value)}
        >
          <option value="all">All Patients</option>
          {patientOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <input
            type="date"
            className="w-full rounded-md border-0 bg-white px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-medical-blue sm:w-auto"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
          />
          <span className="hidden text-xs text-gray-400 sm:inline">to</span>
          <input
            type="date"
            className="w-full rounded-md border-0 bg-white px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-medical-blue sm:w-auto"
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={() =>
            setStatusFilter((prev) =>
              prev === 'all' ? 'active' : prev === 'active' ? 'completed' : 'all'
            )
          }
          className="inline-flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
        >
          <Filter className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
          {statusFilter === 'all' ? 'All Sessions' : statusFilter === 'active' ? 'Active Only' : 'Completed Only'}
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-medical-blue border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
        </div>
      ) : (
        <DataTable data={filteredSessions} columns={columns} keyExtractor={(item) => item.id} />
      )}

      {selectedSession ? (
        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Session Data</h3>
              <p className="text-sm text-gray-500">Session ID: {selectedSession.id}</p>
            </div>
            <div className="text-sm text-gray-500 sm:text-right">
              {selectedSession.patientName ? `Patient: ${selectedSession.patientName}` : null}
            </div>
          </div>

          {isRowsLoading ? (
            <div className="py-6 text-sm text-gray-500">Loading session data...</div>
          ) : rowsError ? (
            <div className="py-6 text-sm text-red-600">{rowsError}</div>
          ) : sessionRows.length === 0 ? (
            <div className="py-6 text-sm text-gray-500">No sensor data recorded for this session.</div>
          ) : (
            <div className="mt-4 space-y-6">
              {sessionSummary ? (
                <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4 text-sm">
                  <div>
                    <p className="text-xs uppercase text-gray-400">Total Records</p>
                    <p className="font-semibold text-gray-900">{sessionSummary.total_records}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400">Last Timestamp</p>
                    <p className="font-semibold text-gray-900">{sessionSummary.last_timestamp ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400">Avg Heart Rate</p>
                    <p className="font-semibold text-gray-900">{sessionSummary.avg_heart_rate?.toFixed?.(1) ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400">Avg GSR</p>
                    <p className="font-semibold text-gray-900">{sessionSummary.avg_gsr?.toFixed?.(2) ?? 'N/A'}</p>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  onClick={() => handleExport(selectedSession.id, 'csv')}
                  className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => handleExport(selectedSession.id, 'xlsx')}
                  className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
                >
                  Export Excel
                </button>
                <button
                  onClick={() => handleExport(selectedSession.id, 'pdf')}
                  className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
                >
                  Export PDF
                </button>
              </div>

              <MultiSignalChart
                data={sessionRows.map((row) => ({
                  timestamp: typeof row.timestamp === 'string' ? Date.parse(row.timestamp) : row.timestamp,
                  gsr: row.gsr,
                  heart_rate: row.heart_rate ?? row.heartRate,
                  temperature: row.temperature,
                  systolic: row.blood_pressure_sys ?? row.systolic,
                  diastolic: row.blood_pressure_dia ?? row.diastolic,
                }))}
                markers={sessionMarkers.map((marker) => ({
                  timestamp: Date.parse(marker.created_at),
                  type: marker.marker_type,
                }))}
                height="h-[260px]"
              />

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-3 py-2">Timestamp</th>
                      <th className="px-3 py-2">GSR</th>
                      <th className="px-3 py-2">Heart Rate</th>
                      <th className="px-3 py-2">Temp</th>
                      <th className="px-3 py-2">Sys</th>
                      <th className="px-3 py-2">Dia</th>
                      <th className="px-3 py-2">Anxiety</th>
                      <th className="px-3 py-2">Marker</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sessionRows.slice(-200).map((row) => (
                      <tr key={`${row.timestamp}-${row.gsr}`}>
                        <td className="px-3 py-2 text-gray-600">{row.timestamp}</td>
                        <td className="px-3 py-2">{row.gsr}</td>
                        <td className="px-3 py-2">{row.heart_rate ?? row.heartRate}</td>
                        <td className="px-3 py-2">{row.temperature}</td>
                        <td className="px-3 py-2">{row.blood_pressure_sys ?? row.systolic}</td>
                        <td className="px-3 py-2">{row.blood_pressure_dia ?? row.diastolic}</td>
                        <td className="px-3 py-2">{row.anxiety_score ?? '—'}</td>
                        <td className="px-3 py-2">{row.event_marker ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
