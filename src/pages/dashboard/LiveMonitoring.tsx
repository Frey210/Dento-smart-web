import { useState } from 'react';
import { Activity, MonitorCheck, Baby, History } from 'lucide-react';
import { MetricCard } from '../../components/Card';
import { MultiSignalChart } from '../../components/MultiSignalChart';
import { SessionRightPanel } from '../../components/SessionRightPanel';
import { SessionControlBar } from '../../components/SessionControlBar';
import { useRealtimeVitals } from '../../hooks/useRealtimeVitals';

export function LiveMonitoring() {
  const [isActive, setIsActive] = useState(true);
  
  // Realtime simulated data bounded logic
  const { data, latestData, addMarker } = useRealtimeVitals(isActive);

  // Compute a mock session duration for display
  const [duration] = useState('14:22');

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] pb-24 space-y-6">
      
      {/* Pre-session Setup / Patient Info Header Area */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-medical-blue/20 flex flex-wrap items-end gap-6">
        <div className="flex-1">
          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Select Patient</label>
          <div className="relative">
            <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm font-medium focus:ring-medical-blue focus:border-medical-blue outline-none">
              <option>P-104 (Emma Wilson)</option>
              <option>P-105 (Noah Miller)</option>
              <option>P-106 (Olivia Davis)</option>
            </select>
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Connect Device</label>
          <div className="relative">
            <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm font-medium focus:ring-medical-blue focus:border-medical-blue outline-none">
              <option>DENTO-HUB-001 (Connected)</option>
              <option>DENTO-HUB-002 (Available)</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-600 rounded-lg border border-green-100">
          <MonitorCheck className="w-4 h-4" />
          <span className="text-xs font-bold">System Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Main Left Timeline and Metrics */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          
          {/* Patient Info Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-xl bg-medical-blue/10 flex items-center justify-center text-medical-blue">
                <Baby className="w-8 h-8" />
              </div>
              <div className="grid grid-cols-3 gap-x-12 gap-y-1">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Patient ID</p>
                  <p className="font-bold text-lg text-gray-900">P-104</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Age / Gender</p>
                  <p className="font-bold text-lg text-gray-700">10Y • Female</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Session Time</p>
                  <p className="font-bold text-lg text-medical-blue">{duration}</p>
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                      <span className="text-xs text-gray-500 font-medium">Baseline</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-medical-blue"></span>
                      <span className="text-xs font-bold text-medical-blue">Intervention</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 rounded-full border border-gray-300"></span>
                      <span className="text-xs font-medium">Recovery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <button className="text-medical-blue text-sm font-bold flex items-center gap-1 hover:underline">
                <History className="w-5 h-5" />
                View History
              </button>
            </div>
          </div>

          {/* Key Metrics Cards Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* GSR */}
            <MetricCard
              title="GSR (μS)"
              value={latestData.gsr}
              trendExtra={<span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-bold">+0.5%</span>}
            >
              <div className="h-10 w-full flex items-end gap-0.5 px-0.5">
                <div className="w-full h-[60%] bg-blue-100 rounded-t-sm"></div>
                <div className="w-full h-[65%] bg-blue-100 rounded-t-sm"></div>
                <div className="w-full h-[55%] bg-blue-100 rounded-t-sm"></div>
                <div className="w-full h-[70%] bg-blue-100 rounded-t-sm"></div>
                <div className="w-full h-[75%] bg-blue-200 rounded-t-sm"></div>
                <div className="w-full h-[80%] bg-medical-blue rounded-t-sm"></div>
                <div className="w-full h-[85%] bg-medical-blue rounded-t-sm transition-all duration-300"></div>
              </div>
            </MetricCard>

            {/* Heart Rate */}
            <MetricCard
              title="HEART RATE"
              value={latestData.heart_rate}
              unit="BPM"
              trendExtra={<span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">{latestData.heart_rate > 90 ? 'HIGH' : 'NORMAL'}</span>}
            >
              <div className="h-10 w-full bg-gray-50 rounded relative overflow-hidden">
                <div className="absolute inset-0 flex items-center px-1">
                  <svg className="w-full h-8 stroke-red-500 fill-none" preserveAspectRatio="none" viewBox="0 0 100 20">
                    <path className="animate-[pulse_1s_ease-in-out_infinite]" d="M0 10 L10 10 L12 2 L15 18 L18 10 L40 10 L42 2 L45 18 L48 10 L70 10 L72 2 L75 18 L78 10 L100 10" strokeWidth="1.5"></path>
                  </svg>
                </div>
              </div>
            </MetricCard>

            {/* Body Temp */}
            <MetricCard
              title="BODY TEMP"
              value={latestData.temperature}
              unit="°C"
              trendExtra={<span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold">{(latestData.temperature * 9/5 + 32).toFixed(1)}°F</span>}
            >
               <div className="h-10 w-full flex items-center">
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-medical-blue rounded-full"></div>
                </div>
              </div>
            </MetricCard>

            {/* Blood Pressure */}
            <MetricCard
              title="BP (SYS/DIA)"
              value={`${latestData.systolic}/${latestData.diastolic}`}
              trendExtra={
                <div className="flex items-center gap-1 text-[10px] font-bold text-medical-blue">
                  <Activity className="w-3 h-3" />
                  MAP: {Math.round((latestData.systolic + 2 * latestData.diastolic) / 3)}
                </div>
              }
            >
              <div className="flex gap-2 h-10 items-center">
                <div className="flex-1 h-2 bg-gray-100 rounded"></div>
                <div className="flex-1 h-2 bg-medical-blue rounded"></div>
                <div className="flex-1 h-2 bg-gray-100 rounded"></div>
              </div>
            </MetricCard>
          </div>

          {/* Combined Signal Chart */}
          <div className="w-full h-[350px]">
            <MultiSignalChart data={data} height="h-full" />
          </div>
        </div>

        {/* Right Insights and Marker Panel */}
        <div className="col-span-12 lg:col-span-3 pb-6">
          <SessionRightPanel 
            onAddMarker={addMarker} 
            latestData={latestData} 
          />
        </div>
      </div>

      {/* Floating Sticky Bottom Control Bar */}
      <SessionControlBar 
        isActive={isActive} 
        onTogglePlay={() => setIsActive(!isActive)} 
        elapsedTime={duration}
      />
    </div>
  );
}
