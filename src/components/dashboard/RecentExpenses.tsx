import React from 'react';
import { Receipt, ArrowRight, FileCheck } from 'lucide-react';
import { Expense } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface RecentExpensesProps {
  expenses: Expense[];
  currency: string;
  onViewAllExpenses: () => void;
}

export const RecentExpenses: React.FC<RecentExpensesProps> = ({
  expenses,
  currency,
  onViewAllExpenses,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Recent Expenses</h2>
              <span className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                Operating Outflows
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Fuel, maintenance, subcontracting, and fleet costs
            </p>
          </div>
          <button
            type="button"
            onClick={onViewAllExpenses}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="py-2.5 pr-3">Expense ID</th>
                <th className="py-2.5 px-3">Vendor & Details</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-center">Tax Status</th>
                <th className="py-2.5 pl-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.slice(0, 5).map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pr-3 font-semibold text-slate-900 font-mono">
                    {exp.expenseNumber}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800 truncate max-w-[160px]">
                      {exp.vendor}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                      {exp.description}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{exp.date}</td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {exp.taxDeductible ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        <FileCheck className="w-3 h-3" />
                        Deductible
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Standard</span>
                    )}
                  </td>
                  <td className="py-3 pl-3 text-right font-mono font-bold text-rose-700 tabular-nums">
                    -{formatCurrency(exp.amount, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Recorded operating outflows</span>
        <button
          type="button"
          onClick={onViewAllExpenses}
          className="text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
        >
          View All Expenses
        </button>
      </div>
    </div>
  );
};
