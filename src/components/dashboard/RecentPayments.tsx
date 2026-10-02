import React from 'react';
import { CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Payment } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface RecentPaymentsProps {
  payments: Payment[];
  currency: string;
  onViewAllPayments: () => void;
}

export const RecentPayments: React.FC<RecentPaymentsProps> = ({
  payments,
  currency,
  onViewAllPayments,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Recent Payments</h2>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Cleared Funds
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Settled deposits impacting cash liquidity
            </p>
          </div>
          <button
            type="button"
            onClick={onViewAllPayments}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="py-2.5 pr-3">Payment ID</th>
                <th className="py-2.5 px-3">Invoice No</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 pl-3 text-right">Amount</th>
                <th className="py-2.5 pl-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.slice(0, 5).map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pr-3 font-semibold text-slate-900 font-mono">
                    {pay.paymentNumber}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-slate-700">{pay.invoiceNumber}</span>
                    <div className="text-[11px] text-slate-400 truncate max-w-[120px]">
                      {pay.customerName}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{pay.date}</td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {pay.method}
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                    +{formatCurrency(pay.amount, currency)}
                  </td>
                  <td className="py-3 pl-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Settled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Cleared directly into business bank account</span>
        <button
          type="button"
          onClick={onViewAllPayments}
          className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
        >
          View All Payments
        </button>
      </div>
    </div>
  );
};
