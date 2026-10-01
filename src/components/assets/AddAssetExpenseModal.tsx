import React, { useState } from 'react';
import { Receipt, AlertCircle, PieChart, ShieldCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { CommonExpenseCategory, ManagedAsset, AssetExpenseRecord } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface AddAssetExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: ManagedAsset | null;
  currency: string;
  onAddExpense: (assetId: string, expense: Omit<AssetExpenseRecord, 'id' | 'expenseNumber'>) => void;
}

const ASSET_EXPENSE_CATEGORIES: CommonExpenseCategory[] = [
  'Fuel',
  'Maintenance',
  'Salary/Wages',
  'Overtime',
  'Accommodation',
  'Food/Meals',
  'Communication',
  'Transportation',
  'Insurance',
  'Rent',
  'Government Fees',
  'Other Expenses',
];

export const AddAssetExpenseModal: React.FC<AddAssetExpenseModalProps> = ({
  isOpen,
  onClose,
  asset,
  currency,
  onAddExpense,
}) => {
  if (!asset) return null;

  const [category, setCategory] = useState<CommonExpenseCategory>('Fuel');
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('2026-10-01');
  const [allocationType, setAllocationType] = useState<'shared' | 'direct'>('shared');
  const [directChargedTo, setDirectChargedTo] = useState('Company Account');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!vendor || isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAddExpense(asset.id, {
      category,
      vendor,
      amount: parsedAmount,
      date,
      allocationType,
      directChargedTo: allocationType === 'direct' ? directChargedTo : undefined,
      description: description || `${category} - ${vendor} for ${asset.assetNumber}`,
    });

    onClose();
    setVendor('');
    setAmount('');
    setDescription('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Log Expense for ${asset.name} (${asset.assetNumber})`}
      subtitle="Record operational costs with Shared or Direct allocation"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs text-slate-700">
        {/* Asset Brief Card */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Target Asset
            </span>
            <span className="font-bold text-slate-900 text-xs">
              {asset.name} · <span className="font-mono text-blue-700">{asset.assetNumber}</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Current YTD Expenses
            </span>
            <span className="font-mono font-bold text-rose-700 text-xs">
              {formatCurrency(asset.totalExpenses, currency)}
            </span>
          </div>
        </div>

        {/* Category & Vendor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Expense Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CommonExpenseCategory)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {ASSET_EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Vendor / Service Payee <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Shell Fuel Card, Hydraulic Service..."
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Amount & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Expense Amount ({currency}) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Expense Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Allocation Method: Shared vs Direct */}
        <div className="space-y-2.5">
          <label className="block text-[11px] font-semibold text-slate-700">
            Allocation Method <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                allocationType === 'shared'
                  ? 'bg-blue-50/60 border-blue-500 text-blue-950 ring-1 ring-blue-500'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="allocation"
                checked={allocationType === 'shared'}
                onChange={() => setAllocationType('shared')}
                className="mt-0.5"
              />
              <div>
                <span className="font-bold block text-xs">Shared Expense</span>
                <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                  Split automatically among partners according to their configured equity/sharing ratio.
                </span>
              </div>
            </label>

            <label
              className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                allocationType === 'direct'
                  ? 'bg-amber-50/60 border-amber-500 text-amber-950 ring-1 ring-amber-500'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="allocation"
                checked={allocationType === 'direct'}
                onChange={() => setAllocationType('direct')}
                className="mt-0.5"
              />
              <div>
                <span className="font-bold block text-xs">Direct Expense</span>
                <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                  Charged directly to a designated entity without automatic percentage distribution.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Direct Charge Beneficiary */}
        {allocationType === 'direct' && (
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
            <label className="block text-[11px] font-semibold text-amber-900">
              Charge Directly To:
            </label>
            <select
              value={directChargedTo}
              onChange={(e) => setDirectChargedTo(e.target.value)}
              className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="Company Account">Company Account (Operating Business)</option>
              {asset.partners.map((partner) => (
                <option key={partner.id} value={`Partner: ${partner.name}`}>
                  Partner: {partner.name} ({partner.ownershipPercentage}%)
                </option>
              ))}
              {asset.leaseAgreement && (
                <option value={`Lessor: ${asset.leaseAgreement.ownerLessorName}`}>
                  Lessor: {asset.leaseAgreement.ownerLessorName}
                </option>
              )}
              <option value="Operator / Driver Deduction">Operator / Driver Deduction</option>
            </select>
            <p className="text-[10px] text-amber-700">
              This amount will be deducted directly from this party&apos;s settlement rather than shared across partners.
            </p>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Description & Notes
          </label>
          <textarea
            rows={2}
            placeholder="Work order reference, invoice number, or maintenance note..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            Log Asset Expense
          </button>
        </div>
      </form>
    </Modal>
  );
};
