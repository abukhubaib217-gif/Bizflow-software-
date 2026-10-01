import React, { useState } from 'react';
import { Users, Search, Plus, Phone, Mail, MapPin, Briefcase, DollarSign, ChevronRight, Eye } from 'lucide-react';
import { Customer, Invoice, Job } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Modal } from '../common/Modal';

interface CustomersViewProps {
  customers: Customer[];
  invoices: Invoice[];
  jobs: Job[];
  currency: string;
  onOpenAddCustomer: () => void;
  onSelectCustomerInvoices: (customerId: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  invoices,
  jobs,
  currency,
  onOpenAddCustomer,
  onSelectCustomerInvoices,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'balance' | 'active'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.companyName && c.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'balance') return c.outstandingBalance > 0;
    if (statusFilter === 'active') return c.status === 'active';
    return true;
  });

  const totalReceivables = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);
  const totalLifetimeValue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-5">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Client Accounts
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {customers.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">100% Verified accounts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Outstanding Balance
          </div>
          <div className="text-2xl font-bold text-amber-700 font-mono mt-1 tabular-nums">
            {formatCurrency(totalReceivables, currency)}
          </div>
          <div className="text-xs text-amber-600 mt-1">Awaiting client payment</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Lifetime Customer Value
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1 tabular-nums">
            {formatCurrency(totalLifetimeValue, currency)}
          </div>
          <div className="text-xs text-emerald-600 mt-1">Cumulative settled billings</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Header Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by client or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                All ({customers.length})
              </button>
              <button
                onClick={() => setStatusFilter('balance')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'balance' ? 'bg-white text-amber-700 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                With Balance
              </button>
            </div>
          </div>

          <button
            onClick={onOpenAddCustomer}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-slate-500 font-semibold">
                <th className="py-3 px-4">Client / Company</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Jobs</th>
                <th className="py-3 px-4 text-right">Lifetime Billed</th>
                <th className="py-3 px-4 text-right">Open Balance</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{cust.name}</div>
                    {cust.companyName && (
                      <div className="text-[11px] text-slate-500 font-medium">{cust.companyName}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{cust.email}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{cust.phone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[160px]">{cust.city}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-medium">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {cust.jobsCount}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(cust.totalSpent, currency)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                    {cust.outstandingBalance > 0 ? (
                      <span className="text-amber-700">
                        {formatCurrency(cust.outstandingBalance, currency)}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium">$0.00</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCustomer(null)}
          title={`Client Profile: ${selectedCustomer.name}`}
          subtitle={selectedCustomer.companyName}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Email</span>
                <p className="font-semibold text-slate-800">{selectedCustomer.email}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Phone</span>
                <p className="font-semibold text-slate-800">{selectedCustomer.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Address</span>
                <p className="font-semibold text-slate-800">
                  {selectedCustomer.address}, {selectedCustomer.city}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Member Since</span>
                <p className="font-semibold text-slate-800">{selectedCustomer.joinedDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                <span className="text-[11px] text-blue-700 font-medium">Total Lifetime Spend</span>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                  {formatCurrency(selectedCustomer.totalSpent, currency)}
                </div>
              </div>
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                <span className="text-[11px] text-amber-800 font-medium">Open Balance Due</span>
                <div className="text-lg font-bold font-mono text-amber-700 mt-1">
                  {formatCurrency(selectedCustomer.outstandingBalance, currency)}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-900 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
