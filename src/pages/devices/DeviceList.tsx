import { useEffect, useState } from 'react';
import { Plus, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { deleteDevice, getDevices } from '../../services/deviceService';
import type { Device } from '../../types';
import { useToast } from '../../components/Toast';

export function DeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await getDevices();
        setDevices(data);
      } catch (error) {
        console.error('Failed to load devices', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDevices();
    const timer = window.setInterval(fetchDevices, 8000);
    return () => window.clearInterval(timer);
  }, []);

  const handleDelete = async (deviceId: string) => {
    if (!window.confirm('Delete this device? This cannot be undone.')) return;
    try {
      await deleteDevice(deviceId);
      setDevices((prev) => prev.filter((item) => item.deviceId !== deviceId));
      addToast('Device deleted.', 'success');
    } catch (error) {
      console.error('Failed to delete device', error);
      addToast('Failed to delete device.', 'error');
    }
  };

  const columns: Column<Device>[] = [
    {
      header: 'Device ID',
      cell: (device) => (
        <div className="flex items-center">
          <Server className="mr-2 h-4 w-4 text-gray-400" />
          <span className="font-mono text-sm text-gray-900">{device.deviceId}</span>
        </div>
      )
    },
    { header: 'Device Name', accessorKey: 'deviceName', className: 'font-medium text-gray-900' },
    { header: 'Firmware', accessorKey: 'firmware', className: 'text-gray-500 font-mono text-sm' },
    { header: 'Status', accessorKey: 'status' },
    {
      header: 'Actions',
      cell: (device) => (
        <button
          onClick={() => handleDelete(device.deviceId)}
          className="text-red-600 hover:text-red-700 font-medium text-sm"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Devices
          </h2>
          <p className="mt-1 text-sm text-gray-500">Review registered devices assigned to your account.</p>
        </div>
        <div className="mt-4 flex sm:mt-0 sm:ml-4">
          <Link
            to="/devices/new"
            className="inline-flex items-center rounded-md bg-medical-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-medical-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-medical-blue"
          >
            <Plus className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
            Add Device
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-medical-blue border-r-transparent align-[-0.125em]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
        </div>
      ) : (
        <DataTable data={devices} columns={columns} keyExtractor={(item) => item.id} />
      )}
    </div>
  );
}
