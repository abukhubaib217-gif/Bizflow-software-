import React, { useState } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Customer, Invoice, InvoiceLineItem, InvoiceStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  currency: string;
  defaultTaxRate: number;
  onCreateInvoice: (invoice: Omit<Invoice, 'id'>) => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  customers,
  currency,
  defaultTaxRate,
  onCreateInvoice,
}) => {
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [issueDate, setIssueDate] = useState('2026-10-01');
  const [dueDate, setDueDate] = useState('2026-10-31');
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>('sent');
  const [taxRate, setTaxRate] = useState(defaultTaxRate);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notes, setNotes] = useState('Net 30 payment terms. Please submit payment via ACH or card.');

  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: 'item-new-1',
      description: 'Standard Commercial Service Visit & System Inspection',
      quantity: 1,
      unitPrice: 450,
      total: 450,
    },
  ]);

  const handleItemChange = (index: number, field: keyof InvoiceLineItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(value) : item.quantity;
      const p = field === 'unitPrice' ? Number(value) : item.unitPrice;
      item.total = Math.round(q * p * 100) / 100;
    }
    updated[index] = item;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-new-${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 100,
        total: 100,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * (taxRate / 100) * 100) / 100;
  const totalAmount = Math.round((taxableAmount + taxAmount) * 100) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === customerId) || customers[0];

    const newInvoice: Omit<Invoice, 'id'> = {
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: customer?.id || 'cust-1',
      customerName: customer?.companyName || customer?.name || 'Client',
      customerEmail: customer?.email || 'billing@client.com',
      issueDate,
      dueDate,
      invoiceStatus,
      paymentStatus: 'unpaid', // An approved or sent invoice starts UNPAID!
      items,
      subtotal,
      taxRate,
      taxAmount,
      discountAmount,
      totalAmount,
      amountPaid: 0,
      balanceDue: totalAmount,
      notes,
    };

    onCreateInvoice(newInvoice);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Invoice"
      subtitle="Generate a professional invoice. Note: Approved invoices are not marked paid until payment is recorded."
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* Customer & Dates Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Customer / Client *</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName ? `${c.companyName} (${c.name})` : c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Issue Date</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
        </div>

        {/* Invoice State Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200/70">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Initial Invoice State</label>
            <select
              value={invoiceStatus}
              onChange={(e) => setInvoiceStatus(e.target.value as InvoiceStatus)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="draft">Draft (Internal review only)</option>
              <option value="sent">Sent (Delivered to client)</option>
              <option value="approved">Approved (Accepted by client, pending remittance)</option>
            </select>
          </div>

          <div className="flex items-center text-[11px] text-slate-500 pt-3">
            <p>
              Payment state will remain <strong className="text-rose-700">Unpaid</strong> until
              cash, card, or check payment is physically recorded.
            </p>
          </div>
        </div>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-800">Invoice Items</span>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 items-center bg-slate-50/60 p-2 rounded-lg border border-slate-200/60"
              >
                <div className="col-span-6">
                  <input
                    type="text"
                    placeholder="Item description or service..."
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-right font-mono"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Unit $"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-right font-mono"
                    required
                  />
                </div>
                <div className="col-span-1 text-right font-mono font-bold text-slate-800">
                  {formatCurrency(item.total, currency)}
                </div>
                <div className="col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length <= 1}
                    className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation summary */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="sm:w-1/2">
            <label className="block font-semibold text-slate-700 mb-1">Notes / Terms</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            />
          </div>

          <div className="sm:w-1/2 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">{formatCurrency(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Tax Rate (%):</span>
              <input
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-16 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-right font-mono text-xs"
              />
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax Amount:</span>
              <span className="font-mono">{formatCurrency(taxAmount, currency)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span>Total Amount:</span>
              <span className="font-mono text-blue-700">{formatCurrency(totalAmount, currency)}</span>
            </div>
          </div>
        </div>

        {/* Submit */}
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
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs cursor-pointer"
          >
            Generate Invoice
          </button>
        </div>
      </form>
    </Modal>
  );
};
