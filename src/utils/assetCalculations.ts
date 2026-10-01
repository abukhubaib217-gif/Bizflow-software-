import { AssetPartner, ManagedAsset, OwnershipModel } from '../types';

export function getOwnershipModelLabel(model: OwnershipModel): string {
  switch (model) {
    case 'company_owned':
      return 'Company Owned';
    case 'shared_partnership':
      return 'Shared Ownership / Partnership';
    case 'rented_leased':
      return 'Rented / Leased';
    case 'company_partner_share':
      return 'Company Owned + Partner Share';
    case 'rented_profit_sharing':
      return 'Rented with Profit-Sharing';
    default:
      return model;
  }
}

export function getOwnershipModelBadgeStyle(model: OwnershipModel): string {
  switch (model) {
    case 'company_owned':
      return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'shared_partnership':
      return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'rented_leased':
      return 'text-purple-700 bg-purple-50 border-purple-200';
    case 'company_partner_share':
      return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    case 'rented_profit_sharing':
      return 'text-amber-800 bg-amber-50 border-amber-200';
    default:
      return 'text-slate-700 bg-slate-50 border-slate-200';
  }
}

export function validatePartnerPercentages(partners: AssetPartner[]): {
  isValid: boolean;
  total: number;
  diff: number;
} {
  const activePartners = partners.filter((p) => p.isActive);
  const total = activePartners.reduce((sum, p) => sum + (Number(p.ownershipPercentage) || 0), 0);
  const rounded = Math.round(total * 100) / 100;
  const isValid = Math.abs(rounded - 100) < 0.01;
  return {
    isValid,
    total: rounded,
    diff: Math.round((100 - rounded) * 100) / 100,
  };
}

export interface PartnerCalculatedShare {
  partnerId: string;
  partnerName: string;
  ownershipPercentage: number;
  revenueShareAmount: number;
  expenseShareAmount: number;
  directExpensesIncurred: number;
  netProfitShareAmount: number;
  netPayableAmount: number;
}

export function calculateAssetPartnerShares(asset: ManagedAsset): PartnerCalculatedShare[] {
  const { partners, totalRevenue, sharedExpenses, directExpenses, netProfit, sharingAgreement } = asset;
  if (!partners || partners.length === 0) return [];

  const activePartners = partners.filter((p) => p.isActive);

  // If sharing agreement specifies profit share or custom method
  const useProfitShare = sharingAgreement?.method === 'profit_share' && sharingAgreement.profitSharePercentage;

  return activePartners.map((partner) => {
    const pct = partner.ownershipPercentage / 100;

    // Revenue share proportional to %
    const revShare = Math.round(totalRevenue * pct * 100) / 100;

    // Shared expense proportional to %
    const expShare = Math.round(sharedExpenses * pct * 100) / 100;

    // Direct expense attributed to this partner if any
    const partnerDirectExp = asset.expenses
      .filter((e) => e.allocationType === 'direct' && e.directChargedTo?.includes(partner.name))
      .reduce((sum, e) => sum + e.amount, 0);

    // Calculated net profit share:
    // If profit share percentage is configured differently, use that, otherwise use ownership %
    const effectiveProfitPct = useProfitShare ? (sharingAgreement.profitSharePercentage! / 100) : pct;
    const profitShare = Math.round(netProfit * effectiveProfitPct * 100) / 100;

    // Payable is profit share minus any direct unpaid expenses
    const payable = Math.max(0, profitShare - partnerDirectExp);

    return {
      partnerId: partner.id,
      partnerName: partner.name,
      ownershipPercentage: partner.ownershipPercentage,
      revenueShareAmount: revShare,
      expenseShareAmount: expShare,
      directExpensesIncurred: partnerDirectExp,
      netProfitShareAmount: profitShare,
      netPayableAmount: payable,
    };
  });
}
