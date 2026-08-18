import React, { useState } from 'react';
import {
  FileText,
  Camera,
  AlertOctagon,
  CheckCircle2,
  Filter,
  Download,
  Search,
  ExternalLink,
  Zap,
} from 'lucide-react';

export const ViolationsView: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const violations = [
    {
      id: 'CHALLAN-NGP-8821',
      vehicleNumber: 'MH 31 EV 4409',
      vehicleType: 'Car (Sedan)',
      violationType: 'Speed Violation (82 km/h in 50 km/h Zone)',
      location: 'Wardha Road Elevated Corridor',
      timestamp: 'Today, 01:28 PM',
      cameraSensor: 'ANPR-RADAR-W04',
      fineAmount: '₹2,000',
      status: 'ISSUED',
    },
    {
      id: 'CHALLAN-NGP-8820',
      vehicleNumber: 'MH 31 DX 1290',
      vehicleType: 'Motorcycle',
      violationType: 'Red Light Jump (RLVD)',
      location: 'Sitabuldi Interchange Square',
      timestamp: 'Today, 01:14 PM',
      cameraSensor: 'RLVD-CAM-SIT-01',
      fineAmount: '₹1,000',
      status: 'ISSUED',
    },
    {
      id: 'CHALLAN-NGP-8819',
      vehicleNumber: 'MH 31 BY 9912',
      vehicleType: 'Two Wheeler',
      violationType: 'No Helmet / Triple Riding',
      location: 'Central Avenue (Gandhibagh)',
      timestamp: 'Today, 12:55 PM',
      cameraSensor: 'AI-CV-HELMET-08',
      fineAmount: '₹1,500',
      status: 'PAID',
    },
    {
      id: 'CHALLAN-NGP-8818',
      vehicleNumber: 'MH 40 AA 3122',
      vehicleType: 'Heavy Commercial Truck',
      violationType: 'No Entry Zone Violation (Peak Hours)',
      location: 'Variety Square / Amravati Rd',
      timestamp: 'Today, 12:40 PM',
      cameraSensor: 'ANPR-ENTRY-V02',
      fineAmount: '₹5,000',
      status: 'ISSUED',
    },
    {
      id: 'CHALLAN-NGP-8817',
      vehicleNumber: 'MH 31 CZ 5541',
      vehicleType: 'Auto Rickshaw',
      violationType: 'Zebra Crossing Obstruction & Stop Line Breach',
      location: 'Samvidhan Square (RBI Chowk)',
      timestamp: 'Today, 12:20 PM',
      cameraSensor: 'STOPLINE-CAM-03',
      fineAmount: '₹500',
      status: 'ISSUED',
    },
  ];

  const filtered = violations.filter((v) => {
    const matchesSearch =
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.violationType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div id="violations-panel" className="space-y-6 animate-fade-in text-slate-900">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900">
                AI Automated E-Challan & ANPR Violations
              </h2>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold">
                50 DETECTIONS TODAY
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Real-time optical character recognition, speed radar logs, and evidence photos dispatched to Parivahan portal.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Exporting today\'s 50 ANPR violations into CSV/Parivahan format.')}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-200 cursor-pointer transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Daily Logs</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search license plate, location, violation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Showing <strong>{filtered.length}</strong> of 50 captured cases
        </div>
      </div>

      {/* Violations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-3.5">Challan ID</th>
                <th className="p-3.5">Vehicle Plate</th>
                <th className="p-3.5">Violation Details</th>
                <th className="p-3.5">Location & Camera</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Penalty</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono text-slate-700">{item.id}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-900 border border-slate-200">
                      {item.vehicleNumber}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.vehicleType}</div>
                  </td>
                  <td className="p-3.5 text-slate-900 font-semibold">{item.violationType}</td>
                  <td className="p-3.5">
                    <div className="text-slate-800 font-medium">{item.location}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.cameraSensor}</div>
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono">{item.timestamp}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">{item.fineAmount}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        item.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
