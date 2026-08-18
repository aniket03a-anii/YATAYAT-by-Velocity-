import React, { useState, useEffect } from 'react';
import {
  Junction,
  PoliceOfficer,
  Incident,
  DeploymentRecommendation,
} from '../../types';
import { NagpurRiskMap } from '../map/NagpurRiskMap';
import {
  Shield,
  Clock,
  Car,
  TrendingUp,
  AlertTriangle,
  FileText,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  AlertOctagon,
  CheckCircle2,
  Radio,
  ExternalLink,
  MapPin,
} from 'lucide-react';

interface OverviewDashboardProps {
  junctions: Junction[];
  officers: PoliceOfficer[];
  incidents: Incident[];
  recommendations: DeploymentRecommendation[];
  selectedJunction: Junction | null;
  onSelectJunction: (junction: Junction) => void;
  onOpenExplainableAi: (junction: Junction) => void;
  onNavigateToIncidents: () => void;
  onAcknowledgeIncident: (id: string) => void;
  onResolveIncident: (id: string) => void;
  onRefreshData?: () => void;
  activeSimulationPath?: {
    from: { lat: number; lng: number; name?: string };
    to: { lat: number; lng: number; name?: string };
    officerBadge: string;
    progress: number;
  } | null;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  junctions,
  officers,
  incidents,
  recommendations,
  selectedJunction,
  onSelectJunction,
  onOpenExplainableAi,
  onNavigateToIncidents,
  onAcknowledgeIncident,
  onResolveIncident,
  onRefreshData,
  activeSimulationPath,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'CRITICAL'>('ALL');
  const [selectedIncidentForDetail, setSelectedIncidentForDetail] = useState<Incident | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setCurrentDateTime(`${dateStr}, ${timeStr} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Demo active incidents list matching Image 2
  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED');

  return (
    <div id="nagpur-overview-dashboard" className="space-y-4 animate-fade-in text-slate-900">
      {/* 1. TOP BANNER matching Image 2 */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Left branding */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                Nagpur Traffic Control & Decision Support
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-extrabold uppercase">
                ICCC PRIMARY CONSOLE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Nagpur Municipal Corporation & Traffic Police Command • Wardha Road Corridor Telemetry
            </p>
          </div>
        </div>

        {/* Right status pills & Refresh */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SYSTEM OPERATIONAL</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold">
            MODE: PROTOTYPE TELEMETRY
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentDateTime || 'Tue, 18 Aug, 2026, 01:42:06 IST'}</span>
          </div>

          <button
            onClick={() => onRefreshData && onRefreshData()}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. SIX KPI METRICS CARDS matching Image 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
        {/* CARD 1: AVG TRAVEL TIME */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            <span>AVG TRAVEL TIME</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
              16.8 <span className="text-sm font-semibold text-slate-500">min</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
              <span className="truncate">35.7 km/h • 10km Co...</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-700 border border-slate-200 shrink-0">
                WARDHA RD
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: VEHICLES ON ROAD */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            <span>VEHICLES ON ROAD</span>
            <Car className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
              505,565
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
              <span className="truncate">227491 Cars • 20...</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 font-mono font-bold text-blue-700 border border-blue-200 shrink-0">
                EST. ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* CARD 3: CITY CONGESTION */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            <span>CITY CONGESTION</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
              43 <span className="text-sm font-semibold text-slate-500">%</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
              <span className="truncate">126m Avg Queue Length</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 font-mono font-bold text-emerald-700 border border-emerald-200 shrink-0">
                NORMAL
              </span>
            </div>
          </div>
        </div>

        {/* CARD 4: ACTIVE INCIDENTS */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            <span>ACTIVE INCIDENTS</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-rose-600">
              {activeIncidents.length > 0 ? activeIncidents.length : 11}
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
              <span className="truncate">8 Critical • 3 High</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-50 font-mono font-bold text-rose-700 border border-rose-200 shrink-0">
                ACTIVE CAD
              </span>
            </div>
          </div>
        </div>

        {/* CARD 5: VIOLATIONS TODAY */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            <span>VIOLATIONS TODAY</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
              50
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
              <span className="truncate">ANPR & Speed Sens...</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-700 border border-slate-200 shrink-0">
                PROCESSED
              </span>
            </div>
          </div>
        </div>

        {/* CARD 6: AVG RESPONSE TIME */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            <span>AVG RESPONSE TIME</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">
              4.8 <span className="text-sm font-semibold text-slate-500">min</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
              <span className="truncate">Police SLA &lt; 6.0 min</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 font-mono font-bold text-emerald-700 border border-emerald-200 shrink-0">
                ON TARGET
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN SPLIT: GIS MAP (Left ~62%) + ACTIVE INCIDENTS QUEUE (Right ~38%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT: NAGPUR GIS MAP */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-white">
            <NagpurRiskMap
              junctions={junctions}
              officers={officers}
              incidents={incidents}
              selectedJunction={selectedJunction}
              onSelectJunction={onSelectJunction}
              onOpenExplainableAi={onOpenExplainableAi}
              activeSimulationPath={activeSimulationPath}
            />
          </div>
        </div>

        {/* RIGHT: ACTIVE INCIDENTS QUEUE matching Image 2 */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
          {/* Header matching image */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-rose-600">
                <AlertOctagon className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                Active Incidents Queue
              </h3>
              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono font-bold">
                11 ACTIVE
              </span>
            </div>

            <button
              onClick={onNavigateToIncidents}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>CAD Dispatcher</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Incidents List matching Image 2 */}
          <div className="space-y-2.5 overflow-y-auto max-h-[520px] pr-1">
            {/* INC-SIM-067 */}
            <div
              onClick={() => {
                const j = junctions.find((item) => item.name.includes('Sitabuldi'));
                if (j) onSelectJunction(j);
              }}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-rose-50/40 border border-slate-200/90 hover:border-rose-300 transition-all cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-900">INC-SIM-067</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-mono font-bold border border-rose-200">
                    CRITICAL
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                  OPEN
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 leading-snug">
                Simulated Collision: MAJOR_ACCIDENT at Sitabuldi...
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span className="truncate max-w-[200px]">Sitabuldi Interchange (Demo Junction A)</span>
                <span className="font-mono text-slate-400 shrink-0">ACCIDENT 🕐 128m ago</span>
              </div>
            </div>

            {/* INC-SIM-060 */}
            <div className="p-3.5 rounded-xl bg-slate-50 hover:bg-rose-50/40 border border-slate-200/90 hover:border-rose-300 transition-all cursor-pointer space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-900">INC-SIM-060</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-mono font-bold border border-rose-200">
                    CRITICAL
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                  OPEN
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 leading-snug">
                Simulated Collision: MAJOR_ACCIDENT at Sitabuldi...
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span className="truncate max-w-[200px]">Sitabuldi Interchange (Demo Junction A)</span>
                <span className="font-mono text-slate-400 shrink-0">ACCIDENT 🕐 351m ago</span>
              </div>
            </div>

            {/* INC-SIM-056 */}
            <div className="p-3.5 rounded-xl bg-slate-50 hover:bg-rose-50/40 border border-slate-200/90 hover:border-rose-300 transition-all cursor-pointer space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-900">INC-SIM-056</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-mono font-bold border border-rose-200">
                    CRITICAL
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                  OPEN
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 leading-snug">
                Simulated Collision: MAJOR_ACCIDENT at Sitabuldi...
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span className="truncate max-w-[200px]">Sitabuldi Interchange (Demo Junction A)</span>
                <span className="font-mono text-slate-400 shrink-0">ACCIDENT 🕐 356m ago</span>
              </div>
            </div>

            {/* INC-SIM-053 */}
            <div className="p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50/40 border border-slate-200/90 hover:border-amber-300 transition-all cursor-pointer space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-900">INC-SIM-053</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-mono font-bold border border-rose-200">
                    CRITICAL
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  ACKNOWLEDGED
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 leading-snug">
                Simulated Collision: MAJOR_ACCIDENT at Sitabuldi...
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span className="truncate max-w-[200px]">Sitabuldi Interchange (Demo Junction A)</span>
                <span className="font-mono text-slate-400 shrink-0">ACCIDENT 🕐 365m ago</span>
              </div>
            </div>

            {/* INC-SIM-052 */}
            <div className="p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50/40 border border-slate-200/90 hover:border-amber-300 transition-all cursor-pointer space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-900">INC-SIM-052</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-mono font-bold border border-rose-200">
                    CRITICAL
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  ACKNOWLEDGED
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 leading-snug">
                Simulated Collision: MAJOR_ACCIDENT at Sitabuldi...
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span className="truncate max-w-[200px]">Sitabuldi Interchange (Demo Junction A)</span>
                <span className="font-mono text-slate-400 shrink-0">ACCIDENT 🕐 365m ago</span>
              </div>
            </div>
          </div>

          {/* Footer bar matching image */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Priority Triage: Critical First</span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Auto-sync active</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
