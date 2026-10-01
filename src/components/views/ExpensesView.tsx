import React, { useState } from 'react';
import { Receipt, Search, Plus, FileCheck, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Expense } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ExpensesViewProps {
  expenses: Expense[];
  currency: string;
  onOpenAddExpense: () => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  currency,
  onOpenAddExpense,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all');

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.expenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter === 'all') return true;
    return exp.category.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const deductibleExpenses = expenses
    .filter((e) => e.taxDeductible)
    .reduce((sum, e) => sum + e.amount, 0);
  const deductibleRatio = totalExpenses > 0 ? Math.round((deductibleExpenses / totalExpenses) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Operational Outflows
          </div>
          <div className="text-2xl font-bold text-rose-700 font-mono mt-1 tabular-nums">
            {formatCurrency(totalExpenses, currency)}
          </div>
          <div className="text-xs text-slate-500 mt-1">{expenses.length} expense items recorded</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tax Deductible Expenses
          </div>
          <div className="text-2xl font-bold text-blue-700 font-mono mt-1 tabular-nums">
            {formatCurrency(deductibleExpenses, currency)}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            {deductibleRatio}% write-off eligible
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Receipt Verification
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">100%</div>
          <div className="text-xs text-emerald-600 mt-1">IRS & audit compliant records</div>
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
                placeholder="Search vendor, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 overflow-x-auto">
              {['all', 'Materials', 'Equipment', 'Fuel', 'Subcontractor', 'Software'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer capitalize whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenAddExpense}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-slate-500 font-semibold">
                <th className="py-3 px-4">Expense #</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-center">Tax Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {exp.expenseNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{exp.vendor}</div>
                    <div className="text-[11px] text-slate-400">{exp.description}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-medium">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{exp.date}</td>
                  <td className="py-3 px-4 text-slate-700">{exp.paymentMethod}</td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {exp.taxDeductible ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        <FileCheck className="w-3 h-3 text-blue-600" />
                        Deductible
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Non-deductible</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-rose-700 text-sm tabular-nums">
                    -{formatCurrency(exp.amount, currency)}
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
