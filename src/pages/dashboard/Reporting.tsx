import { FileText, FileSpreadsheet } from 'lucide-react';

export function Reporting() {
  const handleExport = (format: string) => {
    alert(`Exporting dummy report in ${format} format...`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Data Reporting
          </h2>
          <p className="mt-1 text-sm text-gray-500">Generate and export clinical and research reports.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Export Configuration</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Range</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring-medical-blue sm:text-sm p-2 border">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Year to Date</option>
              <option>Custom Range...</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient Data Included</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring-medical-blue sm:text-sm p-2 border">
              <option>Anonymized (Research)</option>
              <option>Full Clinical Records</option>
            </select>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Export Formats</h4>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleExport('CSV')}
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <FileSpreadsheet className="-ml-1 mr-2 h-5 w-5 text-green-600" />
              Export as CSV
            </button>
            <button
              onClick={() => handleExport('Excel')}
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <FileSpreadsheet className="-ml-1 mr-2 h-5 w-5 text-emerald-600" />
              Export as Excel
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <FileText className="-ml-1 mr-2 h-5 w-5 text-red-600" />
              Export as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
