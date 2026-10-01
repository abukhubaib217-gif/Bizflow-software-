import React, { useState } from 'react';
import { FileText, Search, Plus, Eye, CreditCard, Filter, AlertTriangle } from 'lucide-react';
import { Invoice } from '../../types';
import { formatCurrency, getInvoiceStatusMeta, getPaymentStatusMeta } from '../../utils/formatters';

interface InvoicesViewProps {
  invoices: Invoice[];
  currency: string;
  onOpenCreateInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onRecordPayment: (invoice: Invoice) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  currency,
  onOpenCreateInvoice,
  onViewInvoice,
  onRecordPayment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'pending') return inv.balanceDue > 0;
    if (statusFilter === 'paid') return inv.paymentStatus === 'paid';
    if (statusFilter === 'overdue') return inv.invoiceStatus === 'overdue';
    return true;
  });

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalPending = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const overdueInvoices = invoices.filter((inv) => inv.invoiceStatus === 'overdue');
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Invoiced Volume
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">
            {formatCurrency(totalInvoiced, currency)}
          </div>
          <div className="text-xs text-slate-500 mt-1">{invoices.length} invoices generated</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Collected Cash
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1 tabular-nums">
            {formatCurrency(totalPaid, currency)}
          </div>
          <div className="text-xs text-emerald-600 mt-1">Realized bank settlements</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending Receivables
          </div>
          <div className="text-2xl font-bold text-amber-700 font-mono mt-1 tabular-nums">
            {formatCurrency(totalPending, currency)}
          </div>
          <div className="text-xs text-amber-600 mt-1">Approved & sent invoices due</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Past Due Invoices
          </div>
          <div className="text-2xl font-bold text-rose-700 font-mono mt-1 tabular-nums">
            {formatCurrency(overdueAmount, currency)}
          </div>
          <div className="text-xs text-rose-600 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{overdueInvoices.length} overdue</span>
          </div>
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
                placeholder="Search invoices by # or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                All ({invoices.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'pending' ? 'bg-white text-amber-700 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Pending Balance
              </button>
              <button
                onClick={() => setStatusFilter('paid')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'paid' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Fully Paid
              </button>
              <button
                onClick={() => setStatusFilter('overdue')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'overdue' ? 'bg-white text-rose-700 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Overdue
              </button>
            </div>
          </div>

          <button
            onClick={onOpenCreateInvoice}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-slate-500 font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Invoice State</th>
                <th className="py-3 px-4 text-center">Payment State</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => {
                const invMeta = getInvoiceStatusMeta(inv.invoiceStatus);
                const payMeta = getPaymentStatusMeta(inv.paymentStatus);

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <button
                        onClick={() => onViewInvoice(inv)}
                        className="hover:text-blue-600 hover:underline cursor-pointer"
                      >
                        {inv.invoiceNumber}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{inv.customerName}</div>
                      <div className="text-[11px] text-slate-400">{inv.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{inv.issueDate}</td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{inv.dueDate}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded border ${invMeta.className}`}
                      >
                        {invMeta.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded border ${payMeta.className}`}
                      >
                        {payMeta.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(inv.totalAmount, currency)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                      {inv.balanceDue > 0 ? (
                        <span className="text-amber-700">
                          {formatCurrency(inv.balanceDue, currency)}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-medium">$0.00</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewInvoice(inv)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        {inv.balanceDue > 0 && (
                          <button
                            onClick={() => onRecordPayment(inv)}
                            className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Record Pay</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
