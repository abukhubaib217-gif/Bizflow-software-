import React from 'react';
import {
  Truck,
  Wrench,
  Users,
  ShieldCheck,
  AlertCircle,
  Clock,
  Plus,
  Fuel,
  Bed,
  Utensils,
  PhoneCall,
  DollarSign,
  ChevronRight,
  Package,
} from 'lucide-react';
import { BusinessAsset, BusinessConfig } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CategorySpecificModuleProps {
  businessConfig: BusinessConfig;
  assets: BusinessAsset[];
  currency: string;
  onOpenAddExpenseWithCategory: (categoryName: string) => void;
  onActionClick: (asset: BusinessAsset) => void;
}

export const CategorySpecificModule: React.FC<CategorySpecificModuleProps> = ({
  businessConfig,
  assets,
  currency,
  onOpenAddExpenseWithCategory,
  onActionClick,
}) => {
  const { terminology } = businessConfig;

  const getModuleIcon = () => {
    switch (terminology.assetModuleType) {
      case 'fleet':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'inventory':
        return <Wrench className="w-5 h-5 text-amber-600" />;
      case 'crews':
        return <Users className="w-5 h-5 text-purple-600" />;
      default:
        return <Package className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: BusinessAsset['status']) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Ready / Available
          </span>
        );
      case 'rented_on_job':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 bg-blue-50 rounded-md border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            On Active Job
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 bg-amber-50 rounded-md border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            In Service / Shop
          </span>
        );
      case 'low_stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 bg-rose-50 rounded-md border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Reorder Level Low
          </span>
        );
    }
  };

  const getExpenseIcon = (catName: string) => {
    switch (catName) {
      case 'Fuel':
        return <Fuel className="w-3.5 h-3.5 text-amber-600" />;
      case 'Accommodation':
        return <Bed className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Food/Meals':
        return <Utensils className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Communication':
        return <PhoneCall className="w-3.5 h-3.5 text-sky-600" />;
      case 'Maintenance':
        return <Wrench className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <DollarSign className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            {getModuleIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                {terminology.assetModuleTitle}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                {businessConfig.categoryLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{terminology.primaryFocusDescription}</p>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          <span className="text-slate-900 font-bold">{assets.length}</span> active operational records
        </div>
      </div>

      {/* Domain-specific quick expense hotlinks */}
      <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/70 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Category Expense Drivers ({businessConfig.categoryLabel})
          </span>
          <span className="text-[11px] text-slate-400">Record instant expense</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {terminology.specialExpenses.map((expCat) => (
            <button
              key={expCat}
              type="button"
              onClick={() => onOpenAddExpenseWithCategory(expCat)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 hover:text-blue-700 border border-slate-200 rounded-lg shadow-2xs transition-all cursor-pointer min-h-[32px]"
            >
              {getExpenseIcon(expCat)}
              <span>+ {expCat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Asset Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-medium">
              <th className="py-2.5 pr-3">Item / Unit</th>
              <th className="py-2.5 px-3">Classification</th>
              <th className="py-2.5 px-3">Rate / Metric</th>
              <th className="py-2.5 px-3">Lead / Last Service</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 pl-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 pr-3">
                  <div className="font-bold text-slate-900">{asset.name}</div>
                  <div className="text-[11px] font-mono text-blue-700">{asset.identifier}</div>
                </td>
                <td className="py-3 px-3">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                    {asset.category}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-800">{asset.metric1Value}</div>
                  <div className="text-[10px] text-slate-400">{asset.metric1Label}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-medium text-slate-700">{asset.metric2Value}</div>
                  <div className="text-[10px] text-slate-400">{asset.lastInspectionOrRestock}</div>
                </td>
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  {getStatusBadge(asset.status)}
                </td>
                <td className="py-3 pl-3 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onActionClick(asset)}
                    className="px-3 py-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
