import React from 'react';
import {
  FileText,
  CreditCard,
  Users,
  Truck,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Wallet,
  Activity,
  Receipt,
  Percent,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface MetricCardsProps {
  totalRevenue: number;
  receivedPayments: number;
  pendingPayments: number;
  totalExpenses: number;
  currency: string;
  overdueAmount: number;
  overdueCount: number;
  totalCustomers?: number;
  totalJobs?: number;
  totalAssets?: number;
  totalInvoicesCount?: number;
  totalPaymentsCount?: number;
  jobLabel?: string;
  assetLabel?: string;
  onViewInvoices: () => void;
  onViewPayments: () => void;
  onViewExpenses: () => void;
  onViewCustomers?: () => void;
  onViewJobs?: () => void;
  onViewAssets?: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalRevenue,
  receivedPayments,
  pendingPayments,
  totalExpenses,
  currency,
  overdueAmount,
  overdueCount,
  totalCustomers = 42,
  totalJobs = 28,
  totalAssets = 14,
  totalInvoicesCount = 38,
  totalPaymentsCount = 31,
  jobLabel = 'Jobs',
  assetLabel = 'Vehicles',
  onViewInvoices,
  onViewPayments,
  onViewExpenses,
  onViewCustomers,
  onViewJobs,
  onViewAssets,
}) => {
  // Cash-basis net profit = Cash Received - Expenses Paid
  const netCashProfit = receivedPayments - totalExpenses;
  const netCashMargin = receivedPayments > 0 ? (netCashProfit / receivedPayments) * 100 : 0;

  // Accrual net profit = Total Revenue Billed - Expenses
  const accrualProfit = totalRevenue - totalExpenses;

  // Collection rate
  const collectionRate = totalRevenue > 0 ? Math.round((receivedPayments / totalRevenue) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Primary KPI Row: Visual Structure directly inspired by the Reference Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Invoices (Green / Emerald Accent) */}
        <button
          type="button"
          onClick={onViewInvoices}
          className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all duration-150 text-left flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <FileText className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/80 hidden sm:inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12.4%
            </span>
          </div>

          <div className="mt-3 sm:mt-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Invoices
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-mono mt-0.5 tabular-nums">
              {formatNumber(totalInvoicesCount)}
            </div>
            <div className="mt-1 text-xs sm:text-sm font-semibold text-emerald-700 font-mono tabular-nums truncate">
              {formatCurrency(totalRevenue, currency)}
            </div>
          </div>
        </button>

        {/* Card 2: Total Payments (Blue Accent) */}
        <button
          type="button"
          onClick={onViewPayments}
          className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all duration-150 text-left flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <CreditCard className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/80 hidden sm:inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {collectionRate}% rate
            </span>
          </div>

          <div className="mt-3 sm:mt-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Payments
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-mono mt-0.5 tabular-nums">
              {formatNumber(totalPaymentsCount)}
            </div>
            <div className="mt-1 text-xs sm:text-sm font-semibold text-blue-700 font-mono tabular-nums truncate">
              {formatCurrency(receivedPayments, currency)}
            </div>
          </div>
        </button>

        {/* Card 3: Total Customers (Purple / Violet Accent) */}
        <button
          type="button"
          onClick={onViewCustomers}
          className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-sm transition-all duration-150 text-left flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Users className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100/80 hidden sm:inline-flex">
              Active Accounts
            </span>
          </div>

          <div className="mt-3 sm:mt-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Customers
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-mono mt-0.5 tabular-nums">
              {formatNumber(totalCustomers)}
            </div>
            <div className="mt-1 text-xs text-slate-500 font-medium truncate">
              Clients & Corporate Accounts
            </div>
          </div>
        </button>

        {/* Card 4: Category-Aware Assets / Fleet / Crew (Amber / Orange Accent) */}
        <button
          type="button"
          onClick={onViewAssets || onViewJobs}
          className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all duration-150 text-left flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Truck className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100/80 hidden sm:inline-flex">
              Operational
            </span>
          </div>

          <div className="mt-3 sm:mt-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              Total {assetLabel}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-mono mt-0.5 tabular-nums">
              {formatNumber(totalAssets)}
            </div>
            <div className="mt-1 text-xs text-slate-500 font-medium truncate">
              Assigned across {totalJobs} active {jobLabel.toLowerCase()}
            </div>
          </div>
        </button>
      </div>

      {/* Secondary Financial Health Strip: In-depth metrics for cash, margins, and receivables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Net Profit Card */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Net Cash Profit
              </span>
              <span
                className="cursor-help text-slate-400 hover:text-slate-600"
                title="Cash Received minus Operating Expenses paid"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2">
            <div className="text-xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {formatCurrency(netCashProfit, currency)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs font-medium">
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                {netCashMargin.toFixed(1)}% margin
              </span>
              <span className="text-slate-400 text-[11px] truncate">
                Accrual: {formatCurrency(accrualProfit, currency, true)}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Expenses: {formatCurrency(totalExpenses, currency, true)}</span>
            <button
              type="button"
              onClick={onViewExpenses}
              className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
            >
              Audit Costs
            </button>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Expenses
            </span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2">
            <div className="text-xl font-bold tracking-tight text-rose-700 font-mono tabular-nums">
              {formatCurrency(totalExpenses, currency)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Fuel, maintenance, wages & operations
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Logged receipts</span>
            <button
              type="button"
              onClick={onViewExpenses}
              className="text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
            >
              View Expenses
            </button>
          </div>
        </div>

        {/* Pending Payments Card */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pending Receivables
              </span>
              <span
                className="cursor-help text-slate-400 hover:text-slate-600"
                title="Invoices awaiting settlement from customers"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2">
            <div className="text-xl font-bold tracking-tight text-amber-700 font-mono tabular-nums">
              {formatCurrency(pendingPayments, currency)}
            </div>
            {overdueAmount > 0 ? (
              <div className="flex items-center gap-1 mt-1 text-xs text-rose-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {formatCurrency(overdueAmount, currency)} ({overdueCount} overdue)
                </span>
              </div>
            ) : (
              <div className="text-xs text-slate-500 mt-1">All receivables within terms</div>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Awaiting remittance</span>
            <button
              type="button"
              onClick={onViewInvoices}
              className="text-amber-700 hover:text-amber-900 font-medium cursor-pointer"
            >
              Collect Now
            </button>
          </div>
        </div>

        {/* Collection Efficiency Card */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Collection Rate
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Percent className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2">
            <div className="text-xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {collectionRate}%
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                style={{ width: `${Math.min(collectionRate, 100)}%` }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Cleared / Billed</span>
            <button
              type="button"
              onClick={onViewPayments}
              className="text-emerald-700 hover:text-emerald-900 font-medium cursor-pointer"
            >
              View Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
