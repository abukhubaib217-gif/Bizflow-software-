import React, { useState } from 'react';
import {
  Truck,
  Users,
  PieChart,
  Receipt,
  FileCheck2,
  DollarSign,
  Scale,
  Calendar,
  User,
  ShieldCheck,
  AlertCircle,
  Clock,
  Plus,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { AssetExpenseRecord, ManagedAsset } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  calculateAssetPartnerShares,
  getOwnershipModelBadgeStyle,
  getOwnershipModelLabel,
} from '../../utils/assetCalculations';

interface AssetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: ManagedAsset | null;
  currency: string;
  onOpenSettlement: (asset: ManagedAsset) => void;
  onAddAssetExpense: (assetId: string) => void;
  onUpdateAssetStatus: (assetId: string, status: ManagedAsset['status']) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  isOpen,
  onClose,
  asset,
  currency,
  onOpenSettlement,
  onAddAssetExpense,
  onUpdateAssetStatus,
}) => {
  if (!asset) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'ownership' | 'profitability' | 'expenses' | 'settlement'>('overview');

  const partnerShares = calculateAssetPartnerShares(asset);
  const profitMargin =
    asset.totalRevenue > 0
      ? Math.round((asset.netProfit / asset.totalRevenue) * 100)
      : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${asset.name} (${asset.assetNumber})`}
      subtitle={`Model: ${asset.model} (${asset.year}) · Plate: ${asset.registrationPlate}`}
      maxWidth="3xl"
    >
      <div className="space-y-5 text-xs text-slate-700">
        {/* Navigation Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Overview & Specs
          </button>
          <button
            onClick={() => setActiveTab('ownership')}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'ownership' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Ownership & Partners ({asset.partners.length})
          </button>
          <button
            onClick={() => setActiveTab('profitability')}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'profitability' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Profitability & Payouts
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'expenses' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Asset Expenses ({asset.expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('settlement')}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'settlement' ? 'bg-white text-amber-800 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Final Settlement
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Ownership Model</span>
                <div className="mt-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${getOwnershipModelBadgeStyle(
                      asset.ownershipModel
                    )}`}
                  >
                    {getOwnershipModelLabel(asset.ownershipModel)}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Current Status</span>
                <div className="mt-1">
                  <select
                    value={asset.status}
                    onChange={(e) => onUpdateAssetStatus(asset.id, e.target.value as any)}
                    className="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs font-semibold text-slate-800"
                  >
                    <option value="active_available">Active & Available</option>
                    <option value="on_job">On Active Job</option>
                    <option value="maintenance">Under Maintenance</option>
                    <option value="contract_ended">Contract Ended</option>
                    <option value="settled">Settled / Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Driver</span>
                <p className="font-semibold text-slate-900 mt-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{asset.assignedDriverName || 'Unassigned (Yard Pool)'}</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Service Dates</span>
                <p className="font-semibold text-slate-900 mt-1">
                  {asset.startDate} {asset.endDate ? `to ${asset.endDate}` : '(Indefinite)'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500">Asset Invoiced Revenue</span>
                <div className="text-xl font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                  {formatCurrency(asset.totalRevenue, currency)}
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500">Total Operating Expenses</span>
                <div className="text-xl font-bold font-mono text-rose-700 mt-0.5 tabular-nums">
                  {formatCurrency(asset.totalExpenses, currency)}
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500">Net Profit</span>
                <div className="text-xl font-bold font-mono text-emerald-700 mt-0.5 tabular-nums">
                  {formatCurrency(asset.netProfit, currency)}
                </div>
              </div>
            </div>

            {asset.notes && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="font-bold text-slate-900 block mb-1">Operational Equipment Memo</span>
                <p className="text-slate-600 leading-relaxed text-xs">{asset.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Ownership & Partners */}
        {activeTab === 'ownership' && (
          <div className="space-y-4">
            {asset.leaseAgreement && (
              <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-2">
                <span className="font-bold text-purple-900 text-xs block">
                  Lessor & Lease Agreement Information
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-purple-950">
                  <div>
                    <span className="text-[10px] text-purple-600 uppercase font-bold block">Owner / Lessor</span>
                    <strong className="text-xs">{asset.leaseAgreement.ownerLessorName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-600 uppercase font-bold block">Rental Payment</span>
                    <strong className="text-xs font-mono">
                      {formatCurrency(asset.leaseAgreement.rentalAmount, currency)} / {asset.leaseAgreement.paymentFrequency}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-600 uppercase font-bold block">Contract Term</span>
                    <span className="text-xs">
                      {asset.leaseAgreement.contractStartDate} to {asset.leaseAgreement.contractEndDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-600 uppercase font-bold block">Lease Paid YTD</span>
                    <strong className="text-xs font-mono text-purple-900">
                      {formatCurrency(asset.leaseAgreement.rentalExpenseYTD, currency)}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">
                  Equity Stakeholders & Partners
                </span>
                <span className="text-[11px] text-slate-500">
                  {asset.partners.length} registered partner{asset.partners.length !== 1 ? 's' : ''}
                </span>
              </div>

              {asset.partners.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  No separate partner records. Asset operates under standard commercial lease or company sole ownership.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/50">
                      <th className="py-2.5 px-3">Partner / Investor</th>
                      <th className="py-2.5 px-3 text-center">Equity Stake</th>
                      <th className="py-2.5 px-3 text-right">Capital Invested</th>
                      <th className="py-2.5 px-3">Effective Date</th>
                      <th className="py-2.5 pr-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {asset.partners.map((partner) => (
                      <tr key={partner.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">{partner.name}</div>
                          {partner.email && (
                            <div className="text-[11px] text-slate-400">{partner.email}</div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-blue-700">
                          {partner.ownershipPercentage}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-700">
                          {partner.investmentAmount
                            ? formatCurrency(partner.investmentAmount, currency)
                            : 'N/A'}
                        </td>
                        <td className="py-3 px-3 text-slate-600">{partner.startDate}</td>
                        <td className="py-3 pr-3 text-center">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Profitability & Payouts */}
        {activeTab === 'profitability' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 text-[11px] block">Revenue</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {formatCurrency(asset.totalRevenue, currency)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Shared Expenses</span>
                <span className="font-mono font-bold text-rose-700 text-sm">
                  -{formatCurrency(asset.sharedExpenses, currency)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Direct Expenses</span>
                <span className="font-mono font-bold text-amber-700 text-sm">
                  -{formatCurrency(asset.directExpenses, currency)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Net Realized Profit</span>
                <span className="font-mono font-extrabold text-emerald-700 text-sm">
                  {formatCurrency(asset.netProfit, currency)}
                </span>
              </div>
            </div>

            {/* Payout Schedule */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">
                  Automated Partner Distribution Table
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  {profitMargin}% Net Margin
                </span>
              </div>

              {partnerShares.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  100% of proceeds belong to company.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/50">
                      <th className="py-2.5 px-3">Partner</th>
                      <th className="py-2.5 px-3 text-center">Ratio</th>
                      <th className="py-2.5 px-3 text-right">Revenue Share</th>
                      <th className="py-2.5 px-3 text-right">Shared Exp. Share</th>
                      <th className="py-2.5 px-3 text-right">Direct Costs</th>
                      <th className="py-2.5 pr-3 text-right">Amount Payable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {partnerShares.map((p) => (
                      <tr key={p.partnerId} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-semibold text-slate-900">{p.partnerName}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-blue-700">
                          {p.ownershipPercentage}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-800">
                          {formatCurrency(p.revenueShareAmount, currency)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-rose-700">
                          -{formatCurrency(p.expenseShareAmount, currency)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-amber-700">
                          {p.directExpensesIncurred > 0
                            ? `-${formatCurrency(p.directExpensesIncurred, currency)}`
                            : '$0.00'}
                        </td>
                        <td className="py-3 pr-3 text-right font-mono font-extrabold text-blue-700">
                          {formatCurrency(p.netPayableAmount, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Expense Ledger */}
        {activeTab === 'expenses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs">Assigned Operational Expenses</span>
                <p className="text-[11px] text-slate-500">
                  Shared expenses split across partners; direct expenses charged specifically.
                </p>
              </div>
              <button
                onClick={() => onAddAssetExpense(asset.id)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Log Asset Cost</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/50">
                    <th className="py-2.5 px-3">Expense #</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Vendor & Description</th>
                    <th className="py-2.5 px-3 text-center">Allocation Method</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 pr-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {asset.expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {exp.expenseNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{exp.vendor}</div>
                        <div className="text-[11px] text-slate-400">{exp.description}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {exp.allocationType === 'shared' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200">
                            Shared Allocation
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200" title={exp.directChargedTo}>
                            Direct: {exp.directChargedTo || 'Company'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{exp.date}</td>
                      <td className="py-3 pr-3 text-right font-mono font-bold text-rose-700 tabular-nums">
                        -{formatCurrency(exp.amount, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Settlement */}
        {activeTab === 'settlement' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start justify-between gap-4">
              <div>
                <h4 className="font-bold text-amber-900 text-sm">
                  Asset Closeout & Final Partnership Settlement
                </h4>
                <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                  When this asset is sold, returned to lessor, or the partnership syndicate concludes,
                  execute a formal final settlement to reconcile ledger accounts and close stakeholder
                  payables.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenSettlement(asset);
                }}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs whitespace-nowrap shadow-xs transition-colors cursor-pointer shrink-0"
              >
                Launch Settlement
              </button>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs space-y-2">
              <span className="font-bold text-slate-900 block">Settlement Audit Invariants</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                <li>Historical transaction timestamps and prior invoice payouts remain immutable.</li>
                <li>Each owner receives their exact mathematical share of remaining net profit.</li>
                <li>Lessor obligations and security deposits are explicitly reconciled.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Asset ID: {asset.id} · Category: {asset.assetType}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
