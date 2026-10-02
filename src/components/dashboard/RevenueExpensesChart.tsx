import React, { useState } from 'react';
import { TrendingUp, Calendar, ArrowUpRight, BarChart2 } from 'lucide-react';
import { MonthlyFinancialPoint } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface RevenueExpensesChartProps {
  data: MonthlyFinancialPoint[];
  currency: string;
}

export const RevenueExpensesChart: React.FC<RevenueExpensesChartProps> = ({ data, currency }) => {
  const [activePoint, setActivePoint] = useState<MonthlyFinancialPoint | null>(
    data[data.length - 1] || data[0]
  );
  const [viewMetric, setViewMetric] = useState<'both' | 'revenue' | 'expenses' | 'cash'>('both');

  // Find max value for scaling chart
  const maxValue =
    Math.max(
      ...data.map((d) => Math.max(d.revenue, d.expenses, d.receivedPayments)),
      10000
    ) * 1.2;

  // Latest month revenue for header display (matches reference image prominent stat)
  const currentMonthRevenue = data[data.length - 1]?.revenue || 0;

  // Chart coordinate math for smooth SVG path
  const chartWidth = 620;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 24;

  const pointsCount = data.length;
  const getX = (index: number) =>
    paddingX + (index / Math.max(1, pointsCount - 1)) * (chartWidth - paddingX * 2);
  const getY = (val: number) =>
    chartHeight - paddingY - (val / maxValue) * (chartHeight - paddingY * 2);

  // Generate SVG path for a line
  const createPathD = (key: 'revenue' | 'expenses' | 'receivedPayments') => {
    return data.reduce((acc, point, i) => {
      const x = getX(i);
      const y = getY(point[key]);
      return i === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  };

  const revenuePath = createPathD('revenue');
  const expensesPath = createPathD('expenses');
  const cashPath = createPathD('receivedPayments');

  // Closed area for smooth gradient fill
  const createAreaD = (key: 'revenue' | 'expenses' | 'receivedPayments') => {
    const linePath = createPathD(key);
    const startX = getX(0);
    const endX = getX(pointsCount - 1);
    const bottomY = chartHeight - paddingY;
    return `${linePath} L ${endX},${bottomY} L ${startX},${bottomY} Z`;
  };

  const revenueArea = createAreaD('revenue');
  const cashArea = createAreaD('receivedPayments');

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between h-full">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Monthly Revenue & Performance
            </h2>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Trend Analysis
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
              {formatCurrency(currentMonthRevenue, currency)}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +14.8% vs last month
            </span>
          </div>
        </div>

        {/* Metric Segmented Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMetric('both')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              viewMetric === 'both'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Combined
          </button>
          <button
            type="button"
            onClick={() => setViewMetric('revenue')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              viewMetric === 'revenue'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Revenue
          </button>
          <button
            type="button"
            onClick={() => setViewMetric('cash')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              viewMetric === 'cash'
                ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Cash Collected
          </button>
          <button
            type="button"
            onClick={() => setViewMetric('expenses')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              viewMetric === 'expenses'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Expenses
          </button>
        </div>
      </div>

      {/* Active Month Interactive Readout */}
      {activePoint && (
        <div className="my-3 p-3 bg-slate-50/80 rounded-lg border border-slate-200/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Period</div>
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
              <span>Cash Cleared</span>
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

      {/* Modern SVG Curve Chart */}
      <div className="relative mt-2 w-full aspect-21/9 min-h-[200px]">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          <line
            x1={paddingX}
            y1={getY(maxValue)}
            x2={chartWidth - paddingX}
            y2={getY(maxValue)}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={getY(maxValue * 0.66)}
            x2={chartWidth - paddingX}
            y2={getY(maxValue * 0.66)}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={getY(maxValue * 0.33)}
            x2={chartWidth - paddingX}
            y2={getY(maxValue * 0.33)}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={chartHeight - paddingY}
            x2={chartWidth - paddingX}
            y2={chartHeight - paddingY}
            stroke="#e2e8f0"
          />

          {/* Area Fills */}
          {(viewMetric === 'both' || viewMetric === 'revenue') && (
            <path d={revenueArea} fill="url(#revenueGradient)" />
          )}
          {(viewMetric === 'both' || viewMetric === 'cash') && (
            <path d={cashArea} fill="url(#cashGradient)" />
          )}

          {/* Curve Lines */}
          {(viewMetric === 'both' || viewMetric === 'revenue') && (
            <path
              d={revenuePath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {(viewMetric === 'both' || viewMetric === 'cash') && (
            <path
              d={cashPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="3 3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {(viewMetric === 'both' || viewMetric === 'expenses') && (
            <path
              d={expensesPath}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Data Nodes */}
          {data.map((point, index) => {
            const x = getX(index);
            const yRev = getY(point.revenue);
            const isSelected = activePoint?.month === point.month;

            return (
              <g
                key={point.month}
                className="cursor-pointer group"
                onMouseEnter={() => setActivePoint(point)}
              >
                {/* Vertical hover guide */}
                {isSelected && (
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={chartHeight - paddingY}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Revenue circle */}
                {(viewMetric === 'both' || viewMetric === 'revenue') && (
                  <circle
                    cx={x}
                    cy={yRev}
                    r={isSelected ? 6 : 4}
                    fill="#ffffff"
                    stroke="#2563eb"
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all duration-150 shadow-xs"
                  />
                )}

                {/* Month X-Axis Label */}
                <text
                  x={x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  className={`text-[10px] font-mono transition-colors ${
                    isSelected ? 'font-bold fill-slate-900' : 'fill-slate-400'
                  }`}
                >
                  {point.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="font-medium text-slate-700">Gross Billed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-700">Cleared Cash</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="font-medium text-slate-700">Operating Expenses</span>
          </div>
        </div>
        <span className="text-slate-400">Hover nodes to inspect month</span>
      </div>
    </div>
  );
};
