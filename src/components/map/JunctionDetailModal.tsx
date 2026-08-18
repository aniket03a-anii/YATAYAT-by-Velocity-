import React from 'react';
import { Junction, PoliceOfficer, Incident } from '../../types';
import { getRiskColor } from '../../services/riskEngine';
import {
  X,
  AlertTriangle,
  Shield,
  Activity,
  CloudRain,
  Sun,
  Users,
  Compass,
  Video,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react';

interface JunctionDetailModalProps {
  junction: Junction | null;
  officers: PoliceOfficer[];
  incidents: Incident[];
  onClose: () => void;
  onOpenExplainableAi: (junction: Junction) => void;
  onOpenDeploy: (junction: Junction) => void;
  onSelectIncident?: (incident: Incident) => void;
}

export const JunctionDetailModal: React.FC<JunctionDetailModalProps> = ({
  junction,
  officers,
  incidents,
  onClose,
  onOpenExplainableAi,
  onOpenDeploy,
  onSelectIncident,
}) => {
  if (!junction) return null;

  const colorInfo = getRiskColor(junction.riskCategory);
  const assignedOfficers = officers.filter((o) =>
    junction.assignedOfficerIds.includes(o.id)
  );
  const activeIncidents = incidents.filter((i) =>
    junction.activeIncidentIds.includes(i.id) && i.status !== 'RESOLVED'
  );

  return (
    <div
      id="junction-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="junction-detail-modal"
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-5 border-b border-slate-200 flex items-center justify-between ${colorInfo.bg}`}>
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-xl border ${colorInfo.border} ${colorInfo.badge}`}
            >
              {junction.riskScore}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900">{junction.name}</h3>
                {junction.marathiName && (
                  <span className="text-xs text-slate-500 font-normal">
                    ({junction.marathiName})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="font-mono">{junction.id}</span>
                <span>•</span>
                <span>Zone: {junction.zone}</span>
                <span>•</span>
                <span>Updated: {junction.lastUpdated}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${colorInfo.badge}`}
            >
              {junction.riskCategory} RISK
            </span>
            <button
              id="close-junction-detail-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 transition-colors border border-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Active Incidents Alert Banner (if any) */}
          {activeIncidents.length > 0 && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start justify-between gap-3 text-red-900">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-800">
                    Active Incident Detected: {activeIncidents[0].type} ({activeIncidents[0].severity})
                  </div>
                  <p className="text-xs text-red-700 mt-0.5">
                    {activeIncidents[0].description}
                  </p>
                </div>
              </div>
              {onSelectIncident && (
                <button
                  id="view-incident-btn"
                  onClick={() => onSelectIncident(activeIncidents[0])}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 shrink-0"
                >
                  View Incident
                </button>
              )}
            </div>
          )}

          {/* Risk Factors Breakdown Bars */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-600" />
                Risk Factor Breakdown
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">Weighted Total: {junction.riskScore}/100</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700">Accident Severity Risk</span>
                  <span className="font-mono font-bold text-rose-600">{junction.accidentRisk}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${junction.accidentRisk}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700">Real-Time Congestion</span>
                  <span className="font-mono font-bold text-amber-700">{junction.congestionRisk}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${junction.congestionRisk}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700">Violation / Behavior Index</span>
                  <span className="font-mono font-bold text-orange-600">{junction.violationRisk}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${junction.violationRisk}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700">Weather & Monsoon Impact</span>
                  <span className="font-mono font-bold text-sky-700">{junction.weatherImpact}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${junction.weatherImpact}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Current Real-Time Conditions & CCTV Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Live Telemetry Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
                Live Junction Telemetry
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Traffic Flow State:</span>
                  <span
                    className={`font-semibold ${
                      junction.trafficCondition === 'Gridlock'
                        ? 'text-rose-600'
                        : junction.trafficCondition === 'Heavy'
                        ? 'text-amber-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {junction.trafficCondition}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Average Velocity:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {junction.avgSpeedKmph} km/h
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Hourly Throughput:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    ~{junction.vehicleCountPerHour.toLocaleString()} veh/hr
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Weather Condition:</span>
                  <span className="flex items-center gap-1 text-slate-800">
                    {junction.weatherCondition === 'Rainy' ? (
                      <CloudRain className="w-3.5 h-3.5 text-sky-600" />
                    ) : (
                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {junction.weatherCondition}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Edge CCTV Snapshot */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                  Live CCTV Feed ({junction.cctvStreamId})
                </h4>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono">
                  ANPR • RLVD
                </span>
              </div>
              <div className="relative w-full h-28 bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center text-white">
                {/* Simulated CCTV Camera View Graphic */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                <div className="text-center z-10 space-y-1">
                  <div className="font-mono text-[10px] text-sky-300 tracking-widest uppercase">
                    [LIVE FEED STREAM: {junction.cctvStreamId}]
                  </div>
                  <div className="text-[11px] text-slate-200 font-medium">
                    {junction.roads.join(' × ')}
                  </div>
                  <div className="font-mono text-[9px] text-slate-400">
                    1080p • 30 FPS • AI Object Detection Active
                  </div>
                </div>
                <div className="absolute top-1.5 left-2 font-mono text-[9px] text-red-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> REC
                </div>
                <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-slate-400">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {/* Police Deployment Status & Coverage Gap Check */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-600" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Police Deployment & Coverage Evaluation
                </h4>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  junction.hasCoverageGap
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {junction.policeCoverage} (
                {assignedOfficers.length} Assigned / {junction.requiredOfficers} Required)
              </span>
            </div>

            {assignedOfficers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {assignedOfficers.map((officer) => (
                  <div
                    key={officer.id}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">
                        {officer.badgeNumber} • {officer.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {officer.rank} • {officer.vehicleType}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">
                      On-Duty
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  No officers currently stationed at this high-risk intersection! Coverage Gap = YES.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
          <button
            id="view-explainable-ai-btn"
            onClick={() => onOpenExplainableAi(junction)}
            className="px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs border border-sky-200 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-sky-600" />
            VIEW AI EXPLANATION
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
            >
              Close
            </button>
            <button
              id="deploy-officers-btn"
              onClick={() => onOpenDeploy(junction)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-sky-600/20 transition-all hover:scale-102"
            >
              <Shield className="w-4 h-4" />
              DEPLOY / REDEPLOY OFFICERS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
