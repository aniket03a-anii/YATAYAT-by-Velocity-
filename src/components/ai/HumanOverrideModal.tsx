import React, { useState } from 'react';
import { DeploymentRecommendation, Junction, PoliceOfficer } from '../../types';
import {
  X,
  ShieldAlert,
  UserCheck,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface HumanOverrideModalProps {
  recommendation: DeploymentRecommendation | null;
  junctions: Junction[];
  officers: PoliceOfficer[];
  onClose: () => void;
  onConfirmOverride: (
    recId: string,
    overrideOfficerIds: string[],
    overrideJunctionId: string,
    overrideReason: string
  ) => void;
}

export const HumanOverrideModal: React.FC<HumanOverrideModalProps> = ({
  recommendation,
  junctions,
  officers,
  onClose,
  onConfirmOverride,
}) => {
  if (!recommendation) return null;

  const [selectedOfficerId, setSelectedOfficerId] = useState<string>(
    recommendation.recommendedOfficerIds[0] || officers[0]?.id || ''
  );
  const [selectedJunctionId, setSelectedJunctionId] = useState<string>(
    recommendation.junctionId
  );
  const [reason, setReason] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setHasError(true);
      return;
    }
    onConfirmOverride(
      recommendation.id,
      [selectedOfficerId],
      selectedJunctionId,
      reason.trim()
    );
    onClose();
  };

  const availableOfficers = officers.filter((o) => o.status !== 'OFF_DUTY');

  return (
    <div
      id="human-override-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="human-override-modal"
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden text-slate-900 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Human Supervisor Override
              </h3>
              <p className="text-xs text-amber-800">
                Manual Policy Modification & Decision Logging
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Advisory Notice */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-slate-700">
            <div className="font-semibold text-amber-900 flex items-center gap-1.5 mb-1">
              <UserCheck className="w-4 h-4 text-amber-700" />
              AI SUPPORTS HUMAN DECISION-MAKING
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Supervisors possess sovereign operational authority to override algorithmically generated officer allocations. All overrides are cryptographically logged for auditability under IT Act 2000.
            </p>
          </div>

          {/* AI Recommended Context */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-[11px] text-slate-500">Original AI Recommendation:</div>
            <div className="font-medium text-slate-800">
              Deploy to <span className="text-sky-700 font-bold">{recommendation.junctionName}</span> (Risk: {recommendation.riskScore}/100)
            </div>
            <div className="text-[11px] text-slate-500">
              Recommended Units: {recommendation.recommendedOfficers.map((o) => `${o.badgeNumber} (${o.name})`).join(', ') || 'O-17'}
            </div>
          </div>

          {/* Officer Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-sky-600" />
              Select Override Officer / Unit:
            </label>
            <select
              id="override-officer-select"
              value={selectedOfficerId}
              onChange={(e) => setSelectedOfficerId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
            >
              {availableOfficers.map((officer) => (
                <option key={officer.id} value={officer.id}>
                  {officer.badgeNumber} - {officer.name} ({officer.rank} • {officer.vehicleType} • {officer.zone} Zone • {officer.status})
                </option>
              ))}
            </select>
          </div>

          {/* Target Location Dropdown */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              Select Target Junction Location:
            </label>
            <select
              id="override-location-select"
              value={selectedJunctionId}
              onChange={(e) => setSelectedJunctionId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
            >
              {junctions.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.name} ({j.zone} Zone • Risk: {j.riskScore}/100 • {j.trafficCondition})
                </option>
              ))}
            </select>
          </div>

          {/* Justification Text Area */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              Supervisor Override Justification (Mandatory):
            </label>
            <textarea
              id="override-reason-input"
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setHasError(false);
              }}
              placeholder="e.g. VIP convoy route escort priority, local festival procession diversion, or physical barricading required..."
              className={`w-full p-3 rounded-xl bg-slate-50 border ${
                hasError ? 'border-red-500' : 'border-slate-200'
              } text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 text-xs`}
            />
            {hasError && (
              <p className="text-[11px] text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Please provide an operational reason for the supervisor override audit log.
              </p>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              id="confirm-override-btn"
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-2 shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              CONFIRM OVERRIDE & LOG AUDIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
