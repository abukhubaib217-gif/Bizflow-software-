import React, { useState } from 'react';
import {
  Menu,
  Plus,
  FileText,
  Receipt,
  UserPlus,
  Briefcase,
  DollarSign,
  Bell,
  Search,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { NavSection } from './Sidebar';
import { BusinessCategory, BusinessConfig } from '../../types';

interface HeaderProps {
  currentSection: NavSection;
  businessConfig: BusinessConfig;
  currentCategory: BusinessCategory;
  onSelectCategory: (category: BusinessCategory) => void;
  categories: { id: BusinessCategory; label: string }[];
  onOpenMobileSidebar: () => void;
  onOpenCreateInvoice: () => void;
  onOpenAddExpense: () => void;
  onOpenAddCustomer: () => void;
  onOpenCreateJob: () => void;
  onOpenRecordPayment: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  businessConfig,
  currentCategory,
  onSelectCategory,
  categories,
  onOpenMobileSidebar,
  onOpenCreateInvoice,
  onOpenAddExpense,
  onOpenAddCustomer,
  onOpenCreateJob,
  onOpenRecordPayment,
  searchTerm,
  onSearchChange,
}) => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { terminology } = businessConfig;

  const sectionTitles: Record<NavSection, { title: string; subtitle: string }> = {
    dashboard: {
      title: `${businessConfig.categoryLabel} Dashboard`,
      subtitle: `Real-time revenue, cash collections, ${terminology.jobPlural.toLowerCase()}, and net profit`,
    },
    assets: {
      title: 'Assets & Ownership Management',
      subtitle: 'Trucks, cranes, heavy equipment, multi-partner equity, lease agreements and profit-sharing',
    },
    customers: {
      title: 'Customer & Client Accounts',
      subtitle: 'Manage client directory, contract balances, and billing profiles',
    },
    jobs: {
      title: terminology.jobPlural,
      subtitle: `Track, dispatch, and manage active ${terminology.jobPlural.toLowerCase()} and operational costs`,
    },
    invoices: {
      title: 'Invoices & Billing',
      subtitle: 'Track billed revenue, approval states, and pending customer payments',
    },
    payments: {
      title: 'Received Payments',
      subtitle: 'Cleared bank deposits, credit card settlements, and payment logs',
    },
    expenses: {
      title: 'Operating Expenses',
      subtitle: 'Wages, fuel, maintenance, accommodation, and tax-deductible items',
    },
    employees: {
      title: terminology.employeePlural,
      subtitle: `Manage ${terminology.employeePlural.toLowerCase()}, hourly wage rates, and field assignments`,
    },
    services: {
      title: terminology.servicePlural,
      subtitle: `Catalog of ${terminology.servicePlural.toLowerCase()}, rates, and profit margin targets`,
    },
    reports: {
      title: 'Financial Statements & Reports',
      subtitle: 'Profit & Loss, Cashflow statements, Accounts Receivable aging schedule, and taxes',
    },
    settings: {
      title: 'Business & Category Settings',
      subtitle: 'Switch industry category, configure company details, tax rates, and terms',
    },
  };

  const currentMeta = sectionTitles[currentSection] || {
    title: 'Workspace',
    subtitle: 'Manage your business operations',
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                {currentMeta.title}
              </h1>
              <span className="hidden md:inline-flex items-center text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {businessConfig.categoryLabel}
              </span>
            </div>
            <p className="text-xs text-slate-600 hidden sm:block truncate">
              {currentMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions, Search, Category Selector */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Global Search Bar */}
          <div className="relative hidden xl:block w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${terminology.jobPlural.toLowerCase()}, invoices...`}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Business Category Quick Switcher */}
          <div>
            <select
              value={currentCategory}
              onChange={(e) => onSelectCategory(e.target.value as BusinessCategory)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-colors"
              title="Switch Business Category"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Date Display */}
          <div className="hidden 2xl:flex items-center gap-1.5 text-xs text-slate-600 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Oct 2026 · Q4</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-40">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-900">Notifications</span>
                  <span className="text-[11px] text-blue-600 font-medium">3 unread</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  <div className="py-2">
                    <p className="text-xs font-medium text-slate-800">
                      Payment Received: $3,500.00
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Highline Plaza cleared payment on Invoice #INV-2026-1041
                    </p>
                    <span className="text-[10px] text-slate-400">10 mins ago</span>
                  </div>
                  <div className="py-2">
                    <p className="text-xs font-medium text-slate-800">
                      {terminology.jobSingular} Completed
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Field operator marked job delivered
                    </p>
                    <span className="text-[10px] text-slate-400">2 hours ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">New</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {showQuickActions && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40"
                onClick={() => setShowQuickActions(false)}
              >
                <button
                  onClick={onOpenCreateInvoice}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="font-semibold">Create Invoice</div>
                    <div className="text-[10px] text-slate-400">Bill a client</div>
                  </div>
                </button>

                <button
                  onClick={onOpenRecordPayment}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-600 rounded-lg transition-colors cursor-pointer"
                >
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="font-semibold">Record Payment</div>
                    <div className="text-[10px] text-slate-400">Log cash or wire</div>
                  </div>
                </button>

                <button
                  onClick={onOpenCreateJob}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-600 rounded-lg transition-colors cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  <div>
                    <div className="font-semibold">Create {terminology.jobSingular}</div>
                    <div className="text-[10px] text-slate-400">Dispatch work order</div>
                  </div>
                </button>

                <button
                  onClick={onOpenAddExpense}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                >
                  <Receipt className="w-4 h-4 text-rose-500" />
                  <div>
                    <div className="font-semibold">Add Expense</div>
                    <div className="text-[10px] text-slate-400">Fuel, wages, maintenance</div>
                  </div>
                </button>

                <button
                  onClick={onOpenAddCustomer}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors cursor-pointer border-t border-slate-100 mt-1 pt-1.5"
                >
                  <UserPlus className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="font-semibold">Add Customer</div>
                    <div className="text-[10px] text-slate-400">Create client account</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
