import { useEffect, useState } from 'react';
import { Plus, User, Search } from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { mockServices } from '../../services/mock';
import type { Patient } from '../../types';

export function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await mockServices.getPatients();
        setPatients(data);
      } catch (error) {
        console.error("Failed to load patients", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const columns: Column<Patient>[] = [
    {
      header: 'Patient Name',
      cell: (patient) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex flex-shrink-0 items-center justify-center mr-3">
            <User className="h-4 w-4 text-medical-blue" />
          </div>
          <div className="font-medium text-gray-900">{patient.name}</div>
        </div>
      ),
    },
    { header: 'Age', accessorKey: 'age' },
    { header: 'Gender', accessorKey: 'gender' },
    { header: 'Date of Birth', accessorKey: 'dateOfBirth' },
    { header: 'Guardian', accessorKey: 'guardianName', className: 'hidden sm:table-cell' },
    {
      header: 'Actions',
      cell: () => (
        <button className="text-medical-blue hover:text-medical-blue-dark font-medium text-sm">
          View Profile
        </button>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Patients Registry
          </h2>
          <p className="mt-1 text-sm text-gray-500">Manage patient records and clinical information.</p>
        </div>
        <div className="mt-4 flex sm:mt-0 sm:ml-4">
          <button type="button" className="inline-flex items-center rounded-md bg-medical-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-medical-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-medical-blue">
            <Plus className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
            Add New Patient
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
            placeholder="Search patients by name or ID..."
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-medical-blue border-r-transparent align-[-0.125em]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
        </div>
      ) : (
        <DataTable data={patients} columns={columns} keyExtractor={(item) => item.id} />
      )}
    </div>
  );
}
