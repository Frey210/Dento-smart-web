import { Card } from '../../components/Card';
import { User, Calendar as CalendarIcon, Phone, UserCheck, AlertTriangle } from 'lucide-react';

export function NewPatient() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Register New Patient
          </h2>
          <p className="mt-1 text-sm text-gray-500">Add a new pediatric patient to the monitoring registry.</p>
        </div>
      </div>

      <Card className="p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            
            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                First name
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-medical-blue sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                Last name
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-medical-blue sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="dob" className="block text-sm font-medium leading-6 text-gray-900">
                Date of Birth
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-medical-blue sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                Gender
              </label>
              <div className="mt-2">
                <select
                  id="gender"
                  name="gender"
                  className="block w-full rounded-md border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-medical-blue sm:text-sm sm:leading-6 bg-white"
                >
                  <option>Select...</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6 border-t border-gray-100 pt-6"></div>

            <div className="sm:col-span-3">
              <label htmlFor="guardian" className="block text-sm font-medium leading-6 text-gray-900">
                Guardian Full Name
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserCheck className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="guardian"
                  id="guardian"
                  className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-medical-blue sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                Guardian Phone
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-medical-blue sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-6 border-t border-gray-100 pt-6"></div>

            <div className="sm:col-span-6">
              <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900 flex items-center">
                <AlertTriangle className="h-4 w-4 text-gray-400 mr-2" />
                Medical & Anxiety Notes
              </label>
              <div className="mt-2">
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-medical-blue sm:text-sm sm:leading-6"
                  placeholder="Record any known dental anxiety history, allergies, or special requirements..."
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
              className="rounded-md bg-medical-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-medical-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-medical-blue"
            >
              Save Patient Record
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
