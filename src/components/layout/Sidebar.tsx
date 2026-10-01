import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  CreditCard,
  Receipt,
  UserCheck,
  Wrench,
  BarChart3,
  Settings,
  ChevronDown,
  Layers,
  X,
} from 'lucide-react';
import { BusinessCategory, BusinessConfig } from '../../types';

export type NavSection =
  | 'dashboard'
  | 'customers'
  | 'jobs'
  | 'invoices'
  | 'payments'
  | 'expenses'
  | 'employees'
  | 'services'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  businessConfig: BusinessConfig;
  currentCategory: BusinessCategory;
  onSelectCategory: (category: BusinessCategory) => void;
  categories: { id: BusinessCategory; label: string }[];
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  pendingInvoicesCount: number;
  activeJobsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  businessConfig,
  currentCategory,
  onSelectCategory,
  categories,
  isOpenMobile,
  onCloseMobile,
  pendingInvoicesCount,
  activeJobsCount,
}) => {
  const [showCategoryMenu, setShowCategoryMenu] = React.useState(false);

  const navItems: {
    id: NavSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeVariant?: 'blue' | 'amber' | 'neutral';
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, badge: activeJobsCount > 0 ? activeJobsCount : undefined, badgeVariant: 'blue' },
    { id: 'invoices', label: 'Invoices', icon: FileText, badge: pendingInvoicesCount > 0 ? `${pendingInvoicesCount} due` : undefined, badgeVariant: 'amber' },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'employees', label: 'Employees', icon: UserCheck },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: NavSection) => {
    onSelectSection(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <span className="text-lg tracking-tight font-black">B</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">BizFlow</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800/60">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">Modern Business Software</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Business Profile & Category Switcher */}
        <div className="px-3 pt-3 pb-2">
          <div className="relative">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="w-full text-left p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between transition-colors group cursor-pointer"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {businessConfig.name}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5 pl-5">
                  {businessConfig.categoryLabel}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-200 shrink-0" />
            </button>

            {/* Dropdown for Business Category */}
            {showCategoryMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-1.5 z-30">
                <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Switch Business Preset
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setShowCategoryMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center justify-between ${
                      currentCategory === cat.id
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-slate-300 hover:bg-slate-700/70 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{cat.label}</span>
                    {currentCategory === cat.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3 py-2 overflow-y-auto space-y-0.5">
          <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : item.badgeVariant === 'amber'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                        : 'bg-slate-800 text-blue-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer / User Account */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-white border border-slate-600">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">Alex Davis</p>
              <p className="text-[11px] text-slate-400 truncate">Owner & Managing Director</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
