import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

export function PageLayout() {
  const location = useLocation();
  
  // Basic heuristic to generate a title from the path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const rawTitle = pathParts[pathParts.length - 1] || 'Dashboard';
  const title = rawTitle
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
