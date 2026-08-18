import React, { useState } from 'react';
import {
  Globe,
  AlertTriangle,
  Send,
  Navigation,
  CheckCircle2,
  MapPin,
  Camera,
  Car,
  Clock,
  Sparkles,
} from 'lucide-react';
import { INITIAL_JUNCTIONS } from '../../data/nagpurData';

export const CitizenPortalView: React.FC = () => {
  const [complaintType, setComplaintType] = useState<string>('Pothole / Road Damage');
  const [junctionName, setJunctionName] = useState<string>('Sitabuldi Interchange Square');
  const [description, setDescription] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setDescription('');
    }, 1000);
  };

  const citizenAlerts = [
    {
      id: 'ALT-01',
      title: 'Waterlogging Advisory: Manish Nagar Underpass (RUB)',
      severity: 'MODERATE',
      time: '15 mins ago',
      advice: 'Slow down. Water drainage pumps active. Divert via Wardha Road flyover.',
    },
    {
      id: 'ALT-02',
      title: 'Road Maintenance Work: Central Avenue near Agrasen Chowk',
      severity: 'INFO',
      time: '1 hour ago',
      advice: 'Single lane operation from 01:00 PM to 04:00 PM.',
    },
  ];

  return (
    <div id="citizen-portal-panel" className="space-y-6 animate-fade-in text-slate-900">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900">
                Nagpur Citizen Mobility & Traffic Grievance Portal
              </h2>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold">
                PUBLIC SERVICES
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Report traffic bottlenecks, signal defects, or request real-time congestion assistance.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Report Grievance Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Report a Traffic Hazard or Grievance
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">DIRECT TO ICCC QUEUE</span>
          </div>

          {isSubmitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-emerald-900">
                Grievance Logged Successfully (Ticket #NMC-2026-9182)
              </h4>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Your report has been forwarded to the Nagpur ICCC Command Room and the Beat Constable of the zone. Thank you for contributing to city safety!
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitGrievance} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Issue / Hazard Category
                </label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option>Pothole / Road Damage</option>
                  <option>Signal Malfunction / Blackout</option>
                  <option>Severe Gridlock / Illegal Parking</option>
                  <option>Fallen Tree / Waterlogging Hazard</option>
                  <option>Stray Animal Hazard</option>
                  <option>Other Traffic Obstruction</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Junction / Landmark Location
                </label>
                <select
                  value={junctionName}
                  onChange={(e) => setJunctionName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  {INITIAL_JUNCTIONS.map((j) => (
                    <option key={j.id} value={j.name}>
                      {j.name} ({j.zone} Zone)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Description & Specific Details
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide approximate lane, direction of travel, or any hazards..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                Submit Grievance to ICCC Command
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Live City Advisories & Route Planner (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-slate-900 uppercase font-mono tracking-wider text-slate-500">
              Live Public Traffic Advisories
            </h4>

            <div className="space-y-2.5">
              {citizenAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900">{alt.title}</span>
                    <span className="text-[10px] text-amber-700 font-mono">{alt.time}</span>
                  </div>
                  <p className="text-[11px] text-amber-800">{alt.advice}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
