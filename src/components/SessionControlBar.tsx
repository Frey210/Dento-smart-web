import { Play, Pause, Save } from 'lucide-react';

export function SessionControlBar({ 
  isActive, 
  onTogglePlay,
  elapsedTime = '00:00:00',
  onEnd,
}: {
  isActive: boolean;
  onTogglePlay: () => void;
  elapsedTime?: string;
  onEnd?: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 border-t border-gray-200 bg-white px-4 sm:px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 lg:left-64">
      <div className="flex h-full flex-col items-start justify-center gap-3 mx-auto max-w-7xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-500 mr-2">Session Running</span>
            <span className="font-mono text-xl font-semibold text-gray-900">{elapsedTime}</span>
          </div>
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          <div className="flex items-center">
            <span className="relative flex h-3 w-3 mr-2">
              {isActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-sm text-gray-600">Auto Sync Active</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onTogglePlay}
            className={`flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              isActive 
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4 fill-current" />
                Resume
              </>
            )}
          </button>

          <button
            onClick={onEnd}
            className="flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!onEnd}
          >
            <Save className="mr-2 h-4 w-4" />
            End & Save Session
          </button>
        </div>
      </div>
    </div>
  );
}
