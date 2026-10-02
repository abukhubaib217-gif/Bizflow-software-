import React from 'react';
import { ShieldCheck, Target, Scale, Info, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface MonthlyFinancialSummaryProps {
  totalRevenue: number;
  receivedPayments: number;
  pendingPayments: number;
  totalExpenses: number;
  currency: string;
}

export const MonthlyFinancialSummary: React.FC<MonthlyFinancialSummaryProps> = ({
  totalRevenue,
  receivedPayments,
  pendingPayments,
  totalExpenses,
  currency,
}) => {
  const netCashFlow = receivedPayments - totalExpenses;
  const cashMargin = receivedPayments > 0 ? (netCashFlow / receivedPayments) * 100 : 0;
  const targetMargin = 40.0; // 40% benchmark target
  const collectionRatio = totalRevenue > 0 ? (receivedPayments / totalRevenue) * 100 : 0;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Financial Health Summary
              </h2>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Operating State
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Operating cash flow, velocity, and margin targets
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Healthy
          </span>
        </div>

        {/* Detailed Breakdown List */}
        <div className="mt-4 space-y-3 text-xs">
          {/* Gross Invoiced Sales */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-100">
            <span className="text-slate-600 font-medium">Gross Invoiced Revenue</span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {formatCurrency(totalRevenue, currency)}
            </span>
          </div>

          {/* Cleared Cash Inflow */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/40 border border-emerald-100/70">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-700 font-medium">Cleared Cash Inflows</span>
            </div>
            <span className="font-mono font-bold text-emerald-700 tabular-nums">
              {formatCurrency(receivedPayments, currency)}
            </span>
          </div>

          {/* Operating Outflow */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/40 border border-rose-100/70">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-slate-700 font-medium">Operating & Material Outflows</span>
            </div>
            <span className="font-mono font-bold text-rose-700 tabular-nums">
              {formatCurrency(totalExpenses, currency)}
            </span>
          </div>

          {/* Net Cash Position */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-800 font-semibold">Net Cash Operating Surplus</span>
            <span className="font-mono font-extrabold text-blue-700 text-sm tabular-nums">
              {formatCurrency(netCashFlow, currency)}
            </span>
          </div>

          {/* Profit Margin Progress Bar */}
          <div className="pt-2 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 flex items-center gap-1">
                <Target className="w-3 h-3 text-slate-400" />
                <span>Net Cash Margin vs Target ({targetMargin}%)</span>
              </span>
              <span className="font-bold text-emerald-700 font-mono">
                {cashMargin.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(Math.max(cashMargin, 0), 100)}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
              />
            </div>
          </div>

          {/* Collection Ratio Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 flex items-center gap-1">
                <Scale className="w-3 h-3 text-slate-400" />
                <span>Invoicing to Cash Collection Ratio</span>
              </span>
              <span className="font-bold text-slate-800 font-mono">
                {collectionRatio.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(Math.max(collectionRatio, 0), 100)}%` }}
                className="h-full bg-blue-600 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] text-slate-400">
        <Info className="w-3 h-3 shrink-0" />
        <span>Strict Cash-basis accounting: Accounts receivable not counted as cash</span>
      </div>
    </div>
  );
};
