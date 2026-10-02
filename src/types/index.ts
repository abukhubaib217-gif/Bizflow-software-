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

// ==========================================
// ASSETS & OWNERSHIP MANAGEMENT TYPES
// ==========================================

export type OwnershipModel =
  | 'company_owned'
  | 'shared_partnership'
  | 'rented_leased'
  | 'company_partner_share'
  | 'rented_profit_sharing';

export type AssetStatus =
  | 'active_available'
  | 'on_job'
  | 'maintenance'
  | 'contract_ended'
  | 'settled';

export interface AssetPartner {
  id: string;
  name: string;
  ownershipPercentage: number; // e.g. 50, 30, 20 (must sum to 100% for shared ownership)
  investmentAmount?: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface LeaseAgreement {
  ownerLessorName: string;
  rentalAmount: number;
  paymentFrequency: 'daily' | 'weekly' | 'monthly' | 'per_job';
  contractStartDate: string;
  contractEndDate: string;
  deposit?: number;
  rentalExpenseYTD: number;
  otherContractCosts?: number;
  status: 'active' | 'pending_renewal' | 'terminated';
}

export interface SharingAgreement {
  method:
    | 'ownership_percent'
    | 'revenue_share'
    | 'expense_share'
    | 'profit_share'
    | 'fixed_rental_amount'
    | 'fixed_payment'
    | 'fixed_plus_share'
    | 'custom';
  ownershipPercentage?: number;
  revenueSharePercentage?: number;
  expenseSharePercentage?: number;
  profitSharePercentage?: number;
  fixedRentalAmount?: number;
  fixedPayment?: number;
  customRulesDescription?: string;
  effectiveFrom: string;
}

export interface AssetExpenseRecord {
  id: string;
  expenseNumber: string;
  category: CommonExpenseCategory;
  vendor: string;
  amount: number;
  date: string;
  allocationType: 'shared' | 'direct';
  directChargedTo?: string; // e.g., "Company Account", "Partner: Marcus Vance", "Lessor"
  description: string;
}

export interface PartnerSettlementShare {
  partnerId: string;
  partnerName: string;
  percentage: number;
  shareAmount: number;
  status: 'pending' | 'settled';
}

export interface AssetSettlement {
  id: string;
  assetId: string;
  assetNumber: string;
  assetName: string;
  settlementDate: string;
  reason: 'asset_sold' | 'contract_ended' | 'partnership_dissolved' | 'returned_to_owner';
  totalRevenue: number;
  totalExpenses: number;
  netProfitOrLoss: number;
  rentalAmountsPaid: number;
  outstandingAmounts: number;
  partnerShares: PartnerSettlementShare[];
  finalAmountPayableReceivable: number;
  status: 'pending_approval' | 'finalized_closed';
  notes?: string;
}

export interface ManagedAsset {
  id: string;
  assetType: string; // e.g. "Boom Truck", "All-Terrain Crane", "Freight Tractor", "Excavator", "Van", "Car"
  name: string;
  assetNumber: string; // e.g. "TRK-104", "CRN-02"
  registrationPlate: string; // e.g. "TX-892-BTR"
  model: string;
  year: number;
  status: AssetStatus;
  assignedDriverId?: string;
  assignedDriverName?: string;
  ownershipModel: OwnershipModel;
  startDate: string;
  endDate?: string;
  notes?: string;
  // Ownership & Sharing specs
  partners: AssetPartner[];
  leaseAgreement?: LeaseAgreement;
  sharingAgreement?: SharingAgreement;
  // Financial metrics
  totalRevenue: number;
  totalExpenses: number;
  rentalLeaseCost: number;
  sharedExpenses: number;
  directExpenses: number;
  netProfit: number;
  outstandingPayments: number;
  // Specific expense items assigned
  expenses: AssetExpenseRecord[];
  // Historical settlements
  settlementHistory?: AssetSettlement[];
}

// ==========================================
// CORE DOMAIN TYPES
// ==========================================

export interface CategoryTerminology {
  jobSingular: string;
  jobPlural: string;
  employeeSingular: string;
  employeePlural: string;
  serviceSingular: string;
  servicePlural: string;
  assetModuleTitle: string;
  assetModuleType: 'fleet' | 'inventory' | 'crews' | 'construction_plant';
  primaryFocusDescription: string;
  specialExpenses: CommonExpenseCategory[];
}

export interface BusinessAsset {
  id: string;
  name: string;
  identifier: string;
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
