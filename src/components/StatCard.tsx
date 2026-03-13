import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
}

export function StatCard({ title, value, icon, trend, subtitle }: StatCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between space-x-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className="rounded-full bg-blue-50 p-3 text-medical-blue">
            {icon}
          </div>
        )}
      </div>
      
      {(trend || subtitle) && (
        <div className="mt-4 flex items-center text-sm">
          {trend && (
            <span className={`font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="ml-2 text-gray-500">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
