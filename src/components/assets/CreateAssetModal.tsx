import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle, CheckCircle2, ShieldCheck, Scale, Info } from 'lucide-react';
import { Modal } from '../common/Modal';
import { AssetPartner, Employee, ManagedAsset, OwnershipModel } from '../../types';
import { validatePartnerPercentages } from '../../utils/assetCalculations';

interface CreateAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  currency: string;
  onCreateAsset: (asset: Omit<ManagedAsset, 'id'>) => void;
}

export const CreateAssetModal: React.FC<CreateAssetModalProps> = ({
  isOpen,
  onClose,
  employees,
  currency,
  onCreateAsset,
}) => {
  const [assetType, setAssetType] = useState('Boom Truck');
  const [name, setName] = useState('');
  const [assetNumber, setAssetNumber] = useState('');
  const [registrationPlate, setRegistrationPlate] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2024');
  const [status, setStatus] = useState<ManagedAsset['status']>('active_available');
  const [assignedDriverId, setAssignedDriverId] = useState('');
  const [ownershipModel, setOwnershipModel] = useState<OwnershipModel>('company_owned');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  // Shared Partners State
  const [partners, setPartners] = useState<AssetPartner[]>([
    {
      id: 'p-new-1',
      name: 'Owner A (Primary Partner)',
      ownershipPercentage: 50,
      investmentAmount: 50000,
      startDate: '2026-10-01',
      isActive: true,
    },
    {
      id: 'p-new-2',
      name: 'Owner B (Secondary Partner)',
      ownershipPercentage: 50,
      investmentAmount: 50000,
      startDate: '2026-10-01',
      isActive: true,
    },
  ]);

  // Rented / Leased State
  const [ownerLessorName, setOwnerLessorName] = useState('');
  const [rentalAmount, setRentalAmount] = useState('2500');
  const [paymentFrequency, setPaymentFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'per_job'>('monthly');
  const [deposit, setDeposit] = useState('5000');
  const [leaseStartDate, setLeaseStartDate] = useState('2026-10-01');
  const [leaseEndDate, setLeaseEndDate] = useState('2027-10-01');

  // Profit Sharing Config
  const [sharingMethod, setSharingMethod] = useState<'ownership_percent' | 'revenue_share' | 'expense_share' | 'profit_share' | 'fixed_plus_share' | 'custom'>('profit_share');
  const [revenueSharePercent, setRevenueSharePercent] = useState('70');
  const [expenseSharePercent, setExpenseSharePercent] = useState('50');
  const [profitSharePercent, setProfitSharePercent] = useState('40');
  const [fixedRentalAmount, setFixedRentalAmount] = useState('2000');
  const [customRules, setCustomRules] = useState('');

  const isSharedOrPartner =
    ownershipModel === 'shared_partnership' ||
    ownershipModel === 'company_partner_share';

  const isRentedOrLeased =
    ownershipModel === 'rented_leased' ||
    ownershipModel === 'rented_profit_sharing';

  const partnerValidation = validatePartnerPercentages(partners);

  const handleAddPartner = () => {
    const nextShare = Math.max(0, partnerValidation.diff);
    setPartners([
      ...partners,
      {
        id: `p-new-${Date.now()}`,
        name: `Partner ${partners.length + 1}`,
        ownershipPercentage: nextShare,
        investmentAmount: 0,
        startDate: '2026-10-01',
        isActive: true,
      },
    ]);
  };

  const handlePartnerChange = (index: number, field: keyof AssetPartner, value: any) => {
    const updated = [...partners];
    updated[index] = { ...updated[index], [field]: value };
    setPartners(updated);
  };

  const handleRemovePartner = (index: number) => {
    if (partners.length > 1) {
      setPartners(partners.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check shared partner percentage validity
    if (isSharedOrPartner && !partnerValidation.isValid) {
      return;
    }

    const assignedDriver = employees.find((emp) => emp.id === assignedDriverId);

    const newAsset: Omit<ManagedAsset, 'id'> = {
      assetType,
      name: name || `${year} ${model || assetType}`,
      assetNumber: assetNumber || `AST-${Math.floor(100 + Math.random() * 900)}`,
      registrationPlate: registrationPlate || 'UNREGISTERED',
      model: model || assetType,
      year: parseInt(year) || 2024,
      status,
      assignedDriverId: assignedDriver?.id,
      assignedDriverName: assignedDriver?.name,
      ownershipModel,
      startDate,
      endDate: endDate || undefined,
      notes,
      partners: isSharedOrPartner
        ? partners
        : ownershipModel === 'company_owned'
        ? [
            {
              id: 'p-comp-sole',
              name: 'Company Owned (100%)',
              ownershipPercentage: 100,
              startDate,
              isActive: true,
            },
          ]
        : isRentedOrLeased && ownershipModel === 'rented_profit_sharing'
        ? [
            {
              id: 'p-lessor',
              name: ownerLessorName || 'Equipment Lessor',
              ownershipPercentage: parseFloat(profitSharePercent) || 40,
              startDate: leaseStartDate,
              isActive: true,
            },
            {
              id: 'p-business',
              name: 'Company Operating Share',
              ownershipPercentage: 100 - (parseFloat(profitSharePercent) || 40),
              startDate: leaseStartDate,
              isActive: true,
            },
          ]
        : [],
      leaseAgreement: isRentedOrLeased
        ? {
            ownerLessorName: ownerLessorName || 'Commercial Lessor',
            rentalAmount: parseFloat(rentalAmount) || 0,
            paymentFrequency,
            contractStartDate: leaseStartDate,
            contractEndDate: leaseEndDate,
            deposit: parseFloat(deposit) || 0,
            rentalExpenseYTD: parseFloat(rentalAmount) || 0,
            status: 'active',
          }
        : undefined,
      sharingAgreement: {
        method: sharingMethod,
        ownershipPercentage: isSharedOrPartner ? 100 : undefined,
        revenueSharePercentage: parseFloat(revenueSharePercent) || undefined,
        expenseSharePercentage: parseFloat(expenseSharePercent) || undefined,
        profitSharePercentage: parseFloat(profitSharePercent) || undefined,
        fixedRentalAmount: parseFloat(fixedRentalAmount) || undefined,
        customRulesDescription: customRules || undefined,
        effectiveFrom: startDate,
      },
      totalRevenue: 0,
      totalExpenses: 0,
      rentalLeaseCost: isRentedOrLeased ? parseFloat(rentalAmount) || 0 : 0,
      sharedExpenses: 0,
      directExpenses: 0,
      netProfit: 0,
      outstandingPayments: 0,
      expenses: [],
    };

    onCreateAsset(newAsset);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Income-Generating Asset"
      subtitle="Register vehicle, heavy plant, machinery or equipment with multi-ownership models."
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs text-slate-700">
        {/* Basic Identification */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Asset Category / Type *</label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            >
              <option value="Boom Truck">Boom Truck / Aerial Lift</option>
              <option value="Mobile Crane">Mobile / All-Terrain Crane</option>
              <option value="Semi-Truck">Semi-Truck / Tractor Trailer</option>
              <option value="Bucket Truck">Utility Bucket Truck</option>
              <option value="Heavy Machinery">Excavator / Heavy Plant</option>
              <option value="Cargo Van">Commercial Cargo Van</option>
              <option value="Fleet Sedan/SUV">Rental Sedan / SUV</option>
              <option value="Industrial Equipment">Compressor / Generator / Tool Unit</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Asset Name / Title *</label>
            <input
              type="text"
              placeholder="e.g. 85ft Elliott HiReach Telescopic Boom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Asset / Truck Unit # *</label>
            <input
              type="text"
              placeholder="e.g. TRK-881 or CRN-04"
              value={assetNumber}
              onChange={(e) => setAssetNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
        </div>

        {/* Model, Year, Plate, Driver */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Model & Spec</label>
            <input
              type="text"
              placeholder="e.g. Elliott L60R"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Manufacturing Year</label>
            <input
              type="number"
              min="1990"
              max="2030"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Registration / Plate #</label>
            <input
              type="text"
              placeholder="e.g. TX-892-BTR"
              value={registrationPlate}
              onChange={(e) => setRegistrationPlate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assigned Driver / Tech</label>
            <select
              value={assignedDriverId}
              onChange={(e) => setAssignedDriverId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Unassigned / Pool Asset</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ownership / Usage Model Selector */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div>
            <label className="block font-bold text-slate-900 text-xs mb-1">
              Select Ownership / Usage Model *
            </label>
            <select
              value={ownershipModel}
              onChange={(e) => setOwnershipModel(e.target.value as OwnershipModel)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="company_owned">1. Company Owned (100% Sole Business Ownership)</option>
              <option value="shared_partnership">2. Shared Ownership / Partnership (Multiple Partners)</option>
              <option value="rented_leased">3. Rented / Leased (External Owner or Lessor)</option>
              <option value="company_partner_share">4. Company Owned + Partner Share (Equity Split)</option>
              <option value="rented_profit_sharing">5. Rented Asset with Profit-Sharing Arrangement</option>
            </select>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>
              {ownershipModel === 'company_owned' &&
                'All revenues and operating costs flow 100% to the company balance sheet.'}
              {ownershipModel === 'shared_partnership' &&
                'Ownership is divided between 2 or more partners. Total equity MUST equal 100%.'}
              {ownershipModel === 'rented_leased' &&
                'Asset is leased for a fixed periodic rental cost without partner profit splits.'}
              {ownershipModel === 'company_partner_share' &&
                'Company maintains controlling equity with one or more external equity partners.'}
              {ownershipModel === 'rented_profit_sharing' &&
                'Hybrid model: Owner/Lessor receives rental/lease amount plus a contractual share of net operating profit.'}
            </span>
          </div>
        </div>

        {/* Conditional Section 1: Multi-Owner / Partner Builder (with 100% Total Validation) */}
        {isSharedOrPartner && (
          <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs">
                  Partner / Shareholder Equity Distribution
                </span>
                <p className="text-[11px] text-slate-500">
                  Total partner percentages must add up to exactly 100.0%.
                </p>
              </div>

              {/* 100% Validation Pill */}
              <div
                className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${
                  partnerValidation.isValid
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}
              >
                {partnerValidation.isValid ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Total: 100.0% (Valid)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>
                      Total: {partnerValidation.total}% ({partnerValidation.diff > 0 ? `+${partnerValidation.diff}% remaining` : `${Math.abs(partnerValidation.diff)}% over`})
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {partners.map((partner, idx) => (
                <div
                  key={partner.id}
                  className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200/80"
                >
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Partner Name or Entity"
                      value={partner.name}
                      onChange={(e) => handlePartnerChange(idx, 'name', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold"
                      required
                    />
                  </div>

                  <div className="col-span-3">
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        placeholder="Share %"
                        value={partner.ownershipPercentage}
                        onChange={(e) =>
                          handlePartnerChange(idx, 'ownershipPercentage', parseFloat(e.target.value) || 0)
                        }
                        className="w-full bg-white border border-slate-200 rounded-l px-2 py-1 text-xs text-right font-mono font-bold"
                        required
                      />
                      <span className="bg-slate-200 px-2 py-1 text-xs font-bold rounded-r border border-l-0 border-slate-200">
                        %
                      </span>
                    </div>
                  </div>

                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="Capital Inv. ($)"
                      value={partner.investmentAmount || ''}
                      onChange={(e) =>
                        handlePartnerChange(idx, 'investmentAmount', parseFloat(e.target.value) || 0)
                      }
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-right font-mono"
                    />
                  </div>

                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemovePartner(idx)}
                      disabled={partners.length <= 1}
                      className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-1">
              <button
                type="button"
                onClick={handleAddPartner}
                className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Partner / Shareholder</span>
              </button>
              {!partnerValidation.isValid && (
                <span className="text-[11px] text-rose-600 font-medium">
                  Please balance partner percentages to equal 100% before saving.
                </span>
              )}
            </div>
          </div>
        )}

        {/* Conditional Section 2: Rented / Leased Agreement Details */}
        {isRentedOrLeased && (
          <div className="p-4 bg-white rounded-xl border border-purple-200 shadow-2xs space-y-3">
            <span className="font-bold text-slate-900 text-xs block">
              Lessor & Rental Agreement Terms
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Owner / Lessor Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Penske Leasing, Heavy Rigging Syndicate"
                  value={ownerLessorName}
                  onChange={(e) => setOwnerLessorName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rental / Lease Amount ({currency})</label>
                <input
                  type="number"
                  step="50"
                  value={rentalAmount}
                  onChange={(e) => setRentalAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-right font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Frequency</label>
                <select
                  value={paymentFrequency}
                  onChange={(e) => setPaymentFrequency(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                >
                  <option value="monthly">Monthly Recurring</option>
                  <option value="weekly">Weekly Recurring</option>
                  <option value="daily">Daily Rental Rate</option>
                  <option value="per_job">Per Job / Work Order</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Security Deposit ({currency})</label>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-right"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lease Start Date</label>
                <input
                  type="date"
                  value={leaseStartDate}
                  onChange={(e) => setLeaseStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lease End Date</label>
                <input
                  type="date"
                  value={leaseEndDate}
                  onChange={(e) => setLeaseEndDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Conditional Section 3: Profit-Sharing Configuration */}
        {ownershipModel === 'rented_profit_sharing' && (
          <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-3">
            <span className="font-bold text-slate-900 text-xs block">
              Profit / Revenue Sharing Arrangement Settings
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Calculation Method</label>
                <select
                  value={sharingMethod}
                  onChange={(e) => setSharingMethod(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                >
                  <option value="profit_share">Net Profit Share %</option>
                  <option value="revenue_share">Gross Revenue Share %</option>
                  <option value="fixed_plus_share">Fixed Rental + Profit Share</option>
                  <option value="custom">Custom Formula Agreement</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Owner / Lessor Profit Share %
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={profitSharePercent}
                    onChange={(e) => setProfitSharePercent(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-l px-2.5 py-1.5 text-xs text-right font-mono font-bold"
                  />
                  <span className="bg-slate-200 px-2.5 py-1.5 text-xs font-bold rounded-r border border-l-0 border-slate-200">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Operating Share %</label>
                <div className="px-2.5 py-1.5 bg-slate-100 rounded-lg text-xs font-bold font-mono text-slate-800">
                  {100 - (parseFloat(profitSharePercent) || 0)}%
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Custom Agreement Memo</label>
              <input
                type="text"
                placeholder="e.g. Owner receives $2,500 base lease plus 40% net monthly profit after diesel and maintenance"
                value={customRules}
                onChange={(e) => setCustomRules(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
              />
            </div>
          </div>
        )}

        {/* Start / End Dates & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Asset Operational Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
            >
              <option value="active_available">Active & Available in Yard</option>
              <option value="on_job">On Active Job / Dispatched</option>
              <option value="maintenance">Under Maintenance / Inspection</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Operational Notes & Equipment Specs</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Technical capacity, boom reach, tire specs, special operating constraints..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
          />
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Ownership models can be updated with preserved historical ledger audit trails.
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSharedOrPartner && !partnerValidation.isValid}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium shadow-xs cursor-pointer"
            >
              Register Asset
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
