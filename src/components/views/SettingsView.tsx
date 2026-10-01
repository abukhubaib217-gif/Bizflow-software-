import React, { useState } from 'react';
import { Settings, Building, DollarSign, FileText, Check, Layers, RefreshCw } from 'lucide-react';
import { BusinessCategory, BusinessConfig } from '../../types';

interface SettingsViewProps {
  businessConfig: BusinessConfig;
  currentCategory: BusinessCategory;
  onSelectCategory: (category: BusinessCategory) => void;
  categories: { id: BusinessCategory; label: string }[];
  onUpdateConfig: (updated: Partial<BusinessConfig>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  businessConfig,
  currentCategory,
  onSelectCategory,
  categories,
  onUpdateConfig,
}) => {
  const [name, setName] = useState(businessConfig.name);
  const [tagline, setTagline] = useState(businessConfig.tagline);
  const [email, setEmail] = useState(businessConfig.email);
  const [phone, setPhone] = useState(businessConfig.phone);
  const [address, setAddress] = useState(businessConfig.address);
  const [currency, setCurrency] = useState(businessConfig.currency);
  const [taxRate, setTaxRate] = useState(String(businessConfig.taxRate));
  const [paymentTerms, setPaymentTerms] = useState(businessConfig.paymentTerms);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      name,
      tagline,
      email,
      phone,
      address,
      currency,
      taxRate: parseFloat(taxRate) || 0,
      paymentTerms,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Category Switching Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Layers className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Industry & Business Domain Model</h3>
            <p className="text-xs text-slate-500">
              Select or switch the operational template for BizFlow
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{cat.label}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-200" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Preset services, jobs, and financial ledger models
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Business Profile & Branding</h3>
            <p className="text-xs text-slate-500">
              Appearances on invoices, receipts, and client statements
            </p>
          </div>
          {savedSuccess && (
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Preferences Saved</span>
            </span>
          )}
        </div>

        {/* Company Info */}
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Trading Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tagline / Subtitle</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Billing Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Support Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Business Physical Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
        </div>

        {/* Financial Preferences */}
        <div className="pt-4 border-t border-slate-100 space-y-4 text-xs">
          <h4 className="font-bold text-slate-800 text-sm">Financial & Invoice Defaults</h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Operational Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="USD">USD ($ United States Dollar)</option>
                <option value="CAD">CAD ($ Canadian Dollar)</option>
                <option value="GBP">GBP (£ British Pound)</option>
                <option value="EUR">EUR (€ Euro)</option>
                <option value="AUD">AUD ($ Australian Dollar)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Sales Tax Rate (%)</label>
              <input
                type="number"
                step="0.05"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Invoice Payment Terms</label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Net 15 Days">Net 15 Days</option>
                <option value="Net 30 Days">Net 30 Days</option>
                <option value="Net 60 Days">Net 60 Days</option>
                <option value="Due Upon Receipt">Due Upon Receipt</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
