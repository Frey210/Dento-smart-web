import { Outlet } from 'react-router-dom';
import logo from '../assets/logo.png';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <img src={logo} alt="Logo" className="h-14 w-14 mb-3 object-contain" />
        <h2 className="text-center text-3xl font-black tracking-tight text-medical-blue">
          DENTO SMART&trade;
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 font-medium">
          Smart Dental Anxiety Monitoring System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
