import React from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Wallet,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface MetricCardsProps {
  totalRevenue: number;
  receivedPayments: number;
  pendingPayments: number;
  totalExpenses: number;
  currency: string;
  overdueAmount: number;
  overdueCount: number;
  onViewInvoices: () => void;
  onViewPayments: () => void;
  onViewExpenses: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalRevenue,
  receivedPayments,
  pendingPayments,
  totalExpenses,
  currency,
  overdueAmount,
  overdueCount,
  onViewInvoices,
  onViewPayments,
  onViewExpenses,
}) => {
  // Cash-basis net profit = Cash Received - Expenses Paid
  const netCashProfit = receivedPayments - totalExpenses;
  const netCashMargin = receivedPayments > 0 ? (netCashProfit / receivedPayments) * 100 : 0;

  // Accrual net profit = Total Revenue Billed - Expenses
  const accrualProfit = totalRevenue - totalExpenses;

  const collectionRate = totalRevenue > 0 ? Math.round((receivedPayments / totalRevenue) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. Total Revenue Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Revenue / Sales
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {formatCurrency(totalRevenue, currency)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.8% vs last month</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span title="Total amount billed across all approved and active invoices">
            Invoiced & contracts billed
          </span>
          <button
            onClick={onViewInvoices}
            className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          >
            View Invoices
          </button>
        </div>
      </div>

      {/* 2. Received Payments Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Received Payments
              </span>
              <span
                className="cursor-help text-slate-400 hover:text-slate-600"
                title="Actual cleared funds collected into the bank account"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-bold tracking-tight text-emerald-700 font-mono tabular-nums">
              {formatCurrency(receivedPayments, currency)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600 font-medium">
              <span className="text-emerald-600 font-semibold">{collectionRate}%</span>
              <span>collection rate to date</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Cleared bank deposits</span>
          <button
            onClick={onViewPayments}
            className="text-emerald-700 hover:text-emerald-900 font-medium cursor-pointer"
          >
            View Ledger
          </button>
        </div>
      </div>

      {/* 3. Pending Payments Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pending Payments
              </span>
              <span
                className="cursor-help text-slate-400 hover:text-slate-600"
                title="Accounts Receivable: Approved or sent invoices awaiting payment"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-bold tracking-tight text-amber-700 font-mono tabular-nums">
              {formatCurrency(pendingPayments, currency)}
            </div>
            {overdueAmount > 0 ? (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-rose-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {formatCurrency(overdueAmount, currency)} ({overdueCount} overdue)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                <span>All receivables within terms</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Awaiting remittance</span>
          <button
            onClick={onViewInvoices}
            className="text-amber-700 hover:text-amber-900 font-medium cursor-pointer"
          >
            Collect Now
          </button>
        </div>
      </div>

      {/* 4. Net Profit Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Net Profit (Cash)
              </span>
              <span
                className="cursor-help text-slate-400 hover:text-slate-600"
                title="Received Payments minus Operating Expenses paid"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {formatCurrency(netCashProfit, currency)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs font-medium">
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                {netCashMargin.toFixed(1)}% margin
              </span>
              <span className="text-slate-400">
                (Accrual: {formatCurrency(accrualProfit, currency, true)})
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Expenses: {formatCurrency(totalExpenses, currency, true)}</span>
          <button
            onClick={onViewExpenses}
            className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
          >
            Audit Costs
          </button>
        </div>
      </div>
    </div>
  );
};
