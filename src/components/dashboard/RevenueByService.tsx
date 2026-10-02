import React from 'react';
import { ArrowUpRight, Wrench, ChevronRight, Layers } from 'lucide-react';
import { ServiceItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface RevenueByServiceProps {
  services: ServiceItem[];
  currency: string;
  onViewAllServices: () => void;
}

export const RevenueByService: React.FC<RevenueByServiceProps> = ({
  services,
  currency,
  onViewAllServices,
}) => {
  const totalServiceRevenue = services.reduce((acc, s) => acc + s.revenueThisMonth, 0);

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Revenue by Service
              </h2>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Profit Lines
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Service line performance and gross profit contributions
            </p>
          </div>
          <button
            type="button"
            onClick={onViewAllServices}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>All Services</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Services List */}
        <div className="mt-4 space-y-3.5">
          {services.map((service, idx) => {
            const percentage =
              totalServiceRevenue > 0
                ? Math.round((service.revenueThisMonth / totalServiceRevenue) * 100)
                : 0;

            const barColors = [
              'bg-blue-600 group-hover:bg-blue-700',
              'bg-emerald-500 group-hover:bg-emerald-600',
              'bg-purple-600 group-hover:bg-purple-700',
              'bg-amber-500 group-hover:bg-amber-600',
              'bg-indigo-600 group-hover:bg-indigo-700',
            ];
            const barColor = barColors[idx % barColors.length];

            return (
              <div key={service.id} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-slate-800 truncate block">
                      {service.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {service.category} · {service.jobsCount} jobs
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-slate-900 tabular-nums">
                      {formatCurrency(service.revenueThisMonth, currency)}
                    </div>
                    <div className="text-[11px] font-medium text-emerald-600">
                      {percentage}% ({service.grossMarginPercent}% margin)
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full rounded-full transition-colors ${barColor}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Total Service Billed: {formatCurrency(totalServiceRevenue, currency)}</span>
        <span className="text-slate-400">Top earner: {services[0]?.name.split(' ')[0]}</span>
      </div>
    </div>
  );
};
