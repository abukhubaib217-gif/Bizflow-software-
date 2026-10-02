import React from 'react';
import {
  FileText,
  Receipt,
  UserPlus,
  Briefcase,
  CreditCard,
  PlusCircle,
  Truck,
  Sparkles,
} from 'lucide-react';

interface QuickActionsBarProps {
  jobLabel: string;
  assetLabel?: string;
  onCreateInvoice: () => void;
  onAddExpense: () => void;
  onAddCustomer: () => void;
  onCreateJob: () => void;
  onRecordPayment?: () => void;
  onAddAsset?: () => void;
  hasAssets?: boolean;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  jobLabel,
  assetLabel = 'Asset',
  onCreateInvoice,
  onAddExpense,
  onAddCustomer,
  onCreateJob,
  onRecordPayment,
  onAddAsset,
  hasAssets = true,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Quick Operations</h2>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              Fast Dispatch
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            1-click shortcuts for primary business workflows
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {/* 1. Create Invoice */}
        <button
          type="button"
          onClick={onCreateInvoice}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 sm:gap-3 p-3 rounded-xl border border-blue-100 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-300 transition-all text-center sm:text-left group cursor-pointer shadow-2xs hover:shadow-xs min-h-[52px]"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
              Create Invoice
            </div>
            <div className="text-[11px] text-slate-500 truncate hidden sm:block">Bill client</div>
          </div>
        </button>

        {/* 2. Record Payment */}
        {onRecordPayment && (
          <button
            type="button"
            onClick={onRecordPayment}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 sm:gap-3 p-3 rounded-xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-center sm:text-left group cursor-pointer shadow-2xs hover:shadow-xs min-h-[52px]"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                Add Payment
              </div>
              <div className="text-[11px] text-slate-500 truncate hidden sm:block">Log deposit</div>
            </div>
          </button>
        )}

        {/* 3. Create Job (Category-Aware) */}
        <button
          type="button"
          onClick={onCreateJob}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 sm:gap-3 p-3 rounded-xl border border-purple-100 bg-purple-50/40 hover:bg-purple-50 hover:border-purple-300 transition-all text-center sm:text-left group cursor-pointer shadow-2xs hover:shadow-xs min-h-[52px]"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
              New {jobLabel}
            </div>
            <div className="text-[11px] text-slate-500 truncate hidden sm:block">Dispatch order</div>
          </div>
        </button>

        {/* 4. Add Expense */}
        <button
          type="button"
          onClick={onAddExpense}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 sm:gap-3 p-3 rounded-xl border border-rose-100 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-300 transition-all text-center sm:text-left group cursor-pointer shadow-2xs hover:shadow-xs min-h-[52px]"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <Receipt className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition-colors truncate">
              Add Expense
            </div>
            <div className="text-[11px] text-slate-500 truncate hidden sm:block">Fuel, supplies</div>
          </div>
        </button>

        {/* 5. Add Customer */}
        <button
          type="button"
          onClick={onAddCustomer}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 sm:gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 transition-all text-center sm:text-left group cursor-pointer shadow-2xs hover:shadow-xs min-h-[52px]"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <UserPlus className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 group-hover:text-slate-800 transition-colors truncate">
              Add Customer
            </div>
            <div className="text-[11px] text-slate-500 truncate hidden sm:block">Client profile</div>
          </div>
        </button>

        {/* 6. Add Asset (when available) */}
        {hasAssets && onAddAsset && (
          <button
            type="button"
            onClick={onAddAsset}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 sm:gap-3 p-3 rounded-xl border border-amber-100 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-300 transition-all text-center sm:text-left group cursor-pointer shadow-2xs hover:shadow-xs min-h-[52px]"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Truck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition-colors truncate">
                Add {assetLabel}
              </div>
              <div className="text-[11px] text-slate-500 truncate hidden sm:block">Equipment, unit</div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
