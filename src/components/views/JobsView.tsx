import React, { useState } from 'react';
import { Briefcase, Search, Plus, Calendar, User, MapPin, CheckCircle, Clock } from 'lucide-react';
import { Job, JobStatus } from '../../types';
import { formatCurrency, getJobStatusMeta } from '../../utils/formatters';

interface JobsViewProps {
  jobs: Job[];
  currency: string;
  onOpenCreateJob: () => void;
  onUpdateJobStatus: (jobId: string, status: JobStatus) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  currency,
  onOpenCreateJob,
  onUpdateJobStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | JobStatus>('all');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.assignedEmployeeName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return job.status === statusFilter;
  });

  const activeJobs = jobs.filter((j) => j.status === 'in_progress' || j.status === 'scheduled');
  const completedJobs = jobs.filter((j) => j.status === 'completed' || j.status === 'invoiced');
  const totalBudget = jobs.reduce((sum, j) => sum + j.estimatedBudget, 0);

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Work Orders
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{jobs.length}</div>
          <div className="text-xs text-slate-500 mt-1">Dispatched to date</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active / Scheduled
          </div>
          <div className="text-2xl font-bold text-blue-600 font-mono mt-1">
            {activeJobs.length}
          </div>
          <div className="text-xs text-blue-600 mt-1">Field operations in flight</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Completed & Invoiced
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">
            {completedJobs.length}
          </div>
          <div className="text-xs text-emerald-600 mt-1">Successfully delivered</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Work Order Volume
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">
            {formatCurrency(totalBudget, currency)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Estimated contract budget</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search jobs, tech, client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 overflow-x-auto">
              {(['all', 'scheduled', 'in_progress', 'completed', 'invoiced'] as const).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer capitalize whitespace-nowrap ${
                      statusFilter === status
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                )
              )}
            </div>
          </div>

          <button
            onClick={onOpenCreateJob}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Job</span>
          </button>
        </div>

        {/* Jobs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-slate-500 font-semibold">
                <th className="py-3 px-4">Job # & Title</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Assigned Tech</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Est. Budget</th>
                <th className="py-3 px-4 text-right">Actual Cost</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.map((job) => {
                const statusMeta = getJobStatusMeta(job.status);

                return (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span className="font-mono text-blue-700">{job.jobNumber}</span>
                        <span>{job.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[200px]">{job.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{job.customerName}</td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.assignedEmployeeName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{job.scheduledDate}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded border ${statusMeta.className}`}
                      >
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(job.estimatedBudget, currency)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">
                      {formatCurrency(job.actualCost, currency)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {job.status === 'scheduled' && (
                        <button
                          onClick={() => onUpdateJobStatus(job.id, 'in_progress')}
                          className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-medium transition-colors cursor-pointer text-[11px]"
                        >
                          Start Job
                        </button>
                      )}
                      {job.status === 'in_progress' && (
                        <button
                          onClick={() => onUpdateJobStatus(job.id, 'completed')}
                          className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium transition-colors cursor-pointer text-[11px]"
                        >
                          Complete
                        </button>
                      )}
                      {(job.status === 'completed' || job.status === 'invoiced') && (
                        <span className="text-[11px] text-slate-400 font-medium">Delivered</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
