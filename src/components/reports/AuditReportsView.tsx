import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  FileText,
  TrendingDown,
  Clock,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export const AuditReportsView: React.FC = () => {
  const reports = [
    {
      id: 'REP-2026-08',
      title: 'Nagpur Traffic & Accident Audit Report (August 2026)',
      type: 'Executive City Report',
      period: '01 Aug 2026 – 18 Aug 2026',
      highlights: '14.2% reduction in peak-hour gridlock on Wardha Road following AI adaptive signal splits.',
      generatedBy: 'NSSCDCL Traffic Analytics Engine',
      fileSize: '4.8 MB',
    },
    {
      id: 'REP-2026-CAD',
      title: 'Police Rapid Response SLA Compliance Ledger',
      type: 'Police Deployment Audit',
      period: 'Weekly Rolling (Last 7 Days)',
      highlights: 'Average officer ETA lowered from 6.8 min to 3.4 min across all 5 zones.',
      generatedBy: 'Nagpur ICCC CAD Dispatcher',
      fileSize: '2.1 MB',
    },
    {
      id: 'REP-2026-BLACKSPOT',
      title: 'Nagpur 12 Blackspots Remediation & Infrastructure Audit',
      type: 'GIS Safety Assessment',
      period: 'Annual Q3 2026',
      highlights: 'Zero fatalities recorded on Sitabuldi Flyover and Pardi Naka following rumble strips & CCTV.',
      generatedBy: 'MoRTH & NMC Safety Taskforce',
      fileSize: '8.4 MB',
    },
  ];

  return (
    <div id="audit-reports-panel" className="space-y-6 animate-fade-in text-slate-900">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900">
                Official Municipal & Police Audit Reports
              </h2>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold">
                COMPLIANCE ARCHIVE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Export verified traffic safety audits, deployment ledgers, and corridor performance metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                  {rep.id}
                </span>
                <span className="text-[10px] font-mono font-semibold text-blue-600">
                  {rep.type}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900">{rep.title}</h3>

              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{rep.period}</span>
              </div>

              <p className="text-xs text-slate-600 p-2.5 rounded-lg bg-slate-50 border border-slate-100 leading-relaxed">
                {rep.highlights}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">{rep.fileSize} • PDF</span>

              <button
                onClick={() => alert(`Downloading verified audit file: ${rep.title}`)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-blue-600/20 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
