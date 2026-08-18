import React, { useState } from 'react';
import {
  HOURLY_RISK_TREND,
  VIOLATION_BREAKDOWN,
  IMPACT_METRICS,
} from '../../data/nagpurData';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CloudRain,
  Shield,
  Activity,
  AlertTriangle,
  Award,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const [forecastHorizon, setForecastHorizon] = useState<'15' | '30' | '60'>('30');

  // Colors for violation breakdown pie
  const PIE_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#06b6d4', '#8b5cf6'];

  // Predictive 15/30/60 min hotspot list
  const predictiveHotspots = [
    {
      junction: 'Sitabuldi Interchange',
      currentRisk: 87,
      forecastRisk: forecastHorizon === '15' ? 92 : forecastHorizon === '30' ? 88 : 74,
      trend: forecastHorizon === '60' ? 'Decreasing' : 'Surging',
      primaryDriver: 'Office dismissal rush + monsoon waterlogging on Wardha Road',
    },
    {
      junction: 'Chhatrapati Square',
      currentRisk: 79,
      forecastRisk: forecastHorizon === '15' ? 84 : forecastHorizon === '30' ? 89 : 82,
      trend: 'Surging',
      primaryDriver: 'Ring Road heavy freight inflow starting at 18:00',
    },
    {
      junction: 'Mankapur Ring Road',
      currentRisk: 72,
      forecastRisk: forecastHorizon === '15' ? 76 : forecastHorizon === '30' ? 79 : 68,
      trend: 'Elevated',
      primaryDriver: 'Highway transit speed differential & rain slick',
    },
    {
      junction: 'Variety Square',
      currentRisk: 68,
      forecastRisk: forecastHorizon === '15' ? 71 : forecastHorizon === '30' ? 75 : 62,
      trend: 'Moderate Surge',
      primaryDriver: 'Commercial market shopping spillover to West High Court Rd',
    },
  ];

  return (
    <div id="analytics-view-panel" className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Nagpur Traffic Analytics & AI Predictive Forecast
          </h2>
          <p className="text-xs text-slate-500">
            Temporal time-series forecasting, historical accident blackspots, and AI intervention impact evaluation.
          </p>
        </div>

        {/* Forecast Horizon Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
          <span className="text-slate-600 font-semibold px-2">Forecast Horizon:</span>
          <button
            onClick={() => setForecastHorizon('15')}
            className={`px-3 py-1 rounded-lg font-mono font-bold transition-all ${
              forecastHorizon === '15'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            +15 Min
          </button>
          <button
            onClick={() => setForecastHorizon('30')}
            className={`px-3 py-1 rounded-lg font-mono font-bold transition-all ${
              forecastHorizon === '30'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            +30 Min
          </button>
          <button
            onClick={() => setForecastHorizon('60')}
            className={`px-3 py-1 rounded-lg font-mono font-bold transition-all ${
              forecastHorizon === '60'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            +60 Min
          </button>
        </div>
      </div>

      {/* BEFORE / AFTER Impact Metric Cards */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-emerald-600" />
          Quantifiable Impact Metrics (AI Deployment Optimization)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="text-slate-500 text-xs font-semibold">Average Response Time</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-black text-emerald-600">
                {IMPACT_METRICS.responseTimeReductionPercent}%
              </span>
              <span className="text-xs text-emerald-700 font-bold">Reduction</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              Manual: <strong>{IMPACT_METRICS.manualResponseTimeMinutes} min</strong> → AI:{' '}
              <strong className="text-emerald-700">{IMPACT_METRICS.aiResponseTimeMinutes} min</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="text-slate-500 text-xs font-semibold">High-Risk Coverage</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-black text-sky-600">
                +{IMPACT_METRICS.highRiskCoverageGainPercent}%
              </span>
              <span className="text-xs text-sky-700 font-bold">Improvement</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              Baseline: <strong>{IMPACT_METRICS.baselineCoveragePercent}%</strong> → AI-Optimized:{' '}
              <strong className="text-sky-700">{IMPACT_METRICS.optimizedCoveragePercent}%</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="text-slate-500 text-xs font-semibold">Congestion Delay Spikes</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-black text-purple-600">
                -{IMPACT_METRICS.congestionDelayReductionPercent}%
              </span>
              <span className="text-xs text-purple-700 font-bold">Time Saved</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              Proactive preemptive officer presence on key bottleneck entry ramps
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="text-slate-500 text-xs font-semibold">Incident Clearing Speed</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-black text-amber-600">
                -{IMPACT_METRICS.incidentClearanceReductionMinutes} min
              </span>
              <span className="text-xs text-amber-700 font-bold">Faster</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              Rapid crane & ambulance coordination via automated triage routing
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Hourly Risk Trend & Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Trend Chart (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                Diurnal Traffic Risk & Incident Density (24-Hour Curve)
              </h4>
              <p className="text-[11px] text-slate-500">
                Historical peak congestion spikes: Morning (09:00–11:00) & Evening (18:00–21:00)
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono">
              Nagpur City Aggregate
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_RISK_TREND} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-lg text-xs space-y-1">
                          <div className="font-bold text-slate-900">Time: {label}</div>
                          <div className="text-sky-700">
                            Avg Risk Score: <span className="font-mono font-bold">{payload[0]?.value}/100</span>
                          </div>
                          <div className="text-red-600">
                            Incident Probability: <span className="font-mono font-bold">{payload[1]?.value} events</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgRisk"
                  name="Risk Score"
                  stroke="#0284c7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRisk)"
                />
                <Area
                  type="monotone"
                  dataKey="incidents"
                  name="Incident Count"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorIncidents)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violation Categories Pie Chart (1 col) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Traffic Violation Distribution (Nagpur)
            </h4>
            <p className="text-[11px] text-slate-500">
              Aggregated ANPR & CCTV intelligent detection feeds
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={VIOLATION_BREAKDOWN}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="percentage"
                >
                  {VIOLATION_BREAKDOWN.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-lg text-xs space-y-0.5">
                          <div className="font-bold text-slate-900">{d.category}</div>
                          <div className="text-sky-700 font-mono">
                            {d.count.toLocaleString()} cases ({d.percentage}%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {VIOLATION_BREAKDOWN.slice(0, 4).map((v, i) => (
              <div key={i} className="flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i] }}
                  />
                  <span>{v.category}</span>
                </div>
                <span className="font-mono font-bold text-slate-500">{v.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Predictive Hotspots Matrix (+15 / +30 / +60 Min) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-sky-600" />
              Upcoming High-Risk Corridors (+{forecastHorizon} Min Prediction)
            </h4>
            <p className="text-[11px] text-slate-500">
              Proactive dispatch triggers before queue gridlock materializes physically
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-sky-50 text-sky-700 border border-sky-200 text-xs font-mono font-semibold">
            LSTM Neural Net Predictive Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {predictiveHotspots.map((h, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-bold text-sm text-slate-900">{h.junction}</h5>
                  <p className="text-xs text-slate-500 mt-0.5">{h.primaryDriver}</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold border ${
                    h.forecastRisk >= 85
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : 'bg-orange-100 text-orange-800 border-orange-200'
                  }`}
                >
                  {h.trend}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <div className="text-slate-500">
                  Current Score: <strong className="font-mono text-slate-800">{h.currentRisk}</strong>
                </div>
                <div className="text-slate-500">
                  Predicted (+{forecastHorizon}m):{' '}
                  <strong className="font-mono font-bold text-rose-600 text-sm">
                    {h.forecastRisk} / 100
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
