import React, { useState } from 'react';
import { Sidebar, NavSection } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MetricCards } from './components/dashboard/MetricCards';
import { QuickActionsBar } from './components/dashboard/QuickActionsBar';
import { RevenueExpensesChart } from './components/dashboard/RevenueExpensesChart';
import { MonthlyFinancialSummary } from './components/dashboard/MonthlyFinancialSummary';
import { RevenueByService } from './components/dashboard/RevenueByService';
import { RecentInvoices } from './components/dashboard/RecentInvoices';
import { RecentPayments } from './components/dashboard/RecentPayments';
import { RecentExpenses } from './components/dashboard/RecentExpenses';
import { CategorySpecificModule } from './components/dashboard/CategorySpecificModule';

import { CustomersView } from './components/views/CustomersView';
import { JobsView } from './components/views/JobsView';
import { InvoicesView } from './components/views/InvoicesView';
import { PaymentsView } from './components/views/PaymentsView';
import { ExpensesView } from './components/views/ExpensesView';
import { EmployeesView } from './components/views/EmployeesView';
import { ServicesView } from './components/views/ServicesView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { AssetsView } from './components/views/AssetsView';

import { CreateInvoiceModal } from './components/modals/CreateInvoiceModal';
import { AddExpenseModal } from './components/modals/AddExpenseModal';
import { AddCustomerModal } from './components/modals/AddCustomerModal';
import { CreateJobModal } from './components/modals/CreateJobModal';
import { RecordPaymentModal } from './components/modals/RecordPaymentModal';
import { InvoiceDetailModal } from './components/modals/InvoiceDetailModal';

import { CreateAssetModal } from './components/assets/CreateAssetModal';
import { AssetDetailModal } from './components/assets/AssetDetailModal';
import { AssetProfitabilityModal } from './components/assets/AssetProfitabilityModal';
import { AssetSettlementModal } from './components/assets/AssetSettlementModal';
import { AddAssetExpenseModal } from './components/assets/AddAssetExpenseModal';

import { BUSINESS_CONFIGS, DATASETS } from './data/mockData';
import { INITIAL_MANAGED_ASSETS } from './data/mockAssets';
import {
  BusinessCategory,
  BusinessConfig,
  Customer,
  Employee,
  Expense,
  Invoice,
  Job,
  Payment,
  ServiceItem,
  BusinessAsset,
  CommonExpenseCategory,
  ManagedAsset,
  AssetSettlement,
  AssetExpenseRecord,
} from './types';

const CATEGORY_OPTIONS: { id: BusinessCategory; label: string }[] = [
  { id: 'boom_truck_rental', label: 'Boom Truck Rental' },
  { id: 'transport', label: 'Transport' },
  { id: 'crane_rental', label: 'Crane Rental' },
  { id: 'ac_repair', label: 'AC Repair' },
  { id: 'cleaning_services', label: 'Cleaning Services' },
  { id: 'car_rental', label: 'Car Rental' },
  { id: 'construction', label: 'Construction' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'maintenance', label: 'Maintenance' },
];

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [currentCategory, setCurrentCategory] = useState<BusinessCategory>('boom_truck_rental');
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(
    BUSINESS_CONFIGS['boom_truck_rental']
  );

  // Core Data State per category
  const initialData = DATASETS['boom_truck_rental'];
  const [assets, setAssets] = useState<BusinessAsset[]>(initialData.assets);
  const [customers, setCustomers] = useState<Customer[]>(initialData.customers);
  const [employees, setEmployees] = useState<Employee[]>(initialData.employees);
  const [services, setServices] = useState<ServiceItem[]>(initialData.services);
  const [jobs, setJobs] = useState<Job[]>(initialData.jobs);
  const [invoices, setInvoices] = useState<Invoice[]>(initialData.invoices);
  const [payments, setPayments] = useState<Payment[]>(initialData.payments);
  const [expenses, setExpenses] = useState<Expense[]>(initialData.expenses);
  const [monthlyChart, setMonthlyChart] = useState(initialData.monthlyChart);

  // UI state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Managed Assets & Ownership State
  const [managedAssets, setManagedAssets] = useState<ManagedAsset[]>(INITIAL_MANAGED_ASSETS);
  const [isCreateAssetOpen, setIsCreateAssetOpen] = useState(false);
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<ManagedAsset | null>(null);
  const [selectedAssetForProfitability, setSelectedAssetForProfitability] = useState<ManagedAsset | null>(null);
  const [selectedAssetForSettlement, setSelectedAssetForSettlement] = useState<ManagedAsset | null>(null);
  const [selectedAssetForExpense, setSelectedAssetForExpense] = useState<ManagedAsset | null>(null);

  // Modals state
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [initialExpenseCategory, setInitialExpenseCategory] = useState<CommonExpenseCategory>('Fuel');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [paymentTargetInvoiceId, setPaymentTargetInvoiceId] = useState<string | undefined>(
    undefined
  );
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] = useState<Invoice | null>(null);

  // Switch Business Category Presets
  const handleSelectCategory = (category: BusinessCategory) => {
    setCurrentCategory(category);
    setBusinessConfig(BUSINESS_CONFIGS[category]);
    const dataset = DATASETS[category];
    setAssets(dataset.assets);
    setCustomers(dataset.customers);
    setEmployees(dataset.employees);
    setServices(dataset.services);
    setJobs(dataset.jobs);
    setInvoices(dataset.invoices);
    setPayments(dataset.payments);
    setExpenses(dataset.expenses);
    setMonthlyChart(dataset.monthlyChart);
  };

  // Calculations
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const receivedPaymentsTotal = payments.reduce((sum, pay) => sum + pay.amount, 0);
  const pendingPaymentsTotal = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const totalExpensesAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const overdueInvoices = invoices.filter((i) => i.invoiceStatus === 'overdue');
  const overdueAmount = overdueInvoices.reduce((sum, i) => sum + i.balanceDue, 0);
  const activeJobsCount = jobs.filter(
    (j) => j.status === 'scheduled' || j.status === 'in_progress'
  ).length;
  const pendingInvoicesCount = invoices.filter((i) => i.balanceDue > 0).length;

  // Handlers for creating new items
  const handleCreateInvoice = (newInv: Omit<Invoice, 'id'>) => {
    const invoiceId = `inv-${Date.now()}`;
    const invoice: Invoice = { ...newInv, id: invoiceId };
    setInvoices([invoice, ...invoices]);

    // Update customer outstanding balance
    setCustomers(
      customers.map((c) => {
        if (c.id === invoice.customerId) {
          return {
            ...c,
            outstandingBalance: c.outstandingBalance + invoice.balanceDue,
            totalSpent: c.totalSpent + invoice.totalAmount,
          };
        }
        return c;
      })
    );
  };

  const handleAddExpense = (newExp: Omit<Expense, 'id'>) => {
    const expense: Expense = { ...newExp, id: `exp-${Date.now()}` };
    setExpenses([expense, ...expenses]);
  };

  const handleOpenAddExpenseWithCategory = (catName: string) => {
    setInitialExpenseCategory(catName as CommonExpenseCategory);
    setIsAddExpenseOpen(true);
  };

  const handleAddCustomer = (newCust: Omit<Customer, 'id'>) => {
    const customer: Customer = { ...newCust, id: `cust-${Date.now()}` };
    setCustomers([customer, ...customers]);
  };

  const handleCreateJob = (newJob: Omit<Job, 'id'>) => {
    const job: Job = { ...newJob, id: `job-${Date.now()}` };
    setJobs([job, ...jobs]);
  };

  const handleRecordPayment = (newPay: Omit<Payment, 'id'>) => {
    const payment: Payment = { ...newPay, id: `pay-${Date.now()}` };
    setPayments([payment, ...payments]);

    // Update the targeted invoice
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === payment.invoiceId) {
          const newPaid = inv.amountPaid + payment.amount;
          const newBalance = Math.max(0, inv.totalAmount - newPaid);
          const newPaymentStatus = newBalance <= 0 ? 'paid' : 'partial';

          return {
            ...inv,
            amountPaid: newPaid,
            balanceDue: newBalance,
            paymentStatus: newPaymentStatus,
          };
        }
        return inv;
      })
    );

    // Update customer's balance
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === payment.customerId) {
          return {
            ...c,
            outstandingBalance: Math.max(0, c.outstandingBalance - payment.amount),
          };
        }
        return c;
      })
    );

    if (selectedInvoiceForDetail && selectedInvoiceForDetail.id === payment.invoiceId) {
      const newPaid = selectedInvoiceForDetail.amountPaid + payment.amount;
      const newBalance = Math.max(0, selectedInvoiceForDetail.totalAmount - newPaid);
      setSelectedInvoiceForDetail({
        ...selectedInvoiceForDetail,
        amountPaid: newPaid,
        balanceDue: newBalance,
        paymentStatus: newBalance <= 0 ? 'paid' : 'partial',
      });
    }
  };

  const handleUpdateInvoiceStatus = (
    invoiceId: string,
    newStatus: Invoice['invoiceStatus']
  ) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, invoiceStatus: newStatus } : inv))
    );
    if (selectedInvoiceForDetail && selectedInvoiceForDetail.id === invoiceId) {
      setSelectedInvoiceForDetail({
        ...selectedInvoiceForDetail,
        invoiceStatus: newStatus,
      });
    }
  };

  const handleUpdateJobStatus = (jobId: string, status: Job['status']) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status } : j))
    );
  };

  const handleOpenRecordPaymentForInvoice = (invoice: Invoice) => {
    setPaymentTargetInvoiceId(invoice.id);
    setIsRecordPaymentOpen(true);
  };

  const handleAssetAction = (asset: BusinessAsset) => {
    // Quick toggle asset status or show toast
    const newStatus = asset.status === 'available' ? 'rented_on_job' : 'available';
    setAssets(
      assets.map((a) => (a.id === asset.id ? { ...a, status: newStatus } : a))
    );
  };

  // Handlers for Assets & Ownership Management
  const handleCreateAsset = (newAst: Omit<ManagedAsset, 'id'>) => {
    const asset: ManagedAsset = {
      ...newAst,
      id: `asset-${Date.now()}`,
      totalRevenue: 0,
      totalExpenses: 0,
      rentalLeaseCost: newAst.leaseAgreement ? newAst.leaseAgreement.rentalAmount : 0,
      sharedExpenses: 0,
      directExpenses: 0,
      netProfit: 0,
      outstandingPayments: 0,
      expenses: [],
    };
    setManagedAssets([asset, ...managedAssets]);
  };

  const handleOpenAssetDetail = (asset: ManagedAsset) => {
    setSelectedAssetForDetail(asset);
  };

  const handleOpenAssetProfitability = (asset: ManagedAsset) => {
    setSelectedAssetForProfitability(asset);
  };

  const handleOpenAssetSettlement = (asset: ManagedAsset) => {
    setSelectedAssetForSettlement(asset);
  };

  const handleConfirmSettlement = (settlement: AssetSettlement) => {
    setManagedAssets((prev) =>
      prev.map((a) => {
        if (a.id === settlement.assetId) {
          return {
            ...a,
            status: 'settled',
            outstandingPayments: 0,
            settlementHistory: [...(a.settlementHistory || []), settlement],
          };
        }
        return a;
      })
    );
    if (selectedAssetForDetail && selectedAssetForDetail.id === settlement.assetId) {
      setSelectedAssetForDetail((prev) =>
        prev
          ? {
              ...prev,
              status: 'settled',
              outstandingPayments: 0,
              settlementHistory: [...(prev.settlementHistory || []), settlement],
            }
          : null
      );
    }
  };

  const handleOpenAddAssetExpense = (assetId: string) => {
    const target = managedAssets.find((a) => a.id === assetId);
    if (target) {
      setSelectedAssetForExpense(target);
    }
  };

  const handleAddAssetExpense = (
    assetId: string,
    expData: Omit<AssetExpenseRecord, 'id' | 'expenseNumber'>
  ) => {
    const newRecord: AssetExpenseRecord = {
      ...expData,
      id: `aexp-${Date.now()}`,
      expenseNumber: `EXP-A${Math.floor(200 + Math.random() * 800)}`,
    };

    setManagedAssets((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          const updatedExpenses = [newRecord, ...a.expenses];
          const newTotalExpenses = a.totalExpenses + expData.amount;
          const newSharedExpenses =
            expData.allocationType === 'shared'
              ? a.sharedExpenses + expData.amount
              : a.sharedExpenses;
          const newDirectExpenses =
            expData.allocationType === 'direct'
              ? a.directExpenses + expData.amount
              : a.directExpenses;
          const newNetProfit = a.totalRevenue - newTotalExpenses;

          return {
            ...a,
            expenses: updatedExpenses,
            totalExpenses: newTotalExpenses,
            sharedExpenses: newSharedExpenses,
            directExpenses: newDirectExpenses,
            netProfit: newNetProfit,
          };
        }
        return a;
      })
    );

    // Also reflect on global business expenses
    setExpenses((prev) => [
      {
        id: `exp-${Date.now()}`,
        expenseNumber: newRecord.expenseNumber,
        category: expData.category,
        vendor: expData.vendor,
        amount: expData.amount,
        date: expData.date,
        paymentMethod: 'Company Card',
        taxDeductible: true,
        receiptAttached: true,
        description: expData.description,
      },
      ...prev,
    ]);

    if (selectedAssetForDetail && selectedAssetForDetail.id === assetId) {
      const a = selectedAssetForDetail;
      const updatedExpenses = [newRecord, ...a.expenses];
      const newTotalExpenses = a.totalExpenses + expData.amount;
      const newSharedExpenses =
        expData.allocationType === 'shared'
          ? a.sharedExpenses + expData.amount
          : a.sharedExpenses;
      const newDirectExpenses =
        expData.allocationType === 'direct'
          ? a.directExpenses + expData.amount
          : a.directExpenses;
      const newNetProfit = a.totalRevenue - newTotalExpenses;

      setSelectedAssetForDetail({
        ...a,
        expenses: updatedExpenses,
        totalExpenses: newTotalExpenses,
        sharedExpenses: newSharedExpenses,
        directExpenses: newDirectExpenses,
        netProfit: newNetProfit,
      });
    }
  };

  const handleUpdateAssetStatus = (assetId: string, newStatus: ManagedAsset['status']) => {
    setManagedAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, status: newStatus } : a))
    );
    if (selectedAssetForDetail && selectedAssetForDetail.id === assetId) {
      setSelectedAssetForDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar Navigation */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        businessConfig={businessConfig}
        currentCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
        categories={CATEGORY_OPTIONS}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        pendingInvoicesCount={pendingInvoicesCount}
        activeJobsCount={activeJobsCount}
        totalAssetsCount={managedAssets.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Sticky Header */}
        <Header
          currentSection={currentSection}
          businessConfig={businessConfig}
          currentCategory={currentCategory}
          onSelectCategory={handleSelectCategory}
          categories={CATEGORY_OPTIONS}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
          onOpenAddExpense={() => {
            setInitialExpenseCategory('Fuel');
            setIsAddExpenseOpen(true);
          }}
          onOpenAddCustomer={() => setIsAddCustomerOpen(true)}
          onOpenCreateJob={() => setIsCreateJobOpen(true)}
          onOpenRecordPayment={() => {
            setPaymentTargetInvoiceId(undefined);
            setIsRecordPaymentOpen(true);
          }}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Viewport Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Section 1: Dashboard View */}
          {currentSection === 'dashboard' && (
            <div className="space-y-6">
              {/* 4 Financial Key Metrics Cards */}
              <MetricCards
                totalRevenue={totalRevenue}
                receivedPayments={receivedPaymentsTotal}
                pendingPayments={pendingPaymentsTotal}
                totalExpenses={totalExpensesAmount}
                currency={businessConfig.currency}
                overdueAmount={overdueAmount}
                overdueCount={overdueInvoices.length}
                onViewInvoices={() => setCurrentSection('invoices')}
                onViewPayments={() => setCurrentSection('payments')}
                onViewExpenses={() => setCurrentSection('expenses')}
              />

              {/* Quick Actions Bar */}
              <QuickActionsBar
                jobLabel={businessConfig.terminology.jobSingular}
                onCreateInvoice={() => setIsCreateInvoiceOpen(true)}
                onAddExpense={() => {
                  setInitialExpenseCategory('Fuel');
                  setIsAddExpenseOpen(true);
                }}
                onAddCustomer={() => setIsAddCustomerOpen(true)}
                onCreateJob={() => setIsCreateJobOpen(true)}
              />

              {/* Business-Specific Dynamic Module (Adapts per category) */}
              <CategorySpecificModule
                businessConfig={businessConfig}
                assets={assets}
                currency={businessConfig.currency}
                onOpenAddExpenseWithCategory={handleOpenAddExpenseWithCategory}
                onActionClick={handleAssetAction}
              />

              {/* Middle Grid: Revenue vs Expenses Chart & Monthly Financial Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RevenueExpensesChart
                    data={monthlyChart}
                    currency={businessConfig.currency}
                  />
                </div>
                <div className="lg:col-span-1">
                  <MonthlyFinancialSummary
                    totalRevenue={totalRevenue}
                    receivedPayments={receivedPaymentsTotal}
                    pendingPayments={pendingPaymentsTotal}
                    totalExpenses={totalExpensesAmount}
                    currency={businessConfig.currency}
                  />
                </div>
              </div>

              {/* Revenue by Service & Recent Invoices Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <RevenueByService
                    services={services}
                    currency={businessConfig.currency}
                    onViewAllServices={() => setCurrentSection('services')}
                  />
                </div>
                <div className="lg:col-span-2">
                  <RecentInvoices
                    invoices={invoices}
                    currency={businessConfig.currency}
                    onViewInvoice={(inv) => setSelectedInvoiceForDetail(inv)}
                    onRecordPaymentForInvoice={handleOpenRecordPaymentForInvoice}
                    onViewAllInvoices={() => setCurrentSection('invoices')}
                  />
                </div>
              </div>

              {/* Bottom Tables: Recent Payments & Recent Expenses */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentPayments
                  payments={payments}
                  currency={businessConfig.currency}
                  onViewAllPayments={() => setCurrentSection('payments')}
                />
                <RecentExpenses
                  expenses={expenses}
                  currency={businessConfig.currency}
                  onViewAllExpenses={() => setCurrentSection('expenses')}
                />
              </div>
            </div>
          )}

          {/* Section: Assets & Ownership Management View */}
          {currentSection === 'assets' && (
            <AssetsView
              assets={managedAssets}
              currency={businessConfig.currency}
              businessConfig={businessConfig}
              onOpenCreateAsset={() => setIsCreateAssetOpen(true)}
              onViewAssetDetail={handleOpenAssetDetail}
              onViewAssetProfitability={handleOpenAssetProfitability}
              onOpenAssetSettlement={handleOpenAssetSettlement}
              onAddAssetExpense={handleOpenAddAssetExpense}
            />
          )}

          {/* Section 2: Customers View */}
          {currentSection === 'customers' && (
            <CustomersView
              customers={customers}
              invoices={invoices}
              jobs={jobs}
              currency={businessConfig.currency}
              onOpenAddCustomer={() => setIsAddCustomerOpen(true)}
              onSelectCustomerInvoices={(customerId) => {
                setCurrentSection('invoices');
              }}
            />
          )}

          {/* Section 3: Jobs View */}
          {currentSection === 'jobs' && (
            <JobsView
              jobs={jobs}
              currency={businessConfig.currency}
              businessConfig={businessConfig}
              onOpenCreateJob={() => setIsCreateJobOpen(true)}
              onUpdateJobStatus={handleUpdateJobStatus}
            />
          )}

          {/* Section 4: Invoices View */}
          {currentSection === 'invoices' && (
            <InvoicesView
              invoices={invoices}
              currency={businessConfig.currency}
              onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
              onViewInvoice={(inv) => setSelectedInvoiceForDetail(inv)}
              onRecordPayment={handleOpenRecordPaymentForInvoice}
            />
          )}

          {/* Section 5: Payments View */}
          {currentSection === 'payments' && (
            <PaymentsView
              payments={payments}
              currency={businessConfig.currency}
              onOpenRecordPayment={() => {
                setPaymentTargetInvoiceId(undefined);
                setIsRecordPaymentOpen(true);
              }}
            />
          )}

          {/* Section 6: Expenses View */}
          {currentSection === 'expenses' && (
            <ExpensesView
              expenses={expenses}
              currency={businessConfig.currency}
              onOpenAddExpense={() => {
                setInitialExpenseCategory('Fuel');
                setIsAddExpenseOpen(true);
              }}
            />
          )}

          {/* Section 7: Employees View */}
          {currentSection === 'employees' && (
            <EmployeesView
              employees={employees}
              currency={businessConfig.currency}
              businessConfig={businessConfig}
              onAddEmployee={(emp) => setEmployees([...employees, emp])}
            />
          )}

          {/* Section 8: Services View */}
          {currentSection === 'services' && (
            <ServicesView
              services={services}
              currency={businessConfig.currency}
              businessConfig={businessConfig}
              onAddService={(srv) => setServices([...services, srv])}
            />
          )}

          {/* Section 9: Reports View */}
          {currentSection === 'reports' && (
            <ReportsView
              invoices={invoices}
              payments={payments}
              expenses={expenses}
              customers={customers}
              currency={businessConfig.currency}
            />
          )}

          {/* Section 10: Settings View */}
          {currentSection === 'settings' && (
            <SettingsView
              businessConfig={businessConfig}
              currentCategory={currentCategory}
              onSelectCategory={handleSelectCategory}
              categories={CATEGORY_OPTIONS}
              onUpdateConfig={(updated) =>
                setBusinessConfig((prev) => ({ ...prev, ...updated }))
              }
            />
          )}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <CreateInvoiceModal
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        customers={customers}
        currency={businessConfig.currency}
        defaultTaxRate={businessConfig.taxRate}
        onCreateInvoice={handleCreateInvoice}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        currency={businessConfig.currency}
        jobs={jobs}
        initialCategory={initialExpenseCategory}
        onAddExpense={handleAddExpense}
      />

      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onAddCustomer={handleAddCustomer}
      />

      <CreateJobModal
        isOpen={isCreateJobOpen}
        onClose={() => setIsCreateJobOpen(false)}
        customers={customers}
        services={services}
        employees={employees}
        currency={businessConfig.currency}
        businessConfig={businessConfig}
        onCreateJob={handleCreateJob}
      />

      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        invoices={invoices}
        initialInvoiceId={paymentTargetInvoiceId}
        currency={businessConfig.currency}
        onRecordPayment={handleRecordPayment}
      />

      <InvoiceDetailModal
        isOpen={!!selectedInvoiceForDetail}
        onClose={() => setSelectedInvoiceForDetail(null)}
        invoice={selectedInvoiceForDetail}
        businessConfig={businessConfig}
        onRecordPayment={handleOpenRecordPaymentForInvoice}
        onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
      />

      {/* Assets & Ownership Modals */}
      <CreateAssetModal
        isOpen={isCreateAssetOpen}
        onClose={() => setIsCreateAssetOpen(false)}
        employees={employees}
        currency={businessConfig.currency}
        onCreateAsset={handleCreateAsset}
      />

      <AssetDetailModal
        isOpen={!!selectedAssetForDetail}
        onClose={() => setSelectedAssetForDetail(null)}
        asset={selectedAssetForDetail}
        currency={businessConfig.currency}
        onOpenSettlement={(asset) => {
          setSelectedAssetForDetail(null);
          setSelectedAssetForSettlement(asset);
        }}
        onAddAssetExpense={handleOpenAddAssetExpense}
        onUpdateAssetStatus={handleUpdateAssetStatus}
      />

      <AssetProfitabilityModal
        isOpen={!!selectedAssetForProfitability}
        onClose={() => setSelectedAssetForProfitability(null)}
        asset={selectedAssetForProfitability}
        currency={businessConfig.currency}
        onOpenSettlement={(asset) => {
          setSelectedAssetForProfitability(null);
          setSelectedAssetForSettlement(asset);
        }}
      />

      <AssetSettlementModal
        isOpen={!!selectedAssetForSettlement}
        onClose={() => setSelectedAssetForSettlement(null)}
        asset={selectedAssetForSettlement}
        currency={businessConfig.currency}
        onConfirmSettlement={handleConfirmSettlement}
      />

      <AddAssetExpenseModal
        isOpen={!!selectedAssetForExpense}
        onClose={() => setSelectedAssetForExpense(null)}
        asset={selectedAssetForExpense}
        currency={businessConfig.currency}
        onAddExpense={handleAddAssetExpense}
      />
    </div>
  );
}
