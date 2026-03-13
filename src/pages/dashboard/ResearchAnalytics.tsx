import { BarChart, Bar, Legend, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line } from 'recharts';
import { ChartCard } from '../../components/ChartCard';

const anxietyDistributionData = [
  { name: 'None', patients: 15 },
  { name: 'Mild', patients: 35 },
  { name: 'Moderate', patients: 25 },
  { name: 'Severe', patients: 10 },
  { name: 'Extreme', patients: 5 },
];

const scatterData = Array.from({ length: 50 }, () => ({
  x: +(Math.random() * 5 + 1).toFixed(2), // GSR (1-6)
  y: Math.floor(Math.random() * 40 + 70), // HR (70-110)
  z: Math.floor(Math.random() * 100),     // Size
}));

const trendData = [
  { month: 'Jan', avgAnxietyBase: 2.1, avgAnxietyPeak: 4.5 },
  { month: 'Feb', avgAnxietyBase: 2.2, avgAnxietyPeak: 4.2 },
  { month: 'Mar', avgAnxietyBase: 1.9, avgAnxietyPeak: 3.8 },
  { month: 'Apr', avgAnxietyBase: 2.0, avgAnxietyPeak: 3.5 },
  { month: 'May', avgAnxietyBase: 1.8, avgAnxietyPeak: 3.2 },
  { month: 'Jun', avgAnxietyBase: 1.7, avgAnxietyPeak: 3.0 },
];

export function ResearchAnalytics() {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Research Analytics
          </h2>
          <p className="mt-1 text-sm text-gray-500">Aggregated statistical analysis of physiological data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Anxiety Level Distribution (MCDAS)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={anxietyDistributionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip cursor={{fill: '#F3F4F6'}} />
              <Bar dataKey="patients" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="GSR vs Heart Rate Correlation">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" dataKey="x" name="GSR (μS)" stroke="#9CA3AF" fontSize={12} />
              <YAxis type="number" dataKey="y" name="Heart Rate (BPM)" stroke="#9CA3AF" fontSize={12} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Patients" data={scatterData} fill="#ef4444" opacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <div className="lg:col-span-2">
          <ChartCard title="Average Session Stress Trends (6 Months)" height="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgAnxietyPeak" name="Avg Peak Stress" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="avgAnxietyBase" name="Avg Baseline Stress" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
