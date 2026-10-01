import React, { useState } from 'react';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Scale,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { AssetSettlement, ManagedAsset, PartnerSettlementShare } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { calculateAssetPartnerShares, getOwnershipModelLabel } from '../../utils/assetCalculations';

interface AssetSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: ManagedAsset | null;
  currency: string;
  onConfirmSettlement: (settlement: AssetSettlement) => void;
}

export const AssetSettlementModal: React.FC<AssetSettlementModalProps> = ({
  isOpen,
  onClose,
  asset,
  currency,
  onConfirmSettlement,
}) => {
  if (!asset) return null;

  const [settlementReason, setSettlementReason] = useState<AssetSettlement['reason']>(
    asset.status === 'contract_ended' ? 'contract_ended' : 'partnership_dissolved'
  );
  const [settlementNotes, setSettlementNotes] = useState(
    `Final partnership and operational settlement for ${asset.name} (${asset.assetNumber}). All revenues and operating costs reconciled as of October 2026.`
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const calculatedShares = calculateAssetPartnerShares(asset);

  const partnerSettlementShares: PartnerSettlementShare[] = calculatedShares.map((p) => ({
    partnerId: p.partnerId,
    partnerName: p.partnerName,
    percentage: p.ownershipPercentage,
    shareAmount: p.netPayableAmount,
    status: 'pending',
  }));

  const totalPartnerPayable = partnerSettlementShares.reduce((s, p) => s + p.shareAmount, 0);

  const handleExecuteSettlement = () => {
    const settlementRecord: AssetSettlement = {
      id: `set-${Date.now()}`,
      assetId: asset.id,
      assetNumber: asset.assetNumber,
      assetName: asset.name,
      settlementDate: '2026-10-01',
      reason: settlementReason,
      totalRevenue: asset.totalRevenue,
      totalExpenses: asset.totalExpenses,
      netProfitOrLoss: asset.netProfit,
      rentalAmountsPaid: asset.rentalLeaseCost,
      outstandingAmounts: asset.outstandingPayments,
      partnerShares: partnerSettlementShares.map((p) => ({ ...p, status: 'settled' })),
      finalAmountPayableReceivable: totalPartnerPayable,
      status: 'finalized_closed',
      notes: settlementNotes,
    };

    onConfirmSettlement(settlementRecord);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Close / Final Settlement: ${asset.name}`}
      subtitle={`Asset: ${asset.assetNumber} · ${getOwnershipModelLabel(asset.ownershipModel)}`}
      maxWidth="3xl"
    >
      <div className="space-y-6 text-xs text-slate-700">
        {/* Status Callout Banner */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
          <Scale className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-amber-900 text-sm">
              Asset Contract Closeout & Ledger Finalization
            </h4>
            <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
              Closing this asset reconciles all accumulated work order revenues, direct/shared
              maintenance expenses, and final partner profit-sharing distributions. Previous historical
              transactions remain immutable.
            </p>
          </div>
        </div>

        {/* Financial Summary Audit Block */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-sm">Reconciliation Financials</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Audit Complete
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-slate-500 font-medium block">Total Revenue</span>
              <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block tabular-nums">
                {formatCurrency(asset.totalRevenue, currency)}
              </span>
              <span className="text-[10px] text-slate-400">All invoiced work</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Total Expenses</span>
              <span className="text-base font-bold font-mono text-rose-700 mt-0.5 block tabular-nums">
                -{formatCurrency(asset.totalExpenses, currency)}
              </span>
              <span className="text-[10px] text-slate-400">Shared + Direct costs</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Rental/Lease Paid</span>
              <span className="text-base font-bold font-mono text-slate-700 mt-0.5 block tabular-nums">
                {formatCurrency(asset.rentalLeaseCost, currency)}
              </span>
              <span className="text-[10px] text-slate-400">Lessor disbursements</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Net Realized Profit</span>
              <span className="text-base font-bold font-mono text-emerald-700 mt-0.5 block tabular-nums">
                {formatCurrency(asset.netProfit, currency)}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">Net distributable pool</span>
            </div>
          </div>
        </div>

        {/* Partner Final Distribution Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs">
              Final Partner & Owner Payout Allocations
            </span>
            <span className="font-mono font-bold text-xs text-blue-700">
              Total Payable: {formatCurrency(totalPartnerPayable, currency)}
            </span>
          </div>

          {partnerSettlementShares.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-xs">
              This asset is 100% company-owned. All final proceeds accrue directly to company reserves.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/50">
                  <th className="py-2.5 px-3">Partner Name</th>
                  <th className="py-2.5 px-3 text-center">Agreed Share %</th>
                  <th className="py-2.5 px-3 text-right">Calculated Share</th>
                  <th className="py-2.5 pr-3 text-center">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partnerSettlementShares.map((p) => (
                  <tr key={p.partnerId} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-semibold text-slate-900">{p.partnerName}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-blue-700">
                      {p.percentage}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-slate-900 tabular-nums">
                      {formatCurrency(p.shareAmount, currency)}
                    </td>
                    <td className="py-3 pr-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Ready for Wire
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Settlement Reason & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Settlement Trigger Reason *</label>
            <select
              value={settlementReason}
              onChange={(e) => setSettlementReason(e.target.value as AssetSettlement['reason'])}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
            >
              <option value="contract_ended">Contract Term Ended / Lease Expiry</option>
              <option value="partnership_dissolved">Partnership Dissolved / Syndicate Exit</option>
              <option value="asset_sold">Asset Sold / Decommissioned</option>
              <option value="returned_to_owner">Returned to Lessor / Equipment Owner</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Settlement Date</label>
            <input
              type="date"
              defaultValue="2026-10-01"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Reconciliation Notes & Signoff Memo</label>
          <textarea
            rows={2}
            value={settlementNotes}
            onChange={(e) => setSettlementNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Final settlement will lock future work orders and record payout ledger vouchers.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteSettlement}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Settlement Finalized!</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>Execute Final Settlement</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
