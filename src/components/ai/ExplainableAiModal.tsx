import React from 'react';
import { Junction } from '../../types';
import { getRiskColor, WEIGHTS } from '../../services/riskEngine';
import {
  X,
  Sparkles,
  HelpCircle,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Scale,
  BrainCircuit,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

interface ExplainableAiModalProps {
  junction: Junction | null;
  onClose: () => void;
  onDeployRecommendation?: (junction: Junction) => void;
}

export const ExplainableAiModal: React.FC<ExplainableAiModalProps> = ({
  junction,
  onClose,
  onDeployRecommendation,
}) => {
  if (!junction) return null;

  const colorInfo = getRiskColor(junction.riskCategory);
  const factors = junction.contributingFactors || [];

  // Chart data for recharts
  const chartData = factors.map((f) => ({
    factorName: f.name.length > 20 ? f.name.slice(0, 18) + '…' : f.name,
    fullFactorName: f.name,
    points: f.contributionPoints,
    rawScore: f.score,
    weight: `${f.weightPercent}%`,
    description: f.description,
  }));

  return (
    <div
      id="explainable-ai-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="explainable-ai-modal"
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900">
                  Explainable AI (XAI) Risk Decomposition
                </h3>
                <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-mono border border-sky-200 font-bold">
                  SIMULATED RANDOM FOREST / GRADIENT BOOST
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Transparent factor attribution for {junction.name} ({junction.zone} Zone)
              </p>
            </div>
          </div>

          <button
            id="close-explainable-ai-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Main Question & Total Score Hero */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-semibold flex items-center gap-1.5 justify-center md:justify-start">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                Root Cause Attribution Analysis
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Why is {junction.name} at {junction.riskCategory} Risk?
              </h2>
              <p className="text-xs text-slate-600 max-w-lg">
                The decision support engine computes weighted contributions across 8 multidimensional real-time and historical risk vectors.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="text-right">
                <div className="text-[10px] uppercase font-semibold text-slate-500">
                  Computed Risk
                </div>
                <div
                  className={`text-2xl font-mono font-black ${colorInfo.text}`}
                >
                  {junction.riskScore}
                  <span className="text-xs text-slate-400 font-normal"> / 100</span>
                </div>
              </div>
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${colorInfo.badge}`}
              >
                {junction.riskCategory}
              </div>
            </div>
          </div>

          {/* Visual Factor Contribution Bar Chart */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-sky-600" />
                Factor Point Contribution to Overall Risk
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                Points Sum = Final Score ({junction.riskScore})
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 30]} stroke="#94a3b8" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="factorName"
                    stroke="#475569"
                    fontSize={11}
                    width={140}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-lg text-xs space-y-1">
                            <div className="font-bold text-sky-800">{d.fullFactorName}</div>
                            <div className="text-slate-800">
                              Contribution: <span className="font-mono font-bold text-rose-600">+{d.points} pts</span>
                            </div>
                            <div className="text-slate-500">
                              Raw Sensor/Historical Index: <span className="font-mono text-slate-700">{d.rawScore}%</span>
                            </div>
                            <div className="text-slate-500">
                              Factor Model Weight: <span className="font-mono text-slate-700">{d.weight}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                              {d.description}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="points" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.points >= 18
                            ? '#ef4444'
                            : entry.points >= 10
                            ? '#f97316'
                            : entry.points >= 6
                            ? '#f59e0b'
                            : '#0284c7'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transparent Point Breakdown Table / Cards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-sky-600" />
              Detailed Mathematical Factor Log
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {factors.map((f, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 text-xs">{f.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        (Weight: {f.weightPercent}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-sm text-sky-700">
                      +{f.contributionPoints} pts
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Raw: {f.score}/100
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Support Advisory Note */}
          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-slate-700 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-sky-800">Responsible AI Compliance: </span>
              “AI recommendations are advisory and remain subject to authorized human police supervisor approval. No automatic enforcement actions are taken without human attestation.”
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
          >
            Back to Map
          </button>
          {onDeployRecommendation && (
            <button
              onClick={() => {
                onClose();
                onDeployRecommendation(junction);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-sky-600/20"
            >
              <Sparkles className="w-4 h-4" />
              Generate Deployment Recommendation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
