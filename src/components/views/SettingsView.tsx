import React, { useState } from 'react';
import { Settings, Building, DollarSign, FileText, Check, Layers, ArrowRight } from 'lucide-react';
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
    <div className="space-y-6 max-w-5xl">
      {/* Category Selection Grid */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Business Category System (10 Industry Models)
              </h3>
              <p className="text-xs text-slate-500">
                BizFlow reconfigures terminology, modules, and workflows to match your selected business domain.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            Current: {businessConfig.categoryLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{cat.label}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-200 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Auto-adapts modules, terminology, and expenses
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-blue-700 font-semibold flex items-center gap-1">
                  <span>{isSelected ? 'Active Model' : 'Switch'}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Model Terminology Inspector */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
            Active Category Dynamic Terminology Mapping:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
            <div>
              <span className="text-slate-400 text-[10px] block">Job / Dispatch Unit:</span>
              <strong className="text-slate-900">{businessConfig.terminology.jobPlural}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Staff / Roster Role:</span>
              <strong className="text-slate-900">{businessConfig.terminology.employeePlural}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Services & Rates:</span>
              <strong className="text-slate-900">{businessConfig.terminology.servicePlural}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Category Asset Module:</span>
              <strong className="text-blue-700">{businessConfig.terminology.assetModuleTitle}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Company Profile & Invoicing Defaults</h3>
            <p className="text-xs text-slate-500">
              Customize trading credentials and financial policies for {businessConfig.name}
            </p>
          </div>
          {savedSuccess && (
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Settings Saved</span>
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
              <label className="block font-semibold text-slate-700 mb-1">Tagline / Mission</label>
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
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
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
            <label className="block font-semibold text-slate-700 mb-1">Business Yard / HQ Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
        </div>

        {/* Financial Defaults */}
        <div className="pt-4 border-t border-slate-100 space-y-4 text-xs">
          <h4 className="font-bold text-slate-800 text-sm">Currency & Invoice Terms</h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Currency</label>
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
              <label className="block font-semibold text-slate-700 mb-1">Sales Tax Rate (%)</label>
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
              <label className="block font-semibold text-slate-700 mb-1">Standard Payment Terms</label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Due Upon Receipt">Due Upon Receipt</option>
                <option value="Net 15 Days">Net 15 Days</option>
                <option value="Net 30 Days">Net 30 Days</option>
                <option value="Net 60 Days">Net 60 Days</option>
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
