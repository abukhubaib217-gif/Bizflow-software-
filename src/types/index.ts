export type BusinessCategory =
  | 'hvac_electrical'
  | 'remodeling_contracting'
  | 'commercial_landscaping'
  | 'auto_fleet'
  | 'digital_agency';

export type InvoiceStatus = 'draft' | 'sent' | 'approved' | 'overdue' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';
export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'invoiced' | 'cancelled';

export interface Customer {
  id: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  totalSpent: number;
  outstandingBalance: number;
  jobsCount: number;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  dueDate: string;
  invoiceStatus: InvoiceStatus;
  paymentStatus: PaymentStatus;
  items: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  jobId?: string;
  jobTitle?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  date: string;
  method: 'Stripe / Credit Card' | 'ACH Bank Wire' | 'Check' | 'Cash';
  reference?: string;
  status: 'completed' | 'processing' | 'refunded';
}

export interface Expense {
  id: string;
  expenseNumber: string;
  category: 'Materials' | 'Subcontractor' | 'Equipment' | 'Fuel & Fleet' | 'Utilities & Tools' | 'Software' | 'Payroll & Labor' | 'Office & Insurance';
  vendor: string;
  amount: number;
  date: string;
  paymentMethod: 'Company Card' | 'Bank Wire' | 'Check' | 'Cash';
  taxDeductible: boolean;
  receiptAttached: boolean;
  description: string;
  jobId?: string;
}

export interface Job {
  id: string;
  jobNumber: string;
  title: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  scheduledDate: string;
  status: JobStatus;
  estimatedBudget: number;
  actualCost: number;
  invoiceId?: string;
  invoiceStatus?: InvoiceStatus;
  paymentStatus?: PaymentStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  hourlyRate: number;
  assignedJobsCount: number;
  monthlyHours: number;
  status: 'active' | 'on_leave';
  avatarInitials: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  pricingType: 'Fixed Rate' | 'Hourly' | 'Square Footage' | 'Package';
  basePrice: number;
  estimatedDuration: string;
  grossMarginPercent: number;
  revenueThisMonth: number;
  jobsCount: number;
}

export interface MonthlyFinancialPoint {
  month: string;
  revenue: number; // Invoiced sales
  receivedPayments: number; // Actual cash collected
  expenses: number; // Cash expenses
  netProfit: number; // receivedPayments - expenses (or sales - expenses)
}

export interface BusinessConfig {
  id: BusinessCategory;
  name: string;
  legalName: string;
  categoryLabel: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  paymentTerms: string;
}
