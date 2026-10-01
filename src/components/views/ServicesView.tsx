import React, { useState } from 'react';
import { Wrench, Search, Plus, DollarSign, Clock, Percent, Sparkles } from 'lucide-react';
import { ServiceItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Modal } from '../common/Modal';

interface ServicesViewProps {
  services: ServiceItem[];
  currency: string;
  onAddService: (service: ServiceItem) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  currency,
  onAddService,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('HVAC Systems');
  const [pricingType, setPricingType] = useState<ServiceItem['pricingType']>('Fixed Rate');
  const [basePrice, setBasePrice] = useState('1200');
  const [estimatedDuration, setEstimatedDuration] = useState('1 Day');
  const [grossMarginPercent, setGrossMarginPercent] = useState('45');

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name,
      category,
      pricingType,
      basePrice: parseFloat(basePrice) || 500,
      estimatedDuration,
      grossMarginPercent: parseFloat(grossMarginPercent) || 40,
      revenueThisMonth: 0,
      jobsCount: 0,
    };

    onAddService(newService);
    setIsAddOpen(false);
    setName('');
  };

  const totalCatalogRevenue = services.reduce((sum, s) => sum + s.revenueThisMonth, 0);

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Catalog Offerings
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {services.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Standardized commercial services</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Service Billings (Mtd)
          </div>
          <div className="text-2xl font-bold text-blue-700 font-mono mt-1 tabular-nums">
            {formatCurrency(totalCatalogRevenue, currency)}
          </div>
          <div className="text-xs text-blue-600 mt-1">Direct job earnings</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Average Target Gross Margin
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">
            {Math.round(services.reduce((a, b) => a + b.grossMarginPercent, 0) / (services.length || 1))}%
          </div>
          <div className="text-xs text-emerald-600 mt-1">Pricing profitability threshold</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>

        {/* Services Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-slate-500 font-semibold">
                <th className="py-3 px-4">Service Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pricing Model</th>
                <th className="py-3 px-4 text-right">Base / Standard Price</th>
                <th className="py-3 px-4">Est. Duration</th>
                <th className="py-3 px-4 text-center">Gross Margin</th>
                <th className="py-3 px-4 text-right">Revenue MTD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{srv.name}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-medium">
                      {srv.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{srv.pricingType}</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(srv.basePrice, currency)}
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{srv.estimatedDuration}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-semibold">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {srv.grossMarginPercent}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-blue-700 tabular-nums">
                    {formatCurrency(srv.revenueThisMonth, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Service Modal */}
      {isAddOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddOpen(false)}
          title="Add Catalog Service"
          subtitle="Define standard pricing, estimated timeline, and profit margin target"
          maxWidth="md"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Service Title *</label>
              <input
                type="text"
                placeholder="e.g. 200A Electrical Subpanel Installation"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Electrical / HVAC"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pricing Model</label>
                <select
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value as ServiceItem['pricingType'])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Fixed Rate">Fixed Rate</option>
                  <option value="Hourly">Hourly Rate</option>
                  <option value="Package">Service Package</option>
                  <option value="Square Footage">Square Footage</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Base Price ({currency})</label>
                <input
                  type="number"
                  step="50"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Est. Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 1-2 Days"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gross Margin %</label>
                <input
                  type="number"
                  step="1"
                  value={grossMarginPercent}
                  onChange={(e) => setGrossMarginPercent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs cursor-pointer"
              >
                Add to Catalog
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
