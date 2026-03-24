import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, type CurrentUser, logout } from '../../services/authService';

export function AccountSettings() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    getMe()
      .then((data) => {
        if (isMounted) setUser(data);
      })
      .catch(() => {
        if (isMounted) setError('Failed to load account details.');
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        <p className="text-sm text-gray-500">Review your profile information and access level.</p>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-lg font-semibold text-medical-blue">
            {initials}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user?.name || 'Account'}</h3>
            <p className="text-sm text-gray-500">{user?.email || '-'}</p>
            <p className="text-xs uppercase text-gray-400 mt-1">{user?.role || ''}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs text-gray-400">User ID</p>
            <p className="text-sm font-medium text-gray-900">{user?.id || '-'}</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs text-gray-400">Member Since</p>
            <p className="text-sm font-medium text-gray-900">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={async () => {
            await logout();
            navigate('/login');
          }}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
