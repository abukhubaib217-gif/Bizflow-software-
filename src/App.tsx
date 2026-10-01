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

import { CustomersView } from './components/views/CustomersView';
import { JobsView } from './components/views/JobsView';
import { InvoicesView } from './components/views/InvoicesView';
import { PaymentsView } from './components/views/PaymentsView';
import { ExpensesView } from './components/views/ExpensesView';
import { EmployeesView } from './components/views/EmployeesView';
import { ServicesView } from './components/views/ServicesView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

import { CreateInvoiceModal } from './components/modals/CreateInvoiceModal';
import { AddExpenseModal } from './components/modals/AddExpenseModal';
import { AddCustomerModal } from './components/modals/AddCustomerModal';
import { CreateJobModal } from './components/modals/CreateJobModal';
import { RecordPaymentModal } from './components/modals/RecordPaymentModal';
import { InvoiceDetailModal } from './components/modals/InvoiceDetailModal';

import { BUSINESS_CONFIGS, DATASETS } from './data/mockData';
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
} from './types';

const CATEGORY_OPTIONS: { id: BusinessCategory; label: string }[] = [
  { id: 'hvac_electrical', label: 'HVAC & Electrical Pros' },
  { id: 'remodeling_contracting', label: 'Remodeling & Builders' },
  { id: 'commercial_landscaping', label: 'Commercial Landscaping' },
  { id: 'auto_fleet', label: 'Auto & Fleet Services' },
  { id: 'digital_agency', label: 'Digital Creative Agency' },
];

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [currentCategory, setCurrentCategory] = useState<BusinessCategory>('hvac_electrical');
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(
    BUSINESS_CONFIGS['hvac_electrical']
  );

  // Core Data State per category
  const initialData = DATASETS['hvac_electrical'];
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

  // Modals state
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
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

          // Keep invoice status separate! If it was approved, it remains approved.
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

    // If modal is open for that invoice, update it too
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
          onOpenAddExpense={() => setIsAddExpenseOpen(true)}
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
          {/* Dashboard View */}
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
                onCreateInvoice={() => setIsCreateInvoiceOpen(true)}
                onAddExpense={() => setIsAddExpenseOpen(true)}
                onAddCustomer={() => setIsAddCustomerOpen(true)}
                onCreateJob={() => setIsCreateJobOpen(true)}
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
              onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            />
          )}

          {/* Section 7: Employees View */}
          {currentSection === 'employees' && (
            <EmployeesView
              employees={employees}
              currency={businessConfig.currency}
              onAddEmployee={(emp) => setEmployees([...employees, emp])}
            />
          )}

          {/* Section 8: Services View */}
          {currentSection === 'services' && (
            <ServicesView
              services={services}
              currency={businessConfig.currency}
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
    </div>
  );
}
