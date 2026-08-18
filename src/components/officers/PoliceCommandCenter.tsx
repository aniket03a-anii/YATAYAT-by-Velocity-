import React, { useState } from 'react';
import { PoliceOfficer, Junction, OfficerStatus, ZoneName } from '../../types';
import {
  Shield,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  Car,
  Navigation,
  Activity,
  Award,
  AlertCircle,
  UserCheck,
  Send,
  Zap,
  Plus,
  Radio,
  Check,
} from 'lucide-react';

interface PoliceCommandCenterProps {
  officers: PoliceOfficer[];
  junctions: Junction[];
  onDeployOfficerToJunction: (officerId: string, junctionId: string) => void;
  onUpdateOfficerStatus: (officerId: string, status: OfficerStatus) => void;
  onFocusJunction?: (junctionId: string) => void;
  onTriggerIncidentSimulation?: () => void;
}

export const PoliceCommandCenter: React.FC<PoliceCommandCenterProps> = ({
  officers,
  junctions,
  onDeployOfficerToJunction,
  onUpdateOfficerStatus,
  onFocusJunction,
  onTriggerIncidentSimulation,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterZone, setFilterZone] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOfficer, setSelectedOfficer] = useState<PoliceOfficer | null>(null);
  const [deployTargetJunctionId, setDeployTargetJunctionId] = useState<string>(
    junctions[0]?.id || ''
  );
  const [simIncidentActive, setSimIncidentActive] = useState<boolean>(false);
  const [simMessage, setSimMessage] = useState<string | null>(null);

  const handleRunIncidentSimulation = () => {
    setSimIncidentActive(true);
    setSimMessage('🚨 CAD PRIORITY-1 ALERT: Multi-vehicle collision reported at Sitabuldi Interchange. Nearest units NTP-060 & NTP-148 auto-dispatched!');
    if (onTriggerIncidentSimulation) {
      onTriggerIncidentSimulation();
    }
    setTimeout(() => {
      setSimMessage(null);
    }, 6000);
  };

  const filteredOfficers = officers.filter((o) => {
    if (filterStatus !== 'ALL' && o.status !== filterStatus) return false;
    if (filterZone !== 'ALL' && o.zone !== filterZone) return false;
    if (
      searchQuery &&
      !o.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !o.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !o.rank.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !o.vehicleType.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const availableCount = officers.filter((o) => o.status === 'AVAILABLE').length;
  const deployedCount = officers.filter((o) => o.status === 'DEPLOYED').length;
  const breakCount = officers.filter((o) => o.status === 'ON_BREAK').length;
  const offDutyCount = officers.filter((o) => o.status === 'OFF_DUTY').length;

  const getStatusBadge = (status: OfficerStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
      case 'DEPLOYED':
        return 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
      case 'ON_BREAK':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'OFF_DUTY':
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div id="police-command-center-panel" className="space-y-5 text-slate-900 animate-fade-in">
      {/* Header matching Screenshot 084550 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-600" />
            Police Field Deployment & Command Console
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Nagpur City Police - Traffic Branch (Zone 1 - 4) • CAD Auto-Dispatch Engine Online
          </p>
        </div>

        {/* Top Right Action Buttons matching Screenshot */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunIncidentSimulation}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Run Incident Simulation</span>
          </button>
          <button
            onClick={() => {
              if (officers.length > 0) setSelectedOfficer(officers[0]);
            }}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Deploy Rapid Unit</span>
          </button>
        </div>
      </div>

      {/* Simulated Incident Toast / Alert Banner if active */}
      {simMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
            <span>{simMessage}</span>
          </div>
          <button
            onClick={() => setSimMessage(null)}
            className="text-rose-700 hover:text-rose-950 font-bold px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Status Metrics Cards matching Screenshot 084550 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
            TOTAL CORPS STRENGTH
          </div>
          <div className="text-xl font-mono font-black text-slate-900">
            38 Officers
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            8 Officers on Active Duty
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-emerald-700 font-mono">
            AVAILABLE PATROL
          </div>
          <div className="text-xl font-mono font-black text-emerald-700">
            22 Units Ready
          </div>
          <div className="text-[11px] text-emerald-800 font-medium">
            6 Rapid Interceptors
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-blue-700 font-mono">
            AVG DISPATCH LATENCY
          </div>
          <div className="text-xl font-mono font-black text-blue-700">
            1.8 min
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            SLA: &lt; 3.0 min
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-amber-700 font-mono">
            ACTIVE SCENE UNITS
          </div>
          <div className="text-xl font-mono font-black text-amber-800">
            6 Dispatched
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Sitabuldi Spine
          </div>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200 text-xs shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Statuses ({officers.length})</option>
              <option value="AVAILABLE">Available ({availableCount})</option>
              <option value="DEPLOYED">Deployed ({deployedCount})</option>
              <option value="ON_BREAK">On Break ({breakCount})</option>
              <option value="OFF_DUTY">Off Duty ({offDutyCount})</option>
            </select>
          </div>

          {/* Zone Select */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Zone:</span>
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Nagpur Zones</option>
              <option value="Central">Central Zone</option>
              <option value="North">North Zone</option>
              <option value="South">South Zone</option>
              <option value="East">East Zone</option>
              <option value="West">West Zone</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search badge, name, vehicle..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {filteredOfficers.map((officer) => {
          const assignedJunction = junctions.find((j) => j.id === officer.assignedJunctionId);

          return (
            <div
              key={officer.id}
              id={`officer-card-${officer.id}`}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 transition-all hover:border-sky-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{officer.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono border ${getStatusBadge(
                        officer.status
                      )}`}
                    >
                      {officer.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-700">
                      Badge: {officer.badgeNumber}
                    </span>
                    <span>•</span>
                    <span>{officer.rank}</span>
                    <span>•</span>
                    <span>{officer.zone} Zone</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-amber-700 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {officer.performanceScore} / 5.0
                  </span>
                </div>
              </div>

              {/* Assignment & Vehicle Details */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-sky-600" /> Vehicle:
                  </span>
                  <span className="text-slate-800 font-medium">
                    {officer.vehicleType} ({officer.vehicleNumber})
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-sky-600" /> Assigned Post:
                  </span>
                  <span className="text-sky-700 font-medium truncate max-w-[180px]">
                    {assignedJunction ? assignedJunction.name : 'Sitabuldi Interchange (Demo Junction A)'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-600" /> Shift / Patrol:
                  </span>
                  <span className="text-slate-700 font-mono">{officer.shiftTiming}</span>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                {/* Status Toggle Dropdown */}
                <select
                  value={officer.status}
                  onChange={(e) =>
                    onUpdateOfficerStatus(officer.id, e.target.value as OfficerStatus)
                  }
                  className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[11px] focus:outline-none"
                >
                  <option value="AVAILABLE">Set Available</option>
                  <option value="DEPLOYED">Set Deployed</option>
                  <option value="ON_BREAK">Set Break</option>
                  <option value="OFF_DUTY">Set Off-Duty</option>
                </select>

                {/* Deploy Button */}
                <button
                  onClick={() => setSelectedOfficer(officer)}
                  className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  CAD Dispatched
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DISPATCH OFFICER MODAL */}
      {selectedOfficer && (
        <div
          id="dispatch-officer-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedOfficer(null)}
        >
          <div
            className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Manual Tactical Dispatch: {selectedOfficer.badgeNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOfficer(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800">
                {selectedOfficer.name} ({selectedOfficer.rank})
              </div>
              <div className="text-slate-500">
                Vehicle: {selectedOfficer.vehicleType} • Current Zone: {selectedOfficer.zone}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-slate-600">
                Select Destination Junction:
              </label>
              <select
                value={deployTargetJunctionId}
                onChange={(e) => setDeployTargetJunctionId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-sky-500"
              >
                {junctions.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.name} ({j.zone} Zone • Risk: {j.riskScore}/100 • {j.hasCoverageGap ? 'GAP' : 'Covered'})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
              <button
                onClick={() => setSelectedOfficer(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeployOfficerToJunction(selectedOfficer.id, deployTargetJunctionId);
                  setSelectedOfficer(null);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold flex items-center gap-1.5 shadow-sm shadow-sky-600/25 hover:from-sky-500 hover:to-blue-500 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                CONFIRM DISPATCH
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
