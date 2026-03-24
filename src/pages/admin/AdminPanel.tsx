import { useEffect, useState } from 'react';
import type { AdminDevice, AdminUser } from '../../types';
import { getAdminDevices, getAdminUsers, provisionDevice, unassignDevice, updateUserRole, updateUserStatus } from '../../services/adminService';
import { getMe } from '../../services/authService';

type TabKey = 'devices' | 'users';

export function AdminPanel() {
  const [tab, setTab] = useState<TabKey>('devices');
  const [devices, setDevices] = useState<AdminDevice[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ deviceId: '', deviceName: '', firmware: '' });

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await getMe();
      setIsAdmin(me.role === 'admin');
      if (me.role !== 'admin') {
        setLoading(false);
        return;
      }
      const [deviceList, userList] = await Promise.all([getAdminDevices(), getAdminUsers()]);
      setDevices(deviceList);
      setUsers(userList);
    } catch {
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleProvision = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!form.deviceId) {
      setError('Device ID is required.');
      return;
    }
    try {
      await provisionDevice({
        deviceId: form.deviceId,
        deviceName: form.deviceName || undefined,
        firmware: form.firmware || undefined,
      });
      setForm({ deviceId: '', deviceName: '', firmware: '' });
      await loadAll();
    } catch {
      setError('Failed to add device ID.');
    }
  };

  const handleUnassign = async (deviceId: string) => {
    setError(null);
    try {
      await unassignDevice(deviceId);
      await loadAll();
    } catch {
      setError('Failed to unassign device from user.');
    }
  };

  const handleRoleChange = async (userId: string, role: AdminUser['role']) => {
    setError(null);
    try {
      await updateUserRole(userId, role);
      await loadAll();
    } catch {
      setError('Failed to update user role.');
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    setError(null);
    try {
      await updateUserStatus(userId, isActive);
      await loadAll();
    } catch {
      setError('Failed to update user status.');
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading admin console...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Admin Console</h2>
        <p className="mt-2 text-sm text-gray-600">Access is restricted to admin accounts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Console</h2>
        <p className="text-sm text-gray-500">Manage claimable device IDs and user accounts.</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('devices')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            tab === 'devices' ? 'bg-medical-blue text-white' : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          Devices
        </button>
        <button
          onClick={() => setTab('users')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            tab === 'users' ? 'bg-medical-blue text-white' : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          Users
        </button>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      {tab === 'devices' ? (
        <div className="space-y-6">
          <form onSubmit={handleProvision} className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900">Add Device ID</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <input
                type="text"
                value={form.deviceId}
                onChange={(event) => setForm((prev) => ({ ...prev, deviceId: event.target.value }))}
                placeholder="ESP32-C3-021"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={form.deviceName}
                onChange={(event) => setForm((prev) => ({ ...prev, deviceName: event.target.value }))}
                placeholder="Device name (optional)"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={form.firmware}
                onChange={(event) => setForm((prev) => ({ ...prev, firmware: event.target.value }))}
                placeholder="Firmware (optional)"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="mt-4 rounded-lg bg-medical-blue px-4 py-2 text-sm font-semibold text-white"
            >
              Save
            </button>
          </form>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900">Provisioned Devices</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-gray-400">
                  <tr>
                    <th className="py-2">Device ID</th>
                    <th className="py-2">Name</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Owner</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr key={device.id} className="border-t">
                      <td className="py-2 font-mono text-xs">{device.deviceId}</td>
                      <td className="py-2">{device.deviceName}</td>
                      <td className="py-2">{device.status}</td>
                      <td className="py-2">{device.ownerEmail || 'Available'}</td>
                      <td className="py-2">
                        {device.ownerId ? (
                          <button
                            onClick={() => handleUnassign(device.deviceId)}
                            className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-600"
                          >
                            Unassign
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-900">Users</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-gray-400">
                <tr>
                  <th className="py-2">Nama</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="py-2">{user.name}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">
                      <select
                        value={user.role}
                        onChange={(event) => handleRoleChange(user.id, event.target.value as AdminUser['role'])}
                        className="rounded-md border border-gray-200 px-2 py-1 text-xs"
                      >
                        <option value="doctor">Doctor</option>
                        <option value="researcher">Researcher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => handleStatusChange(user.id, !user.is_active)}
                        className={`rounded-md px-3 py-1 text-xs ${
                          user.is_active
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
