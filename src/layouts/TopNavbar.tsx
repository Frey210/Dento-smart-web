import { Bell, UserCircle } from 'lucide-react';

interface TopNavbarProps {
  title?: string;
}

export function TopNavbar({ title }: TopNavbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-gray-900">{title || 'Dashboard'}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" aria-hidden="true" />
        </button>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center max-w-xs rounded-full bg-white text-sm focus:outline-none">
            <span className="sr-only">Open user menu</span>
            <UserCircle className="h-8 w-8 text-gray-400" />
          </button>
          <span className="text-sm font-medium text-gray-700">Dr. Clinician</span>
        </div>
      </div>
    </header>
  );
}
