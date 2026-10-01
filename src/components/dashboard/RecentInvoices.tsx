import React from 'react';
import { FileText, ArrowRight, Eye, CreditCard } from 'lucide-react';
import { Invoice } from '../../types';
import { formatCurrency, getInvoiceStatusMeta, getPaymentStatusMeta } from '../../utils/formatters';

interface RecentInvoicesProps {
  invoices: Invoice[];
  currency: string;
  onViewInvoice: (invoice: Invoice) => void;
  onRecordPaymentForInvoice: (invoice: Invoice) => void;
  onViewAllInvoices: () => void;
}

export const RecentInvoices: React.FC<RecentInvoicesProps> = ({
  invoices,
  currency,
  onViewInvoice,
  onRecordPaymentForInvoice,
  onViewAllInvoices,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Recent Invoices</h2>
              <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Billing & Receivables
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Approved invoices are not automatically paid; track status independently
            </p>
          </div>
          <button
            onClick={onViewAllInvoices}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="py-2.5 pr-3">Invoice</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3 text-center">Invoice State</th>
                <th className="py-2.5 px-3 text-center">Payment State</th>
                <th className="py-2.5 px-3 text-right">Total</th>
                <th className="py-2.5 pl-3 text-right">Balance Due</th>
                <th className="py-2.5 pl-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.slice(0, 5).map((inv) => {
                const invMeta = getInvoiceStatusMeta(inv.invoiceStatus);
                const payMeta = getPaymentStatusMeta(inv.paymentStatus);

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 pr-3 font-semibold text-slate-900 font-mono">
                      <button
                        onClick={() => onViewInvoice(inv)}
                        className="hover:text-blue-600 hover:underline cursor-pointer"
                      >
                        {inv.invoiceNumber}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 truncate max-w-[150px]">
                        {inv.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                        {inv.jobTitle || 'Direct Billing'}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{inv.dueDate}</td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded border ${invMeta.className}`}
                      >
                        {invMeta.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded border ${payMeta.className}`}
                      >
                        {payMeta.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-800 tabular-nums">
                      {formatCurrency(inv.totalAmount, currency)}
                    </td>
                    <td className="py-3 pl-3 text-right font-mono font-bold tabular-nums">
                      {inv.balanceDue > 0 ? (
                        <span className="text-amber-700">
                          {formatCurrency(inv.balanceDue, currency)}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">$0.00</span>
                      )}
                    </td>
                    <td className="py-3 pl-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewInvoice(inv)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="View Invoice Sheet"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {inv.balanceDue > 0 && (
                          <button
                            onClick={() => onRecordPaymentForInvoice(inv)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            title="Record Payment"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
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
