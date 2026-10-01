import { InvoiceStatus, JobStatus, PaymentStatus } from '../types';

export function formatCurrency(amount: number, currency: string = 'USD', compact = false): string {
  if (compact && Math.abs(amount) >= 1000) {
    const formatted = (amount / 1000).toFixed(1);
    return `$${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}k`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function getInvoiceStatusMeta(status: InvoiceStatus): { label: string; className: string } {
  switch (status) {
    case 'draft':
      return { label: 'Draft', className: 'text-slate-600 bg-slate-100 border-slate-200' };
    case 'sent':
      return { label: 'Sent', className: 'text-blue-700 bg-blue-50 border-blue-200' };
    case 'approved':
      return { label: 'Approved', className: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    case 'overdue':
      return { label: 'Overdue', className: 'text-rose-700 bg-rose-50 border-rose-200' };
    case 'cancelled':
      return { label: 'Cancelled', className: 'text-zinc-600 bg-zinc-100 border-zinc-200' };
    default:
      return { label: status, className: 'text-slate-600 bg-slate-100 border-slate-200' };
  }
}

export function getPaymentStatusMeta(status: PaymentStatus): { label: string; className: string } {
  switch (status) {
    case 'paid':
      return { label: 'Paid', className: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    case 'partial':
      return { label: 'Partially Paid', className: 'text-amber-700 bg-amber-50 border-amber-200' };
    case 'unpaid':
      return { label: 'Unpaid', className: 'text-rose-700 bg-rose-50 border-rose-200' };
    default:
      return { label: status, className: 'text-slate-600 bg-slate-100 border-slate-200' };
  }
}

export function getJobStatusMeta(status: JobStatus): { label: string; className: string } {
  switch (status) {
    case 'scheduled':
      return { label: 'Scheduled', className: 'text-blue-700 bg-blue-50 border-blue-200' };
    case 'in_progress':
      return { label: 'In Progress', className: 'text-amber-700 bg-amber-50 border-amber-200' };
    case 'completed':
      return { label: 'Completed', className: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    case 'invoiced':
      return { label: 'Invoiced', className: 'text-purple-700 bg-purple-50 border-purple-200' };
    case 'cancelled':
      return { label: 'Cancelled', className: 'text-zinc-600 bg-zinc-100 border-zinc-200' };
    default:
      return { label: status, className: 'text-slate-600 bg-slate-100 border-slate-200' };
  }
}
