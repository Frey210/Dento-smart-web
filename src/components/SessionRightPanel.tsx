import { Flag, Syringe, Zap, CheckCircle, FileEdit, CheckCircle2 } from 'lucide-react';
import { Card } from './Card';
import { cn } from '../utils/cn';

export function SessionRightPanel({ 
  onAddMarker,
  latestData,
  markers = [],
  activeMarker,
}: { 
  onAddMarker: (type: string) => void;
  latestData: { gsr: number; heart_rate: number };
  markers?: { marker_type: string; created_at: string; note?: string | null }[];
  activeMarker?: string | null;
}) {
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const getAnxietyLevel = (gsr: number, hr: number) => {
    const gsrScore = clamp(gsr / 5, 0, 1);
    const hrScore = clamp((hr - 60) / 60, 0, 1);
    const score = (gsrScore * 0.6 + hrScore * 0.4) * 4;
    const rounded = Math.round(score * 10) / 10;
    const needleDeg = -90 + (rounded / 4) * 180;
    if (rounded >= 3) return { level: rounded.toFixed(1), text: 'SEVERE', color: 'text-red-600', needleDeg };
    if (rounded >= 2) return { level: rounded.toFixed(1), text: 'MODERATE', color: 'text-medical-blue', needleDeg };
    if (rounded >= 1) return { level: rounded.toFixed(1), text: 'ELEVATED', color: 'text-yellow-600', needleDeg };
    return { level: rounded.toFixed(1), text: 'RELAXED', color: 'text-green-600', needleDeg };
  };

  const status = getAnxietyLevel(latestData.gsr, latestData.heart_rate);

  const handleMarker = (type: string) => {
    onAddMarker(type);
  };

  return (
    <div className="w-full lg:w-80 flex-shrink-0 flex flex-col space-y-6">
      {/* Anxiety Score Gauge */}
      <Card className="p-6">
        <h3 className="font-bold text-sm mb-6 text-center text-gray-900 tracking-wider">ANXIETY SCORE</h3>
        <div className="relative flex flex-col items-center">
          <div className="relative w-48 h-24 overflow-hidden">
            <svg className="w-48 h-48 -rotate-180" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="40" stroke="#f1f3f5" strokeDasharray="125.66 251.32" strokeWidth="12" />
              <circle cx="50" cy="50" fill="none" r="40" stroke="#10b981" strokeDasharray="25 251.32" strokeDashoffset="0" strokeWidth="12" />
              <circle cx="50" cy="50" fill="none" r="40" stroke="#fbbf24" strokeDasharray="25 251.32" strokeDashoffset="-25" strokeWidth="12" />
              <circle cx="50" cy="50" fill="none" r="40" stroke="#f59e0b" strokeDasharray="25 251.32" strokeDashoffset="-50" strokeWidth="12" />
              <circle cx="50" cy="50" fill="none" r="40" stroke="#ef4444" strokeDasharray="25 251.32" strokeDashoffset="-75" strokeWidth="12" />
              <circle cx="50" cy="50" fill="none" r="40" stroke="#b91c1c" strokeDasharray="25.66 251.32" strokeDashoffset="-100" strokeWidth="12" />
            </svg>
            <div
              className="absolute bottom-0 left-1/2 -ml-0.5 h-20 w-1 origin-bottom transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${status.needleDeg}deg)` }}
            >
              <div className="h-full w-full rounded-full bg-gray-900"></div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-gray-900 border-2 border-white"></div>
          </div>
          <div className="mt-3 text-center">
            <span className={cn("text-4xl font-black", status.color)}>{status.level}</span>
            <p className="text-[10px] font-bold text-gray-400 tracking-wider">LEVEL</p>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-[10px] font-bold">
            <span className={status.text === 'RELAXED' ? 'text-green-600' : 'text-gray-400'}>0 RELAXED</span>
            <span className={status.text === 'MODERATE' ? 'text-medical-blue' : 'text-gray-400'}>2 MODERATE</span>
            <span className={status.text === 'SEVERE' ? 'text-red-600' : 'text-gray-400'}>4 SEVERE</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-green-400 w-1/5"></div>
            <div className="h-full bg-yellow-400 w-1/5"></div>
            <div className="h-full bg-orange-400 w-1/5"></div>
            <div className="h-full bg-red-400 w-1/5"></div>
            <div className="h-full bg-red-600 w-1/5"></div>
          </div>
        </div>
      </Card>

      {/* Primary Actions / Markers */}
      <Card className="p-6">
        <h3 className="font-bold text-sm mb-4 text-gray-900 tracking-wider">EVENT MARKERS</h3>
        <div className="grid grid-cols-1 gap-2">
          <button 
            onClick={() => handleMarker('Baseline')}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors",
              activeMarker === 'Baseline'
                ? 'bg-blue-50 text-medical-blue border border-blue-100 shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-medical-blue'
            )}
          >
            <Flag className="h-4 w-4" />
            Start Baseline
          </button>
          
          <button 
            onClick={() => handleMarker('Anesthesia')}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors",
              activeMarker === 'Anesthesia'
                ? 'bg-blue-50 text-medical-blue border border-blue-100 shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-medical-blue'
            )}
          >
            <Syringe className="h-4 w-4" />
            Inject Anesthesia
          </button>
          
          <button 
            onClick={() => handleMarker('Intervention')}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors",
              activeMarker === 'Intervention'
                ? 'bg-blue-50 text-medical-blue border border-blue-100 shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-medical-blue'
            )}
          >
            <Zap className="h-4 w-4" />
            Intervention Trigger
          </button>
          
          <button 
            onClick={() => handleMarker('Recovery')}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors",
              activeMarker === 'Recovery'
                ? 'bg-blue-50 text-medical-blue border border-blue-100 shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-medical-blue'
            )}
          >
            <CheckCircle className="h-4 w-4" />
            Start Recovery
          </button>

          <button 
            onClick={() => handleMarker('Note')}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors mt-2",
              activeMarker === 'Note'
                ? 'bg-blue-50 text-medical-blue border border-blue-100 shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-medical-blue'
            )}
          >
            <FileEdit className="h-4 w-4" />
            Custom Note
          </button>
        </div>
      </Card>
      
      {/* Session Events Log */}
      <Card className="flex-1 p-0 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-bold tracking-wider text-gray-500">SESSION LOG</h3>
        </div>
        <div className="flex-1 p-4 overflow-y-auto min-h-[150px]">
          {markers.length === 0 ? (
            <div className="text-xs text-gray-500">No event markers yet.</div>
          ) : (
            <ul className="space-y-4">
              {markers.map((marker) => (
                <li key={`${marker.marker_type}-${marker.created_at}`} className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white">
                    <CheckCircle2 className="h-4 w-4 text-medical-blue" />
                  </span>
                  <div className="ml-3 flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{marker.marker_type}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(marker.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
