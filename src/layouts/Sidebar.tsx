import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  Activity,
  Users,
  BarChart2,
  FileText,
  Server,
  Sliders,
  UserPlus,
  Settings,
  LogOut
} from 'lucide-react';

const navigationGroups = [
  {
    name: 'Dashboard',
    items: [
      { name: 'Live Monitoring', href: '/dashboard/live-monitoring', icon: Activity },
      { name: 'Patient Sessions', href: '/dashboard/patient-sessions', icon: Users },
    ],
  },
  {
    name: 'Patients',
    items: [
      { name: 'Patient List', href: '/patients', icon: Users },
      { name: 'Add Patient', href: '/patients/new', icon: UserPlus },
    ],
  },
  {
    name: 'Devices',
    items: [
      { name: 'Device Management', href: '/dashboard/device-management', icon: Server },
      { name: 'Calibration', href: '/dashboard/calibration', icon: Sliders },
      { name: 'Add Device', href: '/devices/new', icon: Server },
    ],
  },
  {
    name: 'Research',
    items: [
      { name: 'Research Analytics', href: '/dashboard/research-analytics', icon: BarChart2 },
      { name: 'Reporting', href: '/dashboard/reporting', icon: FileText },
    ],
  },
  {
    name: 'Settings',
    items: [
      { name: 'Account', href: '#', icon: Settings },
      { name: 'Logout', href: '/login', icon: LogOut },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-[100vh] w-64 flex-col border-r bg-white overflow-hidden pb-12 z-50">
      {/* Brand */}
      <div className="flex flex-shrink-0 items-center gap-3 p-5 border-b bg-white">
        <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-medical-blue leading-none mb-1">
            DENTO SMART&trade;
          </span>
          <span className="text-[10px] leading-tight text-gray-400 font-medium">
            Smart Dental Anxiety Monitoring<br/>System
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 px-3 py-6 overflow-y-auto w-full">
        {navigationGroups.map((group) => (
          <div key={group.name}>
            <h3
              className="px-3 text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2 flex justify-between items-center"
            >
              {group.name}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname.startsWith(item.href) && item.href !== '#';
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-blue-50 text-medical-blue'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-medical-blue'
                      }
                    `}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 shrink-0 transition-colors
                        ${isActive ? 'text-medical-blue' : 'text-gray-400 group-hover:text-medical-blue'}
                      `}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / User short info */}
      <div className="flex-shrink-0 border-t p-4 text-xs text-gray-500 text-center bg-gray-50/50 mt-auto">
        &copy; 2026 DENTO SMART™
        <br />
        Smart Dental Anxiety Monitoring System
      </div>
    </div>
  );
}
