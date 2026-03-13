import React from 'react';
import { cn } from '../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-100 bg-white shadow-sm ring-1 ring-gray-900/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function MetricCard({ title, value, trend, unit, trendExtra, children }: {
  title: string;
  value: string | number;
  trend?: string;
  unit?: string;
  trendExtra?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Card className="p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{title}</span>
          {trendExtra && trendExtra}
        </div>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-black text-gray-900">{value}</span>
          {unit && <span className="text-xs text-gray-400">{unit}</span>}
        </div>
        {trend && (
          <div className="mt-1 flex items-center text-sm">
            <span className="text-gray-500 font-bold text-xs">{trend}</span>
          </div>
        )}
      </div>
      {children && <div className="mt-auto pt-4 w-full">{children}</div>}
    </Card>
  );
}
