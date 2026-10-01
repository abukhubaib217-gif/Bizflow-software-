import React from 'react';
import { Printer, Download, CreditCard, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { BusinessConfig, Invoice } from '../../types';
import { formatCurrency, getInvoiceStatusMeta, getPaymentStatusMeta } from '../../utils/formatters';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  businessConfig: BusinessConfig;
  onRecordPayment: (invoice: Invoice) => void;
  onUpdateInvoiceStatus: (invoiceId: string, newStatus: Invoice['invoiceStatus']) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  isOpen,
  onClose,
  invoice,
  businessConfig,
  onRecordPayment,
  onUpdateInvoiceStatus,
}) => {
  if (!invoice) return null;

  const invMeta = getInvoiceStatusMeta(invoice.invoiceStatus);
  const payMeta = getPaymentStatusMeta(invoice.paymentStatus);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice ${invoice.invoiceNumber}`}
      subtitle="Standardized commercial invoice statement"
      maxWidth="3xl"
    >
      <div className="space-y-6 text-xs text-slate-700">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Status:</span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${invMeta.className}`}>
              Invoice: {invMeta.label}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${payMeta.className}`}>
              Payment: {payMeta.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {invoice.invoiceStatus !== 'approved' && (
              <button
                onClick={() => onUpdateInvoiceStatus(invoice.id, 'approved')}
                className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-emerald-700 font-medium transition-colors cursor-pointer"
              >
                Mark Approved
              </button>
            )}
            {invoice.balanceDue > 0 && (
              <button
                onClick={() => {
                  onClose();
                  onRecordPayment(invoice);
                }}
                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Record Payment</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded transition-colors cursor-pointer"
              title="Print Invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-6">
          {/* Header row */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {businessConfig.name}
              </h2>
              <p className="text-[11px] text-slate-500">{businessConfig.tagline}</p>
              <div className="mt-2 text-slate-600 leading-relaxed text-[11px]">
                <p>{businessConfig.address}</p>
                <p>{businessConfig.phone} · {businessConfig.email}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-mono font-black text-slate-900">
                {invoice.invoiceNumber}
              </div>
              <div className="mt-2 space-y-0.5 text-[11px] text-slate-500">
                <div>Issue Date: <strong className="text-slate-700">{invoice.issueDate}</strong></div>
                <div>Payment Due: <strong className="text-rose-700">{invoice.dueDate}</strong></div>
                <div>Terms: <strong className="text-slate-700">{businessConfig.paymentTerms}</strong></div>
              </div>
            </div>
          </div>

          {/* Bill To & Job Reference */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                Billed To
              </div>
              <div className="font-bold text-slate-900 text-sm">{invoice.customerName}</div>
              <div className="text-[11px] text-slate-600 mt-0.5">{invoice.customerEmail}</div>
            </div>

            {invoice.jobTitle && (
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                  Associated Project / Work Order
                </div>
                <div className="font-semibold text-slate-800">{invoice.jobTitle}</div>
                <div className="text-[11px] text-slate-500">Job Reference #{invoice.jobId || 'N/A'}</div>
              </div>
            )}
          </div>

          {/* Line items table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3 text-right">Qty</th>
                  <th className="py-2 px-3 text-right">Unit Price</th>
                  <th className="py-2 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{item.description}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {formatCurrency(item.unitPrice, businessConfig.currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(item.total, businessConfig.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">{formatCurrency(invoice.subtotal, businessConfig.currency)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-mono">-{formatCurrency(invoice.discountAmount, businessConfig.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax ({invoice.taxRate}%):</span>
                <span className="font-mono">{formatCurrency(invoice.taxAmount, businessConfig.currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Total Invoiced:</span>
                <span className="font-mono">{formatCurrency(invoice.totalAmount, businessConfig.currency)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Amount Paid:</span>
                <span className="font-mono">-{formatCurrency(invoice.amountPaid, businessConfig.currency)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-blue-700 pt-1 border-t border-slate-200">
                <span>Balance Due:</span>
                <span className="font-mono">
                  {formatCurrency(invoice.balanceDue, businessConfig.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Remittance */}
          {invoice.notes && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 text-[11px] text-slate-600">
              <strong className="text-slate-800">Payment Instructions:</strong> {invoice.notes}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
