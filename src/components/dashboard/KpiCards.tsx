import React from 'react';
import {
  AlertOctagon,
  Flame,
  Shield,
  AlertTriangle,
  Clock,
  Radio,
  Car,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface KpiCardsProps {
  criticalCount: number;
  highRiskCount: number;
  availableOfficersCount: number;
  activeIncidentsCount: number;
  coverageGapsCount: number;
  avgCongestionPercent: number;
  avgResponseMinutes: number;
  onFilterRisk?: (risk: 'CRITICAL' | 'HIGH' | 'ALL') => void;
  onFilterCoverageGaps?: () => void;
  onFilterIncidents?: () => void;
  onFilterOfficers?: () => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  criticalCount,
  highRiskCount,
  availableOfficersCount,
  activeIncidentsCount,
  coverageGapsCount,
  avgCongestionPercent,
  avgResponseMinutes,
  onFilterRisk,
  onFilterCoverageGaps,
  onFilterIncidents,
  onFilterOfficers,
}) => {
  const cards = [
    {
      id: 'kpi-critical-zones',
      title: 'CRITICAL ZONES',
      value: criticalCount,
      unit: 'Junctions',
      subtitle: 'Score ≥ 81 (Priority 1)',
      icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
      colorClass: 'text-rose-600',
      bgGlow: 'hover:border-rose-300 hover:bg-rose-50/50',
      badge: 'Immediate Action',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      trend: '+1 vs yesterday',
      trendType: 'negative',
      onClick: () => onFilterRisk && onFilterRisk('CRITICAL'),
    },
    {
      id: 'kpi-high-risk',
      title: 'HIGH-RISK ZONES',
      value: highRiskCount,
      unit: 'Corridors',
      subtitle: 'Score 51 - 80',
      icon: <Flame className="w-5 h-5 text-amber-600" />,
      colorClass: 'text-amber-600',
      bgGlow: 'hover:border-amber-300 hover:bg-amber-50/50',
      badge: 'Monitoring',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      trend: 'Peak hour surge',
      trendType: 'neutral',
      onClick: () => onFilterRisk && onFilterRisk('HIGH'),
    },
    {
      id: 'kpi-available-officers',
      title: 'AVAILABLE OFFICERS',
      value: availableOfficersCount,
      unit: '/ 40 Total',
      subtitle: 'Mobile Rapid Units',
      icon: <Shield className="w-5 h-5 text-sky-600" />,
      colorClass: 'text-sky-600',
      bgGlow: 'hover:border-sky-300 hover:bg-sky-50/50',
      badge: 'Ready to Deploy',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      trend: '38 Active on Patrol',
      trendType: 'positive',
      onClick: onFilterOfficers,
    },
    {
      id: 'kpi-active-incidents',
      title: 'ACTIVE INCIDENTS',
      value: activeIncidentsCount,
      unit: 'Live Cases',
      subtitle: 'Accidents & Blockages',
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      colorClass: 'text-red-600',
      bgGlow: 'hover:border-red-300 hover:bg-red-50/50',
      badge: activeIncidentsCount > 0 ? 'Action Req.' : 'Clear',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      trend: '2 AI-detected',
      trendType: 'negative',
      onClick: onFilterIncidents,
    },
    {
      id: 'kpi-avg-response',
      title: 'AVG. RESPONSE TIME',
      value: `${avgResponseMinutes}m`,
      unit: 'ETA to scene',
      subtitle: 'Target: < 5.0 min',
      icon: <Clock className="w-5 h-5 text-emerald-600" />,
      colorClass: 'text-emerald-600',
      bgGlow: 'hover:border-emerald-300 hover:bg-emerald-50/50',
      badge: 'Target Met',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      trend: '-1.8 min vs manual dispatch',
      trendType: 'positive',
    },
    {
      id: 'kpi-coverage-gaps',
      title: 'COVERAGE GAPS',
      value: coverageGapsCount,
      unit: 'Deficits',
      subtitle: 'High-risk Unmanned',
      icon: <Radio className="w-5 h-5 text-purple-600 animate-pulse" />,
      colorClass: 'text-purple-600',
      bgGlow: 'hover:border-purple-300 hover:bg-purple-50/50',
      badge: 'AI Flagged',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      trend: 'Auto-recommending units',
      trendType: 'neutral',
      onClick: onFilterCoverageGaps,
    },
    {
      id: 'kpi-city-congestion',
      title: 'CITY CONGESTION',
      value: `${avgCongestionPercent}%`,
      unit: 'Index',
      subtitle: 'Nagpur Core Grid',
      icon: <Car className="w-5 h-5 text-orange-600" />,
      colorClass: 'text-orange-600',
      bgGlow: 'hover:border-orange-300 hover:bg-orange-50/50',
      badge: 'Moderate-Heavy',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      trend: 'Rainfall slowdown',
      trendType: 'neutral',
    },
    {
      id: 'kpi-system-status',
      title: 'SYSTEM STATUS',
      value: '99.9%',
      unit: 'Uptime',
      subtitle: '24 Camera Streams',
      icon: <Activity className="w-5 h-5 text-teal-600" />,
      colorClass: 'text-teal-600',
      bgGlow: 'hover:border-teal-300 hover:bg-teal-50/50',
      badge: 'OPERATIONAL',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      trend: '42ms API Latency',
      trendType: 'positive',
    },
  ];

  return (
    <div className="space-y-2">
      {/* Top Disclaimer Label */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-slate-600 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-sky-600" />
          Nagpur Smart City Traffic Telemetry (Overview)
        </span>
        <span className="text-[10px] text-amber-700 font-mono font-medium">
          * PROTOTYPE DEMO DATA • SIMULATED METRICS
        </span>
      </div>

      {/* Grid of 8 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {cards.map((card) => (
          <div
            key={card.id}
            id={card.id}
            onClick={card.onClick}
            className={`p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-2 transition-all cursor-pointer hover:shadow-md ${card.bgGlow}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-tight">
                {card.title}
              </span>
              <span className="p-1 rounded-md bg-slate-50 border border-slate-100 shrink-0">
                {card.icon}
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-mono font-black ${card.colorClass}`}>
                  {card.value}
                </span>
                <span className="text-[10px] text-slate-500 font-medium truncate">
                  {card.unit}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {card.subtitle}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${card.badgeColor}`}
              >
                {card.badge}
              </span>
              <span className="text-[9px] text-slate-500 truncate max-w-[70px]">
                {card.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
