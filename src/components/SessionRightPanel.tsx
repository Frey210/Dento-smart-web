import { Flag, Syringe, Zap, CheckCircle, FileEdit, CheckCircle2 } from 'lucide-react';
import { Card } from './Card';
import { cn } from '../utils/cn';

export function SessionRightPanel({ 
  onAddMarker,
  latestData
}: { 
  onAddMarker: (type: string) => void;
  latestData: { gsr: number; heart_rate: number };
}) {
  const getAnxietyLevel = (gsr: number, hr: number) => {
    if (gsr > 3.0 || hr > 100) return { level: '4', text: 'SEVERE', color: 'text-red-600', needle: 'rotate-[45deg]' };
    if (gsr > 2.0 || hr > 85) return { level: '2', text: 'MODERATE', color: 'text-medical-blue', needle: 'rotate-[-12deg]' };
    return { level: '0', text: 'RELAXED', color: 'text-green-600', needle: 'rotate-[-80deg]' };
  };

  const status = getAnxietyLevel(latestData.gsr, latestData.heart_rate);

  return (
    <div className="w-80 flex-shrink-0 flex flex-col space-y-6">
      {/* Anxiety Score Gauge */}
      <Card className="p-6">
        <h3 className="font-bold text-sm mb-6 text-center text-gray-900 tracking-wider">ANXIETY SCORE</h3>
        <div className="relative flex flex-col items-center">
          <div className="w-40 h-40 rounded-full border-[10px] border-gray-50 flex items-center justify-center relative shadow-inner">
            <div className="text-center">
              <span className={cn("text-5xl font-black", status.color)}>{status.level}</span>
              <p className="text-[10px] font-bold text-gray-400 tracking-wider">LEVEL</p>
            </div>
            {/* Gauge Needle Representation */}
            <div className={cn("absolute inset-0 flex items-center justify-center text-medical-blue transition-all duration-1000 ease-out", status.needle)}>
              <div className="w-full h-full p-1 relative">
                <div className="w-3 h-3 rounded-full bg-medical-blue absolute top-0 left-1/2 -ml-1.5 shadow-md"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-[10px] font-bold">
            <span className={status.level === '0' ? 'text-green-600' : 'text-gray-400'}>0 RELAXED</span>
            <span className={status.level === '2' ? 'text-medical-blue' : 'text-gray-400'}>2 MODERATE</span>
            <span className={status.level === '4' ? 'text-red-600' : 'text-gray-400'}>4 SEVERE</span>
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
            onClick={() => onAddMarker('Baseline')}
            className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 hover:bg-blue-50 hover:text-medical-blue transition-colors rounded-lg text-xs font-semibold text-gray-700"
          >
            <Flag className="h-4 w-4" />
            Start Baseline
          </button>
          
          <button 
            onClick={() => onAddMarker('Anesthesia')}
            className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 hover:bg-blue-50 hover:text-medical-blue transition-colors rounded-lg text-xs font-semibold text-gray-700"
          >
            <Syringe className="h-4 w-4" />
            Inject Anesthesia
          </button>
          
          <button 
            onClick={() => onAddMarker('Intervention')}
            className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 text-medical-blue rounded-lg text-xs font-bold border border-blue-100 shadow-sm"
          >
            <Zap className="h-4 w-4" />
            Intervention Trigger
          </button>
          
          <button 
            onClick={() => onAddMarker('Recovery')}
            className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 hover:bg-blue-50 hover:text-medical-blue transition-colors rounded-lg text-xs font-semibold text-gray-700"
          >
            <CheckCircle className="h-4 w-4" />
            Start Recovery
          </button>

          <button 
            onClick={() => onAddMarker('Note')}
            className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 hover:bg-blue-50 hover:text-medical-blue transition-colors rounded-lg text-xs font-semibold text-gray-700 mt-2"
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
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white">
                <CheckCircle2 className="h-4 w-4 text-medical-blue" />
              </span>
              <div className="ml-3 flex flex-col">
                <span className="text-sm font-medium text-gray-900">Session Started</span>
                <span className="text-xs text-gray-500">00:00:00</span>
              </div>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
