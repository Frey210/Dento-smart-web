import { Activity, ClipboardList, Users, Cpu, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

const items = [
  { to: '/dashboard/live-monitoring', label: 'Live', icon: Activity, match: '/dashboard/live-monitoring' },
  { to: '/dashboard/patient-sessions', label: 'Sessions', icon: ClipboardList, match: '/dashboard/patient-sessions' },
  { to: '/patients', label: 'Patients', icon: Users, match: '/patients' },
  { to: '/dashboard/device-management', label: 'Devices', icon: Cpu, match: '/dashboard/device-management' },
  { to: '/dashboard/reporting', label: 'Reports', icon: FileText, match: '/dashboard/reporting' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-around px-2">
        {items.map((item) => {
          const isActive =
            location.pathname === item.match || location.pathname.startsWith(`${item.match}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold',
                isActive ? 'text-medical-blue' : 'text-gray-500'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive ? 'text-medical-blue' : 'text-gray-400')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
