import { Bell, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMe, type CurrentUser } from '../services/authService';

interface TopNavbarProps {
  title?: string;
  onMenuClick?: () => void;
}

export function TopNavbar({ title, onMenuClick }: TopNavbarProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    let isMounted = true;
    getMe()
      .then((data) => {
        if (isMounted) setUser(data);
      })
      .catch(() => {
        if (isMounted) setUser(null);
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
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{title || 'Dashboard'}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" aria-hidden="true" />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-medical-blue">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-medium text-gray-700">{user?.name || 'Account'}</span>
            <span className="text-[11px] text-gray-400">{user?.role || ''}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
