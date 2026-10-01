import React, { useState } from 'react';
import {
  Truck,
  Search,
  Plus,
  Filter,
  DollarSign,
  TrendingUp,
  PieChart,
  Users,
  ShieldCheck,
  Scale,
  Calendar,
  AlertCircle,
  Eye,
  FileCheck2,
  ChevronRight,
  Receipt,
} from 'lucide-react';
import { BusinessConfig, ManagedAsset, OwnershipModel } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  getOwnershipModelBadgeStyle,
  getOwnershipModelLabel,
} from '../../utils/assetCalculations';

interface AssetsViewProps {
  assets: ManagedAsset[];
  currency: string;
  businessConfig: BusinessConfig;
  onOpenCreateAsset: () => void;
  onViewAssetDetail: (asset: ManagedAsset) => void;
  onViewAssetProfitability: (asset: ManagedAsset) => void;
  onOpenAssetSettlement: (asset: ManagedAsset) => void;
  onAddAssetExpense: (assetId: string) => void;
}

export const AssetsView: React.FC<AssetsViewProps> = ({
  assets,
  currency,
  businessConfig,
  onOpenCreateAsset,
  onViewAssetDetail,
  onViewAssetProfitability,
  onOpenAssetSettlement,
  onAddAssetExpense,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | OwnershipModel | 'outstanding'>('all');

  // Overview metrics
  const totalAssetsCount = assets.length;
  const companyOwnedCount = assets.filter((a) => a.ownershipModel === 'company_owned').length;
  const sharedAssetsCount = assets.filter(
    (a) => a.ownershipModel === 'shared_partnership' || a.ownershipModel === 'company_partner_share'
  ).length;
  const rentedLeasedCount = assets.filter(
    (a) => a.ownershipModel === 'rented_leased' || a.ownershipModel === 'rented_profit_sharing'
  ).length;

  const totalAssetRevenue = assets.reduce((s, a) => s + a.totalRevenue, 0);
  const totalAssetExpenses = assets.reduce((s, a) => s + a.totalExpenses, 0);
  const totalAssetProfit = assets.reduce((s, a) => s + a.netProfit, 0);
  const totalOutstanding = assets.reduce((s, a) => s + a.outstandingPayments, 0);

  // Top profitable assets
  const topProfitable = [...assets].sort((a, b) => b.netProfit - a.netProfit).slice(0, 3);

  // Filtered assets
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.registrationPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.assignedDriverName && asset.assignedDriverName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (ownershipFilter === 'all') return true;
    if (ownershipFilter === 'outstanding') return asset.outstandingPayments > 0;
    return asset.ownershipModel === ownershipFilter;
  });

  return (
    <div className="space-y-6">
      {/* Asset Overview Dashboard KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Income Assets
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {totalAssetsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Company: {companyOwnedCount} · Shared: {sharedAssetsCount} · Leased: {rentedLeasedCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Asset Revenue
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatCurrency(totalAssetRevenue, currency)}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Billed across active work orders
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Asset Profit
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
            {formatCurrency(totalAssetProfit, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Costs: {formatCurrency(totalAssetExpenses, currency, true)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Outstanding Partner Payables
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1 tabular-nums">
            {formatCurrency(totalOutstanding, currency)}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            Awaiting partner distribution
          </div>
        </div>
      </div>

      {/* Top Profitable Assets Widget & Ownership Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Profitable Assets */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Top Income-Generating Assets
              </h3>
              <p className="text-xs text-slate-500">
                Ranked by net operating profitability after all direct and shared costs
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              High Margin Fleet
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {topProfitable.map((ast, idx) => {
              const margin =
                ast.totalRevenue > 0
                  ? Math.round((ast.netProfit / ast.totalRevenue) * 100)
                  : 0;
              return (
                <div
                  key={ast.id}
                  onClick={() => onViewAssetProfitability(ast)}
                  className="p-3.5 rounded-xl border border-slate-200/90 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/30 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-blue-700">{ast.assetNumber}</span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        {margin}% margin
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs mt-1 truncate">
                      {ast.name}
                    </div>
                    <span className="text-[10px] text-slate-500 truncate block mt-0.5">
                      {getOwnershipModelLabel(ast.ownershipModel)}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Net Profit</span>
                      <span className="font-mono font-extrabold text-emerald-700 tabular-nums">
                        {formatCurrency(ast.netProfit, currency)}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ownership Model Distribution */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Ownership & Usage Mix
              </h3>
              <p className="text-xs text-slate-500">Asset distribution across financial structures</p>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Company Owned
                </span>
                <span className="font-mono font-bold text-slate-900">{companyOwnedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Shared Partnership
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {assets.filter((a) => a.ownershipModel === 'shared_partnership').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Company + Partner Share
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {assets.filter((a) => a.ownershipModel === 'company_partner_share').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Rented / Leased
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {assets.filter((a) => a.ownershipModel === 'rented_leased').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Rented with Profit-Sharing
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {assets.filter((a) => a.ownershipModel === 'rented_profit_sharing').length}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Multi-model flexibility across heavy plant, trucks & equipment
          </div>
        </div>
      </div>

      {/* Main Assets Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search unit #, model, plate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center">
              <select
                value={ownershipFilter}
                onChange={(e) => setOwnershipFilter(e.target.value as any)}
                className="bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="all">All Ownership Models</option>
                <option value="company_owned">Company Owned</option>
                <option value="shared_partnership">Shared Ownership / Partnership</option>
                <option value="rented_leased">Rented / Leased</option>
                <option value="company_partner_share">Company + Partner Share</option>
                <option value="rented_profit_sharing">Rented with Profit-Sharing</option>
                <option value="outstanding">With Outstanding Payables</option>
              </select>
            </div>
          </div>

          <button
            onClick={onOpenCreateAsset}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Income Asset</span>
          </button>
        </div>

        {/* Assets Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-slate-500 font-semibold">
                <th className="py-3 px-4">Asset / Truck #</th>
                <th className="py-3 px-4">Ownership Model</th>
                <th className="py-3 px-4">Driver / Operator</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Revenue</th>
                <th className="py-3 px-4 text-right">Expenses (Shared / Direct)</th>
                <th className="py-3 px-4 text-right">Net Profit</th>
                <th className="py-3 px-4 text-right">Outstanding</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.map((asset) => {
                const isContractEnded = asset.status === 'contract_ended';
                const isSettled = asset.status === 'settled';

                return (
                  <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="font-mono text-blue-700">{asset.assetNumber}</span>
                        <span>{asset.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {asset.model} ({asset.year}) · Plate: {asset.registrationPlate}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${getOwnershipModelBadgeStyle(
                          asset.ownershipModel
                        )}`}
                      >
                        {getOwnershipModelLabel(asset.ownershipModel)}
                      </span>
                      {asset.partners.length > 0 && (
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {asset.partners.length} owner{asset.partners.length !== 1 ? 's' : ''} ({asset.partners.map((p) => `${p.ownershipPercentage}%`).join('/')})
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {asset.assignedDriverName || (
                        <span className="text-slate-400 italic">Unassigned (Pool)</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {asset.status === 'active_available' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Available
                        </span>
                      )}
                      {asset.status === 'on_job' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          On Job
                        </span>
                      )}
                      {asset.status === 'maintenance' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          In Shop
                        </span>
                      )}
                      {asset.status === 'contract_ended' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Term Ended
                        </span>
                      )}
                      {asset.status === 'settled' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Settled / Closed
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(asset.totalRevenue, currency)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-rose-700 tabular-nums">
                      <div>-{formatCurrency(asset.totalExpenses, currency)}</div>
                      <div className="text-[10px] text-slate-400">
                        S: {formatCurrency(asset.sharedExpenses, currency, true)} / D: {formatCurrency(asset.directExpenses, currency, true)}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-700 tabular-nums">
                      {formatCurrency(asset.netProfit, currency)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                      {asset.outstandingPayments > 0 ? (
                        <span className="text-amber-700">
                          {formatCurrency(asset.outstandingPayments, currency)}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-medium">$0.00</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewAssetProfitability(asset)}
                          className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="View Profitability Breakdown"
                        >
                          <TrendingUp className="w-3 h-3" />
                          <span>Profitability</span>
                        </button>

                        <button
                          onClick={() => onViewAssetDetail(asset)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="View Specs & Ledger"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Specs</span>
                        </button>

                        <button
                          onClick={() => onOpenAssetSettlement(asset)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1 ${
                            isContractEnded
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              : 'bg-slate-100 hover:bg-amber-50 hover:text-amber-900 text-slate-600'
                          }`}
                          title="Close / Final Settlement"
                        >
                          <Scale className="w-3 h-3" />
                          <span>Settlement</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
