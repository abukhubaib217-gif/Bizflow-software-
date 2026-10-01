import React from 'react';
import { FileText, Receipt, UserPlus, Briefcase, Plus } from 'lucide-react';

interface QuickActionsBarProps {
  onCreateInvoice: () => void;
  onAddExpense: () => void;
  onAddCustomer: () => void;
  onCreateJob: () => void;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onCreateInvoice,
  onAddExpense,
  onAddCustomer,
  onCreateJob,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Quick Actions</h2>
          <p className="text-xs text-slate-500">Fast entry for daily business workflows</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Create Invoice */}
        <button
          onClick={onCreateInvoice}
          className="flex items-center gap-3 p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 transition-all text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
              Create Invoice
            </div>
            <div className="text-[11px] text-slate-500 truncate">Bill client for work</div>
          </div>
        </button>

        {/* Add Expense */}
        <button
          onClick={onAddExpense}
          className="flex items-center gap-3 p-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300 transition-all text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <Receipt className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
              Add Expense
            </div>
            <div className="text-[11px] text-slate-500 truncate">Log receipt or supply</div>
          </div>
        </button>

        {/* Add Customer */}
        <button
          onClick={onAddCustomer}
          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <UserPlus className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
              Add Customer
            </div>
            <div className="text-[11px] text-slate-500 truncate">New client account</div>
          </div>
        </button>

        {/* Create Job */}
        <button
          onClick={onCreateJob}
          className="flex items-center gap-3 p-3 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-300 transition-all text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
              Create Job
            </div>
            <div className="text-[11px] text-slate-500 truncate">Dispatch work order</div>
          </div>
        </button>
      </div>
    </div>
  );
};
