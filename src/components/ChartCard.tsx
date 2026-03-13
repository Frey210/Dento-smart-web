import React from 'react';
import { cn } from '../utils/cn';

export function ChartCard({ 
  title, 
  children, 
  action, 
  height = 'h-80',
  className
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  height?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-gray-100 bg-white shadow-sm ring-1 ring-gray-900/5 flex flex-col overflow-hidden", className)}>
      <div className="flex items-center justify-between border-b border-gray-100 p-5 bg-gray-50/50">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className={`p-5 flex-1 ${height}`}>
        {children}
      </div>
    </div>
  );
}
