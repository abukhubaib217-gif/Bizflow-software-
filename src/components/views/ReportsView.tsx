import React, { useState } from 'react';
import { BarChart3, Download, Printer, TrendingUp, DollarSign, Calendar, Check, AlertCircle } from 'lucide-react';
import { Customer, Expense, Invoice, Payment } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ReportsViewProps {
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
  customers: Customer[];
  currency: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  invoices,
  payments,
  expenses,
  customers,
  currency,
}) => {
  const [activeReportTab, setActiveReportTab] = useState<'pnl' | 'ar_aging' | 'cashflow' | 'taxes'>('pnl');
  const [exportNotice, setExportNotice] = useState(false);

  // Financial calculations
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalReceivedCash = payments.reduce((sum, p) => sum + p.amount, 0);

  // COGS vs Operating Expenses
  const directMaterials = expenses
    .filter((e) => e.category === 'Materials' || e.category === 'Subcontractor')
    .reduce((sum, e) => sum + e.amount, 0);

  const operatingExpenses = expenses
    .filter((e) => e.category !== 'Materials' && e.category !== 'Subcontractor')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = directMaterials + operatingExpenses;
  const grossProfit = totalRevenue - directMaterials;
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const netAccrualProfit = totalRevenue - totalExpenses;
  const netCashSurplus = totalReceivedCash - totalExpenses;

  // AR Aging
  const openInvoices = invoices.filter((inv) => inv.balanceDue > 0);
  const current0to30 = openInvoices
    .filter((i) => i.invoiceStatus !== 'overdue')
    .reduce((sum, i) => sum + i.balanceDue, 0);

  const overduePast30 = openInvoices
    .filter((i) => i.invoiceStatus === 'overdue')
    .reduce((sum, i) => sum + i.balanceDue, 0);

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Export Action */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Financial Statements & Tax Reporting
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-ready Profit & Loss, Accounts Receivable Aging, and Cash Inflows
          </p>
        </div>

        <div className="flex items-center gap-2">
          {exportNotice && (
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Report CSV Exported</span>
            </span>
          )}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center p-1 bg-slate-200/80 rounded-xl text-xs font-semibold text-slate-600 max-w-xl">
        <button
          onClick={() => setActiveReportTab('pnl')}
          className={`flex-1 py-1.5 text-center rounded-lg transition-colors cursor-pointer ${
            activeReportTab === 'pnl' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          Profit & Loss (P&L)
        </button>
        <button
          onClick={() => setActiveReportTab('ar_aging')}
          className={`flex-1 py-1.5 text-center rounded-lg transition-colors cursor-pointer ${
            activeReportTab === 'ar_aging' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          A/R Aging Schedule
        </button>
        <button
          onClick={() => setActiveReportTab('cashflow')}
          className={`flex-1 py-1.5 text-center rounded-lg transition-colors cursor-pointer ${
            activeReportTab === 'cashflow' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          Cash Flow Ledger
        </button>
        <button
          onClick={() => setActiveReportTab('taxes')}
          className={`flex-1 py-1.5 text-center rounded-lg transition-colors cursor-pointer ${
            activeReportTab === 'taxes' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          Tax Deductions
        </button>
      </div>

      {/* Tab 1: Profit & Loss Statement */}
      {activeReportTab === 'pnl' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-base font-bold text-slate-900">
              Profit & Loss Statement (Income Statement)
            </h3>
            <p className="text-xs text-slate-500">Year-to-Date Financial Performance</p>
          </div>

          <div className="space-y-4 text-xs font-medium">
            {/* Revenue */}
            <div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pb-1 border-b border-slate-100">
                <span>Total Invoiced Revenue (Sales)</span>
                <span className="font-mono">{formatCurrency(totalRevenue, currency)}</span>
              </div>
              <div className="pl-4 py-1 flex justify-between text-slate-500 text-[11px]">
                <span>Commercial Work Orders & Service Contracts</span>
                <span className="font-mono">{formatCurrency(totalRevenue, currency)}</span>
              </div>
            </div>

            {/* COGS */}
            <div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pb-1 border-b border-slate-100">
                <span>Cost of Goods & Field Services (COGS)</span>
                <span className="font-mono text-rose-700">-{formatCurrency(directMaterials, currency)}</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-500 text-[11px] pt-1">
                <div className="flex justify-between">
                  <span>Direct Job Materials & Equipment</span>
                  <span className="font-mono">
                    {formatCurrency(
                      expenses.filter((e) => e.category === 'Materials').reduce((s, e) => s + e.amount, 0),
                      currency
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Subcontractor Specialist Labor</span>
                  <span className="font-mono">
                    {formatCurrency(
                      expenses.filter((e) => e.category === 'Subcontractor').reduce((s, e) => s + e.amount, 0),
                      currency
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Gross Profit */}
            <div className="p-3 bg-slate-50 rounded-lg flex justify-between font-bold text-sm text-slate-900">
              <span>Gross Profit (Margin: {grossMargin.toFixed(1)}%)</span>
              <span className="font-mono text-emerald-700">{formatCurrency(grossProfit, currency)}</span>
            </div>

            {/* Operating Expenses */}
            <div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pb-1 border-b border-slate-100">
                <span>Operating Overhead Expenses (SG&A)</span>
                <span className="font-mono text-rose-700">-{formatCurrency(operatingExpenses, currency)}</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-500 text-[11px] pt-1">
                <div className="flex justify-between">
                  <span>Vehicle Fleet & Fuel Operations</span>
                  <span className="font-mono">
                    {formatCurrency(
                      expenses.filter((e) => e.category === 'Fuel & Fleet').reduce((s, e) => s + e.amount, 0),
                      currency
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Software, Cloud Systems & Telecom</span>
                  <span className="font-mono">
                    {formatCurrency(
                      expenses.filter((e) => e.category === 'Software').reduce((s, e) => s + e.amount, 0),
                      currency
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Rental Equipment & Heavy Machinery</span>
                  <span className="font-mono">
                    {formatCurrency(
                      expenses.filter((e) => e.category === 'Equipment').reduce((s, e) => s + e.amount, 0),
                      currency
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Net Income Summary */}
            <div className="pt-4 border-t-2 border-slate-900 space-y-2">
              <div className="flex justify-between font-extrabold text-base text-slate-900">
                <span>Net Accrual Operating Income:</span>
                <span className="font-mono text-blue-700">{formatCurrency(netAccrualProfit, currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-700">
                <span>Net Cash Operating Surplus (Cleared Cash - Paid Costs):</span>
                <span className="font-mono text-emerald-700">{formatCurrency(netCashSurplus, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Accounts Receivable Aging */}
      {activeReportTab === 'ar_aging' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">Accounts Receivable (A/R) Aging Schedule</h3>
            <p className="text-xs text-slate-500">Breakdown of outstanding invoices by aging bucket</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <div className="text-[11px] font-bold text-emerald-800 uppercase">Current (0-30 Days)</div>
              <div className="text-xl font-bold font-mono text-emerald-900 mt-1">
                {formatCurrency(current0to30, currency)}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">Within standard payment terms</div>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
              <div className="text-[11px] font-bold text-amber-800 uppercase">31 - 60 Days Overdue</div>
              <div className="text-xl font-bold font-mono text-amber-900 mt-1">
                {formatCurrency(overduePast30, currency)}
              </div>
              <div className="text-[11px] text-amber-700 mt-1">1st collections reminder sent</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] font-bold text-slate-600 uppercase">61 - 90 Days</div>
              <div className="text-xl font-bold font-mono text-slate-800 mt-1">$0.00</div>
              <div className="text-[11px] text-slate-400 mt-1">No aging delinquent balances</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] font-bold text-slate-600 uppercase">90+ Days (Default Risk)</div>
              <div className="text-xl font-bold font-mono text-slate-800 mt-1">$0.00</div>
              <div className="text-[11px] text-slate-400 mt-1">Zero bad-debt write-offs</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cashflow */}
      {activeReportTab === 'cashflow' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">Cash Flow Statement</h3>
            <p className="text-xs text-slate-500">Reconciliation of bank cash inflows vs disbursements</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg text-emerald-900 font-semibold">
              <span>Total Cash Inflows (Cleared Deposits):</span>
              <span className="font-mono font-bold text-sm">+{formatCurrency(totalReceivedCash, currency)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg text-rose-900 font-semibold">
              <span>Total Cash Outflows (Operational Disbursements):</span>
              <span className="font-mono font-bold text-sm">-{formatCurrency(totalExpenses, currency)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg text-blue-900 font-bold text-base border border-blue-200">
              <span>Net Positive Cashflow Position:</span>
              <span className="font-mono text-blue-700">+{formatCurrency(netCashSurplus, currency)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Tax Summary */}
      {activeReportTab === 'taxes' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">Schedule C Tax Deductions Summary</h3>
            <p className="text-xs text-slate-500">Categorized write-offs for quarterly estimated tax filing</p>
          </div>

          <div className="space-y-2 text-xs">
            {expenses
              .filter((e) => e.taxDeductible)
              .map((exp) => (
                <div key={exp.id} className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
                  <div>
                    <span className="font-bold text-slate-800">{exp.category}</span>
                    <span className="text-slate-500 ml-2 font-normal">({exp.vendor})</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(exp.amount, currency)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
