import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { Invoice } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface InvoicesStatusDonutProps {
  invoices: Invoice[];
  currency: string;
  onViewInvoices: () => void;
}

export const InvoicesStatusDonut: React.FC<InvoicesStatusDonutProps> = ({
  invoices,
  currency,
  onViewInvoices,
}) => {
  const [activeSegment, setActiveSegment] = useState<'paid' | 'partial' | 'unpaid' | null>(null);

  // Group invoices by payment status
  const paidInvoices = invoices.filter((i) => i.paymentStatus === 'paid');
  const partialInvoices = invoices.filter((i) => i.paymentStatus === 'partial');
  const unpaidInvoices = invoices.filter((i) => i.paymentStatus === 'unpaid');

  const totalCount = invoices.length || 1; // avoid divide by zero
  const paidCount = paidInvoices.length;
  const partialCount = partialInvoices.length;
  const unpaidCount = unpaidInvoices.length;

  const paidAmount = paidInvoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const partialAmount = partialInvoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const unpaidAmount = invoices.reduce((sum, i) => sum + i.balanceDue, 0);

  const paidPercent = Math.round((paidCount / totalCount) * 100);
  const partialPercent = Math.round((partialCount / totalCount) * 100);
  const unpaidPercent = Math.max(0, 100 - paidPercent - partialPercent);

  // SVG Donut Calculations
  const radius = 58;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  // Segment stroke dash offsets
  const paidLength = (paidCount / totalCount) * circumference;
  const partialLength = (partialCount / totalCount) * circumference;
  const unpaidLength = (unpaidCount / totalCount) * circumference;

  const paidOffset = 0;
  const partialOffset = -paidLength;
  const unpaidOffset = -(paidLength + partialLength);

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Invoices & Payment Status
              </h2>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Receivables
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cash settlement overview across active client invoices
            </p>
          </div>
          <button
            type="button"
            onClick={onViewInvoices}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Donut and Legend Grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          {/* SVG Donut */}
          <div className="sm:col-span-5 flex justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#f1f5f9"
                  strokeWidth={strokeWidth}
                  fill="none"
                />

                {/* Paid Segment (Blue) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#2563eb"
                  strokeWidth={activeSegment === 'paid' ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={`${paidLength} ${circumference - paidLength}`}
                  strokeDashoffset={paidOffset}
                  fill="none"
                  strokeLinecap="round"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setActiveSegment('paid')}
                  onMouseLeave={() => setActiveSegment(null)}
                />

                {/* Partial Segment (Emerald) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#10b981"
                  strokeWidth={activeSegment === 'partial' ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={`${partialLength} ${circumference - partialLength}`}
                  strokeDashoffset={partialOffset}
                  fill="none"
                  strokeLinecap="round"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setActiveSegment('partial')}
                  onMouseLeave={() => setActiveSegment(null)}
                />

                {/* Unpaid / Pending Segment (Amber/Orange) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#f59e0b"
                  strokeWidth={activeSegment === 'unpaid' ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={`${unpaidLength} ${circumference - unpaidLength}`}
                  strokeDashoffset={unpaidOffset}
                  fill="none"
                  strokeLinecap="round"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setActiveSegment('unpaid')}
                  onMouseLeave={() => setActiveSegment(null)}
                />
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                  {formatNumber(invoices.length)}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown Legend Rows */}
          <div className="sm:col-span-7 space-y-2.5">
            {/* Paid Row */}
            <div
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                activeSegment === 'paid'
                  ? 'border-blue-300 bg-blue-50/50'
                  : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
              }`}
              onMouseEnter={() => setActiveSegment('paid')}
              onMouseLeave={() => setActiveSegment(null)}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-800">Fully Paid</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 font-mono tabular-nums">
                    {paidCount}
                  </span>
                  <span className="text-slate-500 ml-1 text-[11px]">({paidPercent}%)</span>
                </div>
              </div>
              <div className="mt-1 text-[11px] text-blue-700 font-mono font-medium pl-4.5">
                {formatCurrency(paidAmount, currency)}
              </div>
            </div>

            {/* Partially Paid Row */}
            <div
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                activeSegment === 'partial'
                  ? 'border-emerald-300 bg-emerald-50/50'
                  : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
              }`}
              onMouseEnter={() => setActiveSegment('partial')}
              onMouseLeave={() => setActiveSegment(null)}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-semibold text-slate-800">Partially Paid</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 font-mono tabular-nums">
                    {partialCount}
                  </span>
                  <span className="text-slate-500 ml-1 text-[11px]">({partialPercent}%)</span>
                </div>
              </div>
              <div className="mt-1 text-[11px] text-emerald-700 font-mono font-medium pl-4.5">
                {formatCurrency(partialAmount, currency)} collected
              </div>
            </div>

            {/* Unpaid / Pending Row */}
            <div
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                activeSegment === 'unpaid'
                  ? 'border-amber-300 bg-amber-50/50'
                  : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
              }`}
              onMouseEnter={() => setActiveSegment('unpaid')}
              onMouseLeave={() => setActiveSegment(null)}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-semibold text-slate-800">Pending / Unpaid</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 font-mono tabular-nums">
                    {unpaidCount}
                  </span>
                  <span className="text-slate-500 ml-1 text-[11px]">({unpaidPercent}%)</span>
                </div>
              </div>
              <div className="mt-1 text-[11px] text-amber-700 font-mono font-medium pl-4.5">
                {formatCurrency(unpaidAmount, currency)} awaiting payment
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Discipline Notice */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          Strict accounting rule: An approved invoice does not automatically register as cash until payment is settled.
        </span>
      </div>
    </div>
  );
};
