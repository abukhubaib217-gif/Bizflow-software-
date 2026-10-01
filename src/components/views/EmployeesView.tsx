import React, { useState } from 'react';
import { UserCheck, Search, Plus, Phone, Mail, Clock, Briefcase, Award } from 'lucide-react';
import { BusinessConfig, Employee } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Modal } from '../common/Modal';

interface EmployeesViewProps {
  employees: Employee[];
  currency: string;
  businessConfig: BusinessConfig;
  onAddEmployee: (employee: Employee) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  currency,
  businessConfig,
  onAddEmployee,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hourlyRate, setHourlyRate] = useState('50');
  const { terminology } = businessConfig;

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name,
      role,
      email: email || `${name.toLowerCase().replace(' ', '.')}@bizflow.internal`,
      phone: phone || '(555) 000-0000',
      hourlyRate: parseFloat(hourlyRate) || 45,
      assignedJobsCount: 0,
      monthlyHours: 0,
      status: 'active',
      avatarInitials: initials || 'ST',
    };

    onAddEmployee(newEmp);
    setIsAddOpen(false);
    setName('');
    setRole('');
    setEmail('');
    setPhone('');
  };

  const totalMonthlyHours = employees.reduce((sum, e) => sum + e.monthlyHours, 0);
  const totalPayrollEst = employees.reduce((sum, e) => sum + e.monthlyHours * e.hourlyRate, 0);

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active {terminology.employeePlural}
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {employees.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Qualified & deployed personnel</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Monthly Field Hours
          </div>
          <div className="text-2xl font-bold text-blue-600 font-mono mt-1">
            {totalMonthlyHours} hrs
          </div>
          <div className="text-xs text-blue-600 mt-1">Productive {terminology.jobPlural.toLowerCase()} logged</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Monthly Labor Budget
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">
            {formatCurrency(totalPayrollEst, currency)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Direct wages allocation</div>
        </div>
      </div>

      {/* Main Grid / Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${terminology.employeePlural.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add {terminology.employeeSingular}</span>
          </button>
        </div>

        {/* Employees Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-slate-500 font-semibold">
                <th className="py-3 px-4">{terminology.employeeSingular}</th>
                <th className="py-3 px-4">Role & Specialization</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-right">Hourly Wage</th>
                <th className="py-3 px-4 text-center">Active {terminology.jobPlural}</th>
                <th className="py-3 px-4 text-right">Month Hours</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                        {emp.avatarInitials}
                      </div>
                      <div className="font-semibold text-slate-900">{emp.name}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{emp.role}</td>
                  <td className="py-3 px-4 text-slate-600">
                    <div>{emp.email}</div>
                    <div className="text-[11px] text-slate-400">{emp.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(emp.hourlyRate, currency)}/hr
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                      {emp.assignedJobsCount} assigned
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700">
                    {emp.monthlyHours} hrs
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddOpen(false)}
          title={`Add ${terminology.employeeSingular}`}
          subtitle={`Register staff for ${businessConfig.categoryLabel}`}
          maxWidth="md"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Kenneth Cooper"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Role / Job Title *</label>
              <input
                type="text"
                placeholder={`e.g. ${terminology.employeeSingular}`}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="staff@bizflow.internal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hourly Wage Rate ({currency})</label>
                <input
                  type="number"
                  step="1"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs cursor-pointer"
              >
                Save Record
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
