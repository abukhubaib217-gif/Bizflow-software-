import React, { useState } from 'react';
import { CreditCard, Search, Plus, CheckCircle2, Download, Filter } from 'lucide-react';
import { Payment } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface PaymentsViewProps {
  payments: Payment[];
  currency: string;
  onOpenRecordPayment: () => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  payments,
  currency,
  onOpenRecordPayment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<'all' | string>('all');

  const filteredPayments = payments.filter((pay) => {
    const matchesSearch =
      pay.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pay.reference && pay.reference.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (methodFilter === 'all') return true;
    return pay.method.toLowerCase().includes(methodFilter.toLowerCase());
  });

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const avgPayment = payments.length > 0 ? totalCollected / payments.length : 0;

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Settled Collections
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1 tabular-nums">
            {formatCurrency(totalCollected, currency)}
          </div>
          <div className="text-xs text-emerald-600 mt-1">100% Cleared bank deposits</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Average Payment Amount
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">
            {formatCurrency(avgPayment, currency)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Across all cleared transactions</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Payments Logged
          </div>
          <div className="text-2xl font-bold text-blue-600 font-mono mt-1">{payments.length}</div>
          <div className="text-xs text-blue-600 mt-1">Reconciled ledger entries</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search payment #, check, invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setMethodFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  methodFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMethodFilter('ACH')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  methodFilter === 'ACH' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                ACH Wire
              </button>
              <button
                onClick={() => setMethodFilter('Stripe')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  methodFilter === 'Stripe' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Card / Stripe
              </button>
              <button
                onClick={() => setMethodFilter('Check')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  methodFilter === 'Check' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Check
              </button>
            </div>
          </div>

          <button
            onClick={onOpenRecordPayment}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-slate-500 font-semibold">
                <th className="py-3 px-4">Payment #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Invoice Ref</th>
                <th className="py-3 px-4">Date Cleared</th>
                <th className="py-3 px-4">Method & Ref</th>
                <th className="py-3 px-4 text-right">Amount Deposited</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {pay.paymentNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{pay.customerName}</td>
                  <td className="py-3 px-4 font-mono text-blue-700">{pay.invoiceNumber}</td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{pay.date}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-medium">
                      {pay.method}
                    </span>
                    {pay.reference && (
                      <span className="text-[11px] text-slate-400 font-mono ml-2">
                        {pay.reference}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 text-sm tabular-nums">
                    +{formatCurrency(pay.amount, currency)}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Settled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
