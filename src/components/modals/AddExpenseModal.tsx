import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { CommonExpenseCategory, Expense, Job } from '../../types';
import { ALL_EXPENSE_CATEGORIES } from '../../data/mockData';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  jobs: Job[];
  initialCategory?: CommonExpenseCategory;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  currency,
  jobs,
  initialCategory = 'Fuel',
  onAddExpense,
}) => {
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState<CommonExpenseCategory>(initialCategory);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('2026-10-01');
  const [paymentMethod, setPaymentMethod] = useState<Expense['paymentMethod']>('Company Card');
  const [description, setDescription] = useState('');
  const [taxDeductible, setTaxDeductible] = useState(true);
  const [receiptAttached, setReceiptAttached] = useState(true);
  const [jobId, setJobId] = useState('');

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory, isOpen]);

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
      description: description || `${category} - ${vendor}`,
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
      subtitle="Log direct wages, overtime, fuel, accommodation, maintenance, or overhead."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Vendor / Payee *</label>
            <input
              type="text"
              placeholder="e.g. ExxonMobil, Extended Stay, Payroll Direct Deposit"
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
            <label className="block font-semibold text-slate-700 mb-1">Expense Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CommonExpenseCategory)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            >
              {ALL_EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
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
              <option value="Company Card">Company Card</option>
              <option value="Bank Wire">ACH / Bank Wire</option>
              <option value="Check">Check</option>
              <option value="Cash">Cash</option>
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
            placeholder="e.g. 50 gallons diesel or 4 nights hotel lodging during remote job"
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
            <span className="text-slate-700 font-medium">Receipt Attached & Verified</span>
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
