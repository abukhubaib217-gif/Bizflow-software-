export type BusinessCategory =
  | 'boom_truck_rental'
  | 'transport'
  | 'crane_rental'
  | 'ac_repair'
  | 'cleaning_services'
  | 'car_rental'
  | 'construction'
  | 'plumbing'
  | 'electrical'
  | 'maintenance';

export type InvoiceStatus = 'draft' | 'sent' | 'approved' | 'overdue' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';
export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'invoiced' | 'cancelled';

export type CommonExpenseCategory =
  | 'Salary/Wages'
  | 'Overtime'
  | 'Accommodation'
  | 'Food/Meals'
  | 'Communication'
  | 'Transportation'
  | 'Fuel'
  | 'Maintenance'
  | 'Rent'
  | 'Utilities'
  | 'Marketing'
  | 'Insurance'
  | 'Government Fees'
  | 'Other Expenses';

export interface CategoryTerminology {
  jobSingular: string; // e.g. "Rental Job", "Service Call", "Cleaning Job", "Transport Trip"
  jobPlural: string;
  employeeSingular: string; // e.g. "Driver / Operator", "Technician", "Crew Cleaner"
  employeePlural: string;
  serviceSingular: string; // e.g. "Rental Unit / Rate", "Service Code", "Cleaning Package"
  servicePlural: string;
  assetModuleTitle: string; // e.g. "Boom Trucks & Fleet Assets", "Spare Parts & Tools Depot", "Cleaning Teams & Supplies"
  assetModuleType: 'fleet' | 'inventory' | 'crews' | 'construction_plant';
  primaryFocusDescription: string;
  specialExpenses: CommonExpenseCategory[];
}

export interface BusinessAsset {
  id: string;
  name: string;
  identifier: string; // Plate #, SKU, or Team Code
  category: string;
  status: 'available' | 'rented_on_job' | 'maintenance' | 'low_stock';
  metric1Label: string;
  metric1Value: string;
  metric2Label: string;
  metric2Value: string;
  rateOrCost: number;
  lastInspectionOrRestock: string;
}

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
  category: CommonExpenseCategory;
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
  pricingType: 'Fixed Rate' | 'Hourly' | 'Square Footage' | 'Package' | 'Daily Rate' | 'Mileage Rate';
  basePrice: number;
  estimatedDuration: string;
  grossMarginPercent: number;
  revenueThisMonth: number;
  jobsCount: number;
}

export interface MonthlyFinancialPoint {
  month: string;
  revenue: number;
  receivedPayments: number;
  expenses: number;
  netProfit: number;
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
  terminology: CategoryTerminology;
}
