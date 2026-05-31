import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  variant?: 'default' | 'danger' | 'success';
}

export default function StatCard({ title, value, icon, trend, variant = 'default' }: StatCardProps) {
  let bgClass = "bg-white border-slate-200";
  let titleClass = "text-slate-500";
  let iconBgClass = "bg-slate-50 text-slate-600";
  let trendClass = "text-slate-600";
  let valueClass = "text-slate-900";

  if (variant === 'danger') {
    bgClass = "bg-white border-slate-200";
    titleClass = "text-rose-700";
    iconBgClass = "bg-rose-50 text-rose-600";
    trendClass = "text-rose-600";
    valueClass = "text-rose-950";
  } else if (variant === 'success') {
    bgClass = "bg-white border-slate-200";
    titleClass = "text-emerald-700";
    iconBgClass = "bg-emerald-50 text-emerald-600";
    trendClass = "text-emerald-600";
    valueClass = "text-emerald-950";
  }

  return (
    <div className={`${bgClass} rounded-2xl shadow-sm border p-6 flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-bold ${titleClass}`}>{title}</h3>
        <div className={`p-2.5 rounded-xl ${iconBgClass}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mt-auto">
        <span className={`text-4xl font-extrabold ${valueClass}`}>{value}</span>
        {trend && (
          <span className={`text-sm font-bold ${trendClass}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
