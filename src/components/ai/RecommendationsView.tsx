import React from 'react';
import { DeploymentRecommendation, Junction, PoliceOfficer } from '../../types';
import { getRiskColor } from '../../services/riskEngine';
import {
  Sparkles,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  User,
  Zap,
} from 'lucide-react';

interface RecommendationsViewProps {
  recommendations: DeploymentRecommendation[];
  onAcceptDeployment: (rec: DeploymentRecommendation) => void;
  onOpenOverride: (rec: DeploymentRecommendation) => void;
  onWhyThisOfficer: (rec: DeploymentRecommendation) => void;
  onFocusJunction?: (junctionId: string) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  onAcceptDeployment,
  onOpenOverride,
  onWhyThisOfficer,
  onFocusJunction,
}) => {
  const pendingRecs = recommendations.filter((r) => r.status === 'PENDING');
  const pastRecs = recommendations.filter((r) => r.status !== 'PENDING');

  return (
    <div
      id="ai-recommendations-panel"
      className="space-y-4 text-slate-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 border border-sky-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              AI Police Deployment Recommendations
              {pendingRecs.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono text-[10px] font-bold">
                  {pendingRecs.length} Actionable
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500">
              Optimal officer assignment matching risk index, spatial proximity & travel ETA
            </p>
          </div>
        </div>
      </div>

      {/* Pending Recommendations Cards */}
      {pendingRecs.length === 0 ? (
        <div className="p-8 rounded-xl bg-white border border-slate-200 text-center space-y-2 shadow-xs">
          <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto opacity-80" />
          <h4 className="font-semibold text-sm text-slate-900">
            All High-Risk Junctions Covered
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No active coverage deficits detected. The AI engine continuously analyzes sensor streams and incident reports.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingRecs.map((rec) => {
            const colorInfo = getRiskColor(rec.riskCategory);

            return (
              <div
                key={rec.id}
                id={`recommendation-card-${rec.id}`}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5 transition-all hover:border-sky-300"
              >
                {/* Card Top: Location, Zone, Risk Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {rec.junctionName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({rec.zone} Zone)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-sky-600" />
                      Generated {rec.generatedAt} • Priority:{' '}
                      <span
                        className={
                          rec.priority === 'IMMEDIATE'
                            ? 'text-rose-600 font-bold'
                            : 'text-amber-700 font-bold'
                        }
                      >
                        {rec.priority}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-mono font-black border ${colorInfo.badge}`}
                    >
                      {rec.riskScore}/100 • {rec.riskCategory}
                    </span>
                  </div>
                </div>

                {/* Recommended Officers List & Metrics */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sky-700">
                      <Shield className="w-3.5 h-3.5" />
                      Recommended Mobile Unit{rec.recommendedOfficers.length > 1 ? 's' : ''}:
                    </span>
                    <span className="font-mono text-slate-600">
                      ETA: <strong className="text-sky-700">~{rec.estimatedEtaMinutes} min</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {rec.recommendedOfficers.length > 0 ? (
                      rec.recommendedOfficers.map((officer) => (
                        <div
                          key={officer.id}
                          className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between text-xs shadow-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="font-bold text-slate-900">
                              {officer.badgeNumber} • {officer.name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {officer.rank} • {officer.vehicleType}
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                            {officer.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 rounded bg-white border border-slate-200 text-xs text-slate-700">
                        Officer O-17 & O-24 (Rapid Response Motorcycle Units)
                      </div>
                    )}
                  </div>

                  {/* Impact Projection Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                      Coverage Gain: +{rec.expectedCoverageImprovementPercent}%
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                      Risk Reduction: -{rec.expectedRiskReductionPercent}%
                    </span>
                  </div>
                </div>

                {/* Explainable Reasons Bulleted */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Why This Recommendation:
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {rec.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3 Core Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    id={`why-officer-btn-${rec.id}`}
                    onClick={() => onWhyThisOfficer(rec)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1.5 font-medium border border-slate-200 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                    WHY THIS OFFICER?
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      id={`override-btn-${rec.id}`}
                      onClick={() => onOpenOverride(rec)}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 flex items-center gap-1.5 transition-colors"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      OVERRIDE
                    </button>

                    <button
                      id={`accept-deploy-btn-${rec.id}`}
                      onClick={() => onAcceptDeployment(rec)}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all hover:scale-105"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      ACCEPT & DEPLOY
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History of Actions (if any) */}
      {pastRecs.length > 0 && (
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Recent Deployment Log:
          </div>
          <div className="space-y-1.5 text-xs">
            {pastRecs.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-slate-700"
              >
                <span>
                  {r.junctionName} •{' '}
                  <strong className={r.status === 'ACCEPTED' ? 'text-emerald-700' : 'text-amber-700'}>
                    {r.status === 'ACCEPTED' ? 'Deployed (AI Match)' : 'Supervised Override'}
                  </strong>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {r.status === 'OVERRIDDEN' ? r.overrideDetails?.overrideReason : 'Executed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
