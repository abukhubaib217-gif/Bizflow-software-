import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { BusinessConfig, Customer, Employee, Job, ServiceItem } from '../../types';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  services: ServiceItem[];
  employees: Employee[];
  currency: string;
  businessConfig: BusinessConfig;
  onCreateJob: (job: Omit<Job, 'id'>) => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  customers,
  services,
  employees,
  currency,
  businessConfig,
  onCreateJob,
}) => {
  const { terminology } = businessConfig;
  const [title, setTitle] = useState('');
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState('2026-10-04');
  const [estimatedBudget, setEstimatedBudget] = useState(
    services[0]?.basePrice ? String(services[0].basePrice) : '1500'
  );
  const [priority, setPriority] = useState<Job['priority']>('medium');
  const [location, setLocation] = useState('');

  const handleServiceChange = (id: string) => {
    setServiceId(id);
    const srv = services.find((s) => s.id === id);
    if (srv) {
      setEstimatedBudget(String(srv.basePrice));
      if (!title) {
        setTitle(`${srv.name}`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === customerId) || customers[0];
    const service = services.find((s) => s.id === serviceId) || services[0];
    const employee = employees.find((e) => e.id === employeeId) || employees[0];

    const newJob: Omit<Job, 'id'> = {
      jobNumber: `JOB-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: title || `${service?.name} for ${customer?.name}`,
      customerId: customer?.id || 'cust-1',
      customerName: customer?.companyName || customer?.name || 'Client',
      serviceId: service?.id || 'srv-1',
      serviceName: service?.name || 'Standard Service',
      assignedEmployeeId: employee?.id || 'emp-1',
      assignedEmployeeName: employee?.name || 'Lead Technician',
      scheduledDate,
      status: 'scheduled',
      estimatedBudget: parseFloat(estimatedBudget) || 1000,
      actualCost: 0,
      priority,
      location: location || customer?.address || 'Site Location',
    };

    onCreateJob(newJob);
    onClose();
    setTitle('');
    setLocation('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Create ${terminology.jobSingular}`}
      subtitle={`Schedule, assign ${terminology.employeePlural.toLowerCase()}, and set budget for ${businessConfig.categoryLabel}.`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">{terminology.jobSingular} Title *</label>
          <input
            type="text"
            placeholder={`e.g. Scheduled ${terminology.jobSingular} Delivery`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Customer / Client *</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName ? `${c.companyName} (${c.name})` : c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{terminology.serviceSingular} *</label>
            <select
              value={serviceId}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Assigned {terminology.employeeSingular}
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Scheduled Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Job['priority'])}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent Callout</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Estimated Budget ({currency})</label>
            <input
              type="number"
              step="50"
              value={estimatedBudget}
              onChange={(e) => setEstimatedBudget(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Site / Job Address</label>
            <input
              type="text"
              placeholder="e.g. 740 S Congress Ave"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs cursor-pointer"
          >
            Dispatch {terminology.jobSingular}
          </button>
        </div>
      </form>
    </Modal>
  );
};
