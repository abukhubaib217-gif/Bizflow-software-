import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Expense, Job } from '../../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  jobs: Job[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  currency,
  jobs,
  onAddExpense,
}) => {
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Materials');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('2026-10-01');
  const [paymentMethod, setPaymentMethod] = useState<Expense['paymentMethod']>('Company Card');
  const [description, setDescription] = useState('');
  const [taxDeductible, setTaxDeductible] = useState(true);
  const [receiptAttached, setReceiptAttached] = useState(true);
  const [jobId, setJobId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor || !amount) return;

    const newExpense: Omit<Expense, 'id'> = {
      expenseNumber: `EXP-${Math.floor(4000 + Math.random() * 5000)}`,
      category,
      vendor,
      amount: parseFloat(amount),
      date,
      paymentMethod,
      taxDeductible,
      receiptAttached,
      description: description || `${category} purchase from ${vendor}`,
      jobId: jobId || undefined,
    };

    onAddExpense(newExpense);
    onClose();
    setVendor('');
    setAmount('');
    setDescription('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Operating Expense"
      subtitle="Record operational costs, material expenses, subcontractor fees, or tools."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Vendor / Supplier *</label>
            <input
              type="text"
              placeholder="e.g. Carrier Supply, Home Depot, Sunbelt Rentals"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Amount ({currency}) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Expense Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Expense['category'])}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Materials">Materials & Hardware</option>
              <option value="Subcontractor">Subcontractor Labor</option>
              <option value="Equipment">Equipment & Tool Rental</option>
              <option value="Fuel & Fleet">Fuel & Fleet Maintenance</option>
              <option value="Software">Software & Cloud Services</option>
              <option value="Utilities & Tools">Utilities & Small Tools</option>
              <option value="Payroll & Labor">Payroll & Direct Labor</option>
              <option value="Office & Insurance">Office, Legal & Insurance</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Expense Date</label>
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
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as Expense['paymentMethod'])}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Company Card">Company Credit Card</option>
              <option value="Bank Wire">ACH / Bank Wire</option>
              <option value="Check">Check</option>
              <option value="Cash">Petty Cash</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assign to Job (Optional)</label>
            <select
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">General Overhead (No Job)</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.jobNumber} - {j.title.slice(0, 30)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Description / Memo</label>
          <input
            type="text"
            placeholder="Itemization details or project memo..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Toggles */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 flex flex-col sm:flex-row gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={taxDeductible}
              onChange={(e) => setTaxDeductible(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-slate-700 font-medium">100% Tax Deductible Business Expense</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={receiptAttached}
              onChange={(e) => setReceiptAttached(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-slate-700 font-medium">Digital Receipt Document Verified</span>
          </label>
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
            className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-xs cursor-pointer"
          >
            Save Expense
          </button>
        </div>
      </form>
    </Modal>
  );
};
