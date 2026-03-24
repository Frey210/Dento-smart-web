import { useState, type FormEvent } from 'react';
import { Card } from '../../components/Card';
import { Server, Cpu } from 'lucide-react';
import { registerDevice } from '../../services/deviceService';
import { useToast } from '../../components/Toast';

export function AddDevice() {
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    

    const trimmedId = deviceId.trim();
    if (!trimmedId) {
      setError('Please enter a device ID.');
      return;
    }

    try {
      setIsSubmitting(true);
      await registerDevice({
        deviceId: trimmedId,
        deviceName: deviceName.trim() || undefined,
      });
      addToast('Device registered successfully.', 'success');
      setDeviceId('');
      setDeviceName('');
    } catch (submitError) {
      console.error('Failed to register device', submitError);
      setError('Failed to register device. Make sure the device ID is provisioned.');
      addToast('Failed to register device. Make sure the device ID is provisioned.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Register New Device
          </h2>
          <p className="mt-1 text-sm text-gray-500">Pair a new ESP32 monitoring unit with the system.</p>
        </div>
      </div>

      <Card className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
            
            <div className="sm:col-span-6">
              <label htmlFor="device-id" className="block text-sm font-medium leading-6 text-gray-900">
                Hardware Device ID (MAC Address or Tag)
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Cpu className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="device-id"
                  id="device-id"
                  placeholder="e.g. ESP32-A1-B2-C3"
                  value={deviceId}
                  onChange={(event) => setDeviceId(event.target.value)}
                  className="block w-full font-mono rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-medical-blue sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="device-name" className="block text-sm font-medium leading-6 text-gray-900">
                Friendly Name
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Server className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="device-name"
                  id="device-name"
                  placeholder="e.g. Chair 3 Monitor"
                  value={deviceName}
                  onChange={(event) => setDeviceName(event.target.value)}
                  className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-medical-blue sm:text-sm sm:leading-6"
                />
              </div>
            </div>

          </div>
          
          <div className="mt-8 flex items-center justify-end border-t border-gray-100 pt-6 gap-x-4">
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-medical-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-medical-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-medical-blue"
            >
              {isSubmitting ? 'Registering...' : 'Verify & Register'}
            </button>
          </div>
        </form>
      </Card>
      
      <Card className="p-6 bg-blue-50/50 border-blue-100">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Device Pairing Instructions</h4>
        <ol className="list-decimal list-inside text-sm text-blue-800 space-y-2">
          <li>Ensure the ESP32 array is powered on and flashing green.</li>
          <li>Connect the device to the local clinical Wi-Fi network.</li>
          <li>Enter the MAC ID printed on the bottom of the sensor housing.</li>
          <li>Click 'Verify' to test the MQTT handshake.</li>
        </ol>
      </Card>
    </div>
  );
}
