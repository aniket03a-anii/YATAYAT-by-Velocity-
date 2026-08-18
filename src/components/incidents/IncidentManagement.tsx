import React, { useState } from 'react';
import {
  Incident,
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
  Junction,
  PoliceOfficer,
} from '../../types';
import {
  AlertTriangle,
  Plus,
  CheckCircle,
  Clock,
  Shield,
  MapPin,
  Camera,
  Activity,
  Filter,
  Search,
  Check,
  UserPlus,
  FileCheck,
} from 'lucide-react';

interface IncidentManagementProps {
  incidents: Incident[];
  junctions: Junction[];
  officers: PoliceOfficer[];
  onAcknowledgeIncident: (incidentId: string) => void;
  onAssignOfficer: (incidentId: string, officerId: string) => void;
  onResolveIncident: (incidentId: string) => void;
  onCreateIncident: (incident: Omit<Incident, 'id' | 'timestamp' | 'timeAgo'>) => void;
  onFocusJunction?: (junctionId: string) => void;
}

export const IncidentManagement: React.FC<IncidentManagementProps> = ({
  incidents,
  junctions,
  officers,
  onAcknowledgeIncident,
  onAssignOfficer,
  onResolveIncident,
  onCreateIncident,
  onFocusJunction,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Form State
  const [newType, setNewType] = useState<IncidentType>('Accident');
  const [newJunctionId, setNewJunctionId] = useState<string>(junctions[0]?.id || '');
  const [newSeverity, setNewSeverity] = useState<IncidentSeverity>('HIGH');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newMethod, setNewMethod] = useState<Incident['detectionMethod']>('Manual Citizen Report');

  const filteredIncidents = incidents.filter((inc) => {
    if (filterStatus !== 'ALL' && inc.status !== filterStatus) return false;
    if (filterSeverity !== 'ALL' && inc.severity !== filterSeverity) return false;
    if (
      searchQuery &&
      !inc.junctionName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !inc.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !inc.type.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetJunction = junctions.find((j) => j.id === newJunctionId) || junctions[0];

    onCreateIncident({
      junctionId: targetJunction.id,
      junctionName: targetJunction.name,
      type: newType,
      severity: newSeverity,
      status: 'OPEN',
      detectionMethod: newMethod,
      description:
        newDescription ||
        `Reported ${newType} near ${targetJunction.name}. Flow disturbance and safety risk.`,
      lat: targetJunction.lat,
      lng: targetJunction.lng,
      mapX: targetJunction.mapX,
      mapY: targetJunction.mapY,
      assignedOfficerIds: [],
      estimatedResolutionMinutes: newSeverity === 'CRITICAL' ? 30 : 20,
      reportedBy: newMethod,
    });

    setNewDescription('');
    setIsReportModalOpen(false);
  };

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200 font-bold';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200 font-semibold';
      case 'LOW':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 font-medium';
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'OPEN':
        return 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse';
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div id="incident-management-panel" className="space-y-5 text-slate-900">
      {/* Header & Report Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Live Traffic Incident Management
          </h2>
          <p className="text-xs text-slate-500">
            Real-time incident detection, rapid officer dispatch, and scene resolution tracking.
          </p>
        </div>

        <button
          id="open-report-incident-modal-btn"
          onClick={() => setIsReportModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-red-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          REPORT NEW INCIDENT
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200 text-xs shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Statuses ({incidents.length})</option>
              <option value="OPEN">
                Open ({incidents.filter((i) => i.status === 'OPEN').length})
              </option>
              <option value="IN_PROGRESS">
                In Progress ({incidents.filter((i) => i.status === 'IN_PROGRESS').length})
              </option>
              <option value="RESOLVED">
                Resolved ({incidents.filter((i) => i.status === 'RESOLVED').length})
              </option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
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
            placeholder="Search incident, location..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Incidents Table / Cards Feed */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="p-8 rounded-xl bg-white border border-slate-200 text-center space-y-2 shadow-xs">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="font-semibold text-sm text-slate-800">No matching incidents found</p>
            <p className="text-xs text-slate-500">All traffic corridors are running smoothly.</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const assignedOfficerList = officers.filter((o) =>
              incident.assignedOfficerIds.includes(o.id)
            );
            const availableOfficersForAssign = officers.filter(
              (o) => o.status === 'AVAILABLE'
            );

            return (
              <div
                key={incident.id}
                id={`incident-card-${incident.id}`}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 transition-all hover:border-slate-300"
              >
                {/* Top Row: Type, Severity, Status, Time */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {incident.type} • {incident.junctionName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono border ${getSeverityBadge(
                          incident.severity
                        )}`}
                      >
                        {incident.severity}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono border ${getStatusBadge(
                          incident.status
                        )}`}
                      >
                        {incident.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span className="font-mono">{incident.id}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-600" />
                        {incident.timestamp} ({incident.timeAgo})
                      </span>
                      <span>•</span>
                      <span className="text-sky-700 font-medium">
                        Detected via: {incident.detectionMethod}
                      </span>
                    </div>
                  </div>

                  {onFocusJunction && (
                    <button
                      onClick={() => onFocusJunction(incident.junctionId)}
                      className="px-2.5 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-sky-700 border border-slate-200 flex items-center gap-1 font-medium"
                    >
                      <MapPin className="w-3 h-3" /> Focus on Map
                    </button>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {incident.description}
                </p>

                {/* Bottom Row: Assigned Officers & Lifecycle Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                  {/* Assigned Officer Status */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-sky-600" /> Assigned Units:
                    </span>
                    {assignedOfficerList.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {assignedOfficerList.map((o) => (
                          <span
                            key={o.id}
                            className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-mono text-[11px]"
                          >
                            {o.badgeNumber} ({o.name})
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-rose-600 font-bold text-[11px]">
                        None (Unassigned)
                      </span>
                    )}
                  </div>

                  {/* 3 Core Working Action Buttons: ACKNOWLEDGE, ASSIGN, RESOLVE */}
                  <div className="flex items-center gap-2">
                    {incident.status === 'OPEN' && (
                      <button
                        id={`ack-incident-btn-${incident.id}`}
                        onClick={() => onAcknowledgeIncident(incident.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        ACKNOWLEDGE
                      </button>
                    )}

                    {incident.status !== 'RESOLVED' && (
                      <div className="flex items-center gap-1">
                        <select
                          id={`assign-officer-select-${incident.id}`}
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              onAssignOfficer(incident.id, e.target.value);
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs focus:outline-none"
                        >
                          <option value="" disabled>
                            + Assign Officer
                          </option>
                          {availableOfficersForAssign.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.badgeNumber} - {o.name} ({o.vehicleType})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {incident.status !== 'RESOLVED' ? (
                      <button
                        id={`resolve-incident-btn-${incident.id}`}
                        onClick={() => onResolveIncident(incident.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        RESOLVE
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Closed / Cleared
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE / REPORT INCIDENT MODAL */}
      {isReportModalOpen && (
        <div
          id="report-incident-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsReportModalOpen(false)}
        >
          <div
            id="report-incident-modal"
            className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden text-slate-900 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Report Traffic Incident
                  </h3>
                  <p className="text-xs text-slate-500">
                    Triggers immediate risk elevation & police recommendation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              {/* Incident Type */}
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-slate-600">
                  Incident Type:
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as IncidentType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-red-500"
                >
                  <option value="Accident">Accident / Collision</option>
                  <option value="Congestion">Severe Gridlock Congestion</option>
                  <option value="Road Blockage">Vehicle Breakdown / Blockage</option>
                  <option value="Violation Hotspot">Violations Spike (Red Light/Rash)</option>
                  <option value="Weather Hazard">Waterlogging / Weather Hazard</option>
                  <option value="Special Event">VIP Convoy / Public Event Surge</option>
                  <option value="Signal Failure">Traffic Signal Hardware Fault</option>
                </select>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-slate-600">
                  Junction Location:
                </label>
                <select
                  value={newJunctionId}
                  onChange={(e) => setNewJunctionId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-red-500"
                >
                  {junctions.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.name} ({j.zone} Zone)
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity */}
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-slate-600">
                  Severity Level:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as IncidentSeverity[]).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setNewSeverity(sev)}
                      className={`py-2 rounded-lg font-bold text-center border transition-all ${
                        newSeverity === sev
                          ? getSeverityBadge(sev)
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detection Source */}
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-slate-600">
                  Reporting Source:
                </label>
                <select
                  value={newMethod}
                  onChange={(e) =>
                    setNewMethod(e.target.value as Incident['detectionMethod'])
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none"
                >
                  <option value="Manual Citizen Report">Manual Citizen Helpline (112)</option>
                  <option value="AI Computer Vision">AI Computer Vision (CCTV Stream)</option>
                  <option value="Field Officer">On-Ground Field Officer Report</option>
                  <option value="Traffic Sensor">Loop / Radar Sensor Anomaly</option>
                  <option value="ANPR Alert">ANPR Violation Alert</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-slate-600">
                  Incident Description:
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe location details, lane obstruction, casualties, or required towing..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  id="submit-incident-form-btn"
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2 shadow-sm shadow-red-600/25"
                >
                  <AlertTriangle className="w-4 h-4" />
                  SUBMIT INCIDENT & UPDATE RISK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
