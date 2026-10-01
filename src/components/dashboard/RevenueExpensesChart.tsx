import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { MonthlyFinancialPoint } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface RevenueExpensesChartProps {
  data: MonthlyFinancialPoint[];
  currency: string;
}

export const RevenueExpensesChart: React.FC<RevenueExpensesChartProps> = ({ data, currency }) => {
  const [activePoint, setActivePoint] = useState<MonthlyFinancialPoint | null>(
    data[data.length - 2] || data[0]
  );
  const [viewMetric, setViewMetric] = useState<'both' | 'revenue' | 'expenses'>('both');

  // Find max value for scaling chart
  const maxValue = Math.max(...data.map((d) => Math.max(d.revenue, d.expenses, d.receivedPayments))) * 1.15;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Revenue vs Expenses
            </h2>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Monthly Trend
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare invoiced sales, cash collected, and operational outflows
          </p>
        </div>

        {/* Controls & Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
            <button
              onClick={() => setViewMetric('both')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                viewMetric === 'both' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              All Metrics
            </button>
            <button
              onClick={() => setViewMetric('revenue')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                viewMetric === 'revenue' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setViewMetric('expenses')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                viewMetric === 'expenses' ? 'bg-white text-rose-700 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Expenses
            </button>
          </div>
        </div>
      </div>

      {/* Active Point Highlight Card */}
      {activePoint && (
        <div className="my-3 p-3 bg-slate-50 rounded-lg border border-slate-200/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Selected Period</div>
            <div className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{activePoint.month}</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-blue-700 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Revenue (Billed)</span>
            </div>
            <div className="font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
              {formatCurrency(activePoint.revenue, currency)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Cash Received</span>
            </div>
            <div className="font-bold font-mono text-emerald-800 mt-0.5 tabular-nums">
              {formatCurrency(activePoint.receivedPayments, currency)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-rose-700 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Expenses</span>
            </div>
            <div className="font-bold font-mono text-rose-800 mt-0.5 tabular-nums">
              {formatCurrency(activePoint.expenses, currency)}
            </div>
          </div>
        </div>
      )}

      {/* SVG Interactive Chart */}
      <div className="relative mt-2 h-56 w-full">
        {/* Y Axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 font-mono">
          <div className="border-b border-slate-100 flex items-center justify-between pb-0.5">
            <span>{formatCurrency(maxValue, currency, true)}</span>
          </div>
          <div className="border-b border-slate-100 flex items-center justify-between pb-0.5">
            <span>{formatCurrency(maxValue * 0.66, currency, true)}</span>
          </div>
          <div className="border-b border-slate-100 flex items-center justify-between pb-0.5">
            <span>{formatCurrency(maxValue * 0.33, currency, true)}</span>
          </div>
          <div className="border-b border-slate-200 flex items-center justify-between pb-0.5 text-slate-500">
            <span>$0</span>
          </div>
        </div>

        {/* Bars Container */}
        <div className="absolute inset-0 pt-4 pb-6 flex items-end justify-around gap-2 sm:gap-6 px-4">
          {data.map((point) => {
            const revHeight = (point.revenue / maxValue) * 100;
            const expHeight = (point.expenses / maxValue) * 100;
            const cashHeight = (point.receivedPayments / maxValue) * 100;
            const isHovered = activePoint?.month === point.month;

            return (
              <div
                key={point.month}
                onMouseEnter={() => setActivePoint(point)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Visual Bars Column */}
                <div className="w-full max-w-[56px] flex items-end justify-center gap-1 h-full relative">
                  {/* Revenue Bar */}
                  {(viewMetric === 'both' || viewMetric === 'revenue') && (
                    <div
                      style={{ height: `${revHeight}%` }}
                      className={`w-3.5 sm:w-4 rounded-t-sm transition-all duration-200 ${
                        isHovered ? 'bg-blue-600 ring-2 ring-blue-300' : 'bg-blue-500/80 hover:bg-blue-600'
                      }`}
                      title={`Revenue: ${formatCurrency(point.revenue, currency)}`}
                    />
                  )}

                  {/* Cash Received Bar */}
                  {viewMetric === 'both' && (
                    <div
                      style={{ height: `${cashHeight}%` }}
                      className={`w-3.5 sm:w-4 rounded-t-sm transition-all duration-200 ${
                        isHovered ? 'bg-emerald-500 ring-2 ring-emerald-300' : 'bg-emerald-400/85 hover:bg-emerald-500'
                      }`}
                      title={`Cash Collected: ${formatCurrency(point.receivedPayments, currency)}`}
                    />
                  )}

                  {/* Expense Bar */}
                  {(viewMetric === 'both' || viewMetric === 'expenses') && (
                    <div
                      style={{ height: `${expHeight}%` }}
                      className={`w-3.5 sm:w-4 rounded-t-sm transition-all duration-200 ${
                        isHovered ? 'bg-rose-500 ring-2 ring-rose-300' : 'bg-rose-400/80 hover:bg-rose-500'
                      }`}
                      title={`Expenses: ${formatCurrency(point.expenses, currency)}`}
                    />
                  )}
                </div>

                {/* X Axis Label */}
                <div
                  className={`mt-2 text-[10px] sm:text-[11px] font-medium truncate text-center ${
                    isHovered ? 'text-slate-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  {point.month.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Footer Legend */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
            <span className="text-[11px]">Revenue (Invoiced)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="text-[11px]">Received Cash</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
            <span className="text-[11px]">Expenses</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 italic">
          Hover over bars to inspect financial breakdown
        </div>
      </div>
    </div>
  );
};
