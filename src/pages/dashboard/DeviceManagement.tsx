import { useEffect, useState } from 'react';
import { Plus, Server, Activity, AlertCircle, RefreshCw } from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { mockServices } from '../../services/mock';
import type { Device } from '../../types';

export function DeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await mockServices.getDevices();
        setDevices(data);
      } catch (error) {
        console.error("Failed to load devices", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDevices();
  }, []);

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
    {
      header: 'Status',
      cell: (device) => {
        let BadgeIcon = Activity;
        let badgeClass = 'bg-gray-50 text-gray-600 ring-gray-500/10';
        
        switch (device.status) {
          case 'online':
            badgeClass = 'bg-green-50 text-green-700 ring-green-600/20';
            break;
          case 'offline':
            BadgeIcon = AlertCircle;
            badgeClass = 'bg-red-50 text-red-700 ring-red-600/20';
            break;
          case 'calibrating':
            BadgeIcon = RefreshCw;
            badgeClass = 'bg-yellow-50 text-yellow-800 ring-yellow-600/20';
            break;
        }

        return (
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${badgeClass}`}>
            <BadgeIcon className="mr-1 h-3 w-3" />
            {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
          </span>
        );
      },
    },
    {
      header: 'Battery',
      cell: (device) => {
        if (device.batteryLevel === undefined) return <span className="text-gray-400">N/A</span>;
        
        let colorClass = 'bg-green-500';
        if (device.batteryLevel < 20) colorClass = 'bg-red-500';
        else if (device.batteryLevel < 50) colorClass = 'bg-yellow-500';
        
        return (
          <div className="flex items-center">
            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
              <div className={`${colorClass} h-2 rounded-full`} style={{ width: `${device.batteryLevel}%` }}></div>
            </div>
            <span className="text-sm text-gray-600">{device.batteryLevel}%</span>
          </div>
        );
      }
    },
    {
      header: 'Actions',
      cell: () => (
        <button className="text-medical-blue hover:text-medical-blue-dark font-medium text-sm">
          Settings
        </button>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Device Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">Monitor and manage connected IoT sensor devices.</p>
        </div>
        <div className="mt-4 flex sm:mt-0 sm:ml-4">
          <button type="button" className="inline-flex items-center rounded-md bg-medical-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-medical-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-medical-blue">
            <Plus className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
            Register Device
          </button>
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
