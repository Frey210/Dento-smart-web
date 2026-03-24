import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import type { SensorData } from '../types';

interface MultiSignalChartProps {
  data: SensorData[];
  markers?: { timestamp: number; type: string }[];
  height?: string;
}

export function MultiSignalChart({ data, markers = [], height = 'h-[400px]' }: MultiSignalChartProps) {
  const formatTime = (timestamp: any) => {
    if (!timestamp || isNaN(Number(timestamp))) return '';
    return new Date(Number(timestamp)).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className={`w-full ${height} bg-white rounded-xl shadow-sm border border-gray-100 p-4`}>
      <h3 className="text-sm font-semibold text-gray-900 mb-4 px-2">Multi-Signal Physiological Timeline</h3>
      <div className="w-full h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            
            {/* X-Axis for time */}
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTime} 
              stroke="#9CA3AF" 
              fontSize={12} 
              tickMargin={10} 
              minTickGap={30}
            />
            
            {/* Primary Y-Axis (GSR - MicroSiemens, typical range 1-10) */}
            <YAxis 
              yAxisId="gsr" 
              orientation="left" 
              stroke="#2563eb" 
              fontSize={12} 
              domain={['auto', 'auto']}
              label={{ value: 'GSR (μS)', angle: -90, position: 'insideLeft', style: { fill: '#2563eb' } }}
            />
            
            {/* Secondary Y-Axis (Heart Rate & Temperature) */}
            <YAxis 
              yAxisId="hr_bp" 
              orientation="right" 
              stroke="#ef4444" 
              fontSize={12} 
              domain={['auto', 'auto']}
              label={{ value: 'HR / Temp', angle: 90, position: 'insideRight', style: { fill: '#ef4444' } }}
            />

            <Tooltip 
              labelFormatter={formatTime}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
            
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />

            {markers.map((marker) => (
              <ReferenceLine
                key={`${marker.type}-${marker.timestamp}`}
                x={marker.timestamp}
                stroke="#2563eb"
                strokeDasharray="4 4"
                label={{ value: marker.type, position: 'top', fill: '#2563eb', fontSize: 10 }}
              />
            ))}

            {/* Signal Lines */}
            <Line 
              yAxisId="gsr"
              type="monotone" 
              dataKey="gsr" 
              name="GSR Level"
              stroke="#2563eb" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={false} 
            />
            <Line 
              yAxisId="hr_bp"
              type="monotone" 
              dataKey="heart_rate" 
              name="Heart Rate"
              stroke="#ef4444" 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={false} 
            />
            <Line 
              yAxisId="hr_bp"
              type="monotone" 
              dataKey="temperature" 
              name="Body Temperature"
              stroke="#f59e0b" 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={false} 
            />
            
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
