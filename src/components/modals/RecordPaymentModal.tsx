import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Invoice, Payment } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  initialInvoiceId?: string;
  currency: string;
  onRecordPayment: (payment: Omit<Payment, 'id'>) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  invoices,
  initialInvoiceId,
  currency,
  onRecordPayment,
}) => {
  const unpaidInvoices = invoices.filter((inv) => inv.balanceDue > 0);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(
    initialInvoiceId || unpaidInvoices[0]?.id || ''
  );
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('2026-10-01');
  const [method, setMethod] = useState<Payment['method']>('ACH Bank Wire');
  const [reference, setReference] = useState('');

  useEffect(() => {
    if (initialInvoiceId) {
      setSelectedInvoiceId(initialInvoiceId);
    } else if (unpaidInvoices.length > 0 && !selectedInvoiceId) {
      setSelectedInvoiceId(unpaidInvoices[0].id);
    }
  }, [initialInvoiceId, unpaidInvoices]);

  const currentInvoice = invoices.find((inv) => inv.id === selectedInvoiceId);

  useEffect(() => {
    if (currentInvoice) {
      setAmount(String(currentInvoice.balanceDue));
    }
  }, [selectedInvoiceId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInvoice || !amount) return;

    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) return;

    const newPayment: Omit<Payment, 'id'> = {
      paymentNumber: `PAY-${Math.floor(8000 + Math.random() * 2000)}`,
      invoiceId: currentInvoice.id,
      invoiceNumber: currentInvoice.invoiceNumber,
      customerId: currentInvoice.customerId,
      customerName: currentInvoice.customerName,
      amount: paymentAmount,
      date,
      method,
      reference: reference || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'completed',
    };

    onRecordPayment(newPayment);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Received Payment"
      subtitle="Log physical cash, cleared ACH bank wires, credit card charges, or checks."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Select Open Invoice *</label>
          {unpaidInvoices.length === 0 ? (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500">
              No open invoices with balance due found.
            </div>
          ) : (
            <select
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            >
              {unpaidInvoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} - {inv.customerName} (Due: {formatCurrency(inv.balanceDue, currency)})
                </option>
              ))}
            </select>
          )}
        </div>

        {currentInvoice && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500">Total Invoiced:</div>
              <div className="font-mono font-medium text-slate-800">
                {formatCurrency(currentInvoice.totalAmount, currency)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500">Already Paid:</div>
              <div className="font-mono font-medium text-emerald-700">
                {formatCurrency(currentInvoice.amountPaid, currency)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-bold">Remaining Balance Due:</div>
              <div className="font-mono font-bold text-amber-700">
                {formatCurrency(currentInvoice.balanceDue, currency)}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Payment Amount ({currency}) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={currentInvoice?.balanceDue}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-right font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Settlement Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as Payment['method'])}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ACH Bank Wire">ACH Bank Wire</option>
              <option value="Stripe / Credit Card">Credit / Debit Card</option>
              <option value="Check">Business Check</option>
              <option value="Cash">Cash Deposit</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Transaction Ref / Check #</label>
            <input
              type="text"
              placeholder="e.g. WIRE-89102 or CHK-4401"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!currentInvoice}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium shadow-xs cursor-pointer"
          >
            Confirm & Deposit
          </button>
        </div>
      </form>
    </Modal>
  );
};
