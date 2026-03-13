import { useEffect, useState } from 'react';
import { Calendar, Clock, Filter, Search } from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { mockServices } from '../../services/mock';
import type { Session } from '../../types';

export function PatientSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await mockServices.getSessions();
        setSessions(data);
      } catch (error) {
        console.error("Failed to load sessions", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);

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
      cell: () => (
        <button className="text-medical-blue hover:text-medical-blue-dark font-medium text-sm">
          View Report
        </button>
      ),
    }
  ];

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
          <button type="button" className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <Filter className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-medical-blue sm:text-sm sm:leading-6"
            placeholder="Search sessions by patient name or ID..."
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-medical-blue border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
        </div>
      ) : (
        <DataTable data={sessions} columns={columns} keyExtractor={(item) => item.id} />
      )}
    </div>
  );
}
