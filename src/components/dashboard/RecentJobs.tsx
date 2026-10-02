import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Job } from '../../types';
import { formatCurrency, getJobStatusMeta } from '../../utils/formatters';

interface RecentJobsProps {
  jobs: Job[];
  currency: string;
  jobLabel: string;
  onViewAllJobs: () => void;
}

export const RecentJobs: React.FC<RecentJobsProps> = ({
  jobs,
  currency,
  jobLabel,
  onViewAllJobs,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Active {jobLabel}
              </h2>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Operations
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live field operations, client dispatches, and work logs
            </p>
          </div>
          <button
            type="button"
            onClick={onViewAllJobs}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Jobs Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="py-2.5 pr-3">Job ID</th>
                <th className="py-2.5 px-3">Title & Service</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 pl-3 text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.slice(0, 5).map((job) => {
                const statusMeta = getJobStatusMeta(job.status);

                return (
                  <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pr-3 font-semibold text-slate-900 font-mono">
                      {job.jobNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 truncate max-w-[150px]">
                        {job.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                        {job.serviceName} · {job.assignedEmployeeName}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-700 truncate max-w-[130px]">
                        {job.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[130px]">
                        {job.location}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {job.scheduledDate}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md border ${statusMeta.className}`}
                      >
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="py-3 pl-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatCurrency(job.estimatedBudget, currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Scheduled field assignments</span>
        <button
          type="button"
          onClick={onViewAllJobs}
          className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
        >
          Manage All {jobLabel}
        </button>
      </div>
    </div>
  );
};
