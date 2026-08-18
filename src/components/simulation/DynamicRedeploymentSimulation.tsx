import React, { useState, useEffect } from 'react';
import {
  Junction,
  PoliceOfficer,
  Incident,
  DeploymentRecommendation,
  RiskCategory,
} from '../../types';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  CheckCircle,
  AlertOctagon,
  CloudRain,
  Shield,
  Clock,
  ArrowRight,
  TrendingUp,
  Radio,
  Sparkles,
  Zap,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DynamicRedeploymentSimulationProps {
  junctions: Junction[];
  officers: PoliceOfficer[];
  incidents: Incident[];
  onTriggerSimulationStep: (step: number) => void;
  onResetSimulation: () => void;
  currentStep: number;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (playing: boolean) => void;
  onAcceptDeployment: (rec: DeploymentRecommendation) => void;
}

export const SIMULATION_STEPS = [
  {
    step: 0,
    title: 'Baseline City State',
    subtitle: 'Normal Morning Patrol Deployment',
    description: 'Traffic flowing smoothly across Nagpur. Sitabuldi is at Medium Risk (48/100) with 1 officer on routine beat. Coverage is adequate.',
    actionBadge: 'NORMAL PATROL',
  },
  {
    step: 1,
    title: 'STEP 1: Incident Detection',
    subtitle: 'Collision at Sitabuldi Interchange',
    description: 'AI Computer Vision Camera CAM-STB-01 detects a bus-motorcycle crash blocking 2 lanes on Wardha Road arm. Immediate impact alert triggered.',
    actionBadge: 'INCIDENT DETECTED',
  },
  {
    step: 2,
    title: 'STEP 2: Severe Monsoon Rainfall',
    subtitle: 'Sudden Heavy Rain Over Central Nagpur',
    description: 'IMD sensor telemetry reports 45mm/hr downpour. Road friction drops by 40%, waterlogging begins near metro pillar underpasses.',
    actionBadge: 'WEATHER ESCALATION',
  },
  {
    step: 3,
    title: 'STEP 3: Congestion Gridlock Spikes',
    subtitle: 'Queue Spillback Extends 1.4 km',
    description: 'Average intersection velocity drops to 6.2 km/h. Tailback reaches Maharajbagh and Variety Square corridor.',
    actionBadge: 'GRIDLOCK SPILLBACK',
  },
  {
    step: 4,
    title: 'STEP 4: AI Risk Score Surges (48 → 87)',
    subtitle: 'Risk Level Changes from MEDIUM to CRITICAL',
    description: 'Real-time multi-factor scoring engine calculates +23 accident severity, +21 congestion, +10 rain impact. Final risk score reaches 87/100.',
    actionBadge: 'CRITICAL RISK 87/100',
  },
  {
    step: 5,
    title: 'STEP 5: Critical Coverage Gap Detected',
    subtitle: '1 Officer Present vs 3 Required Personnel',
    description: 'System detects high-risk unmanned deficit. Single officer on site is overwhelmed by crowd management and traffic diversion.',
    actionBadge: 'COVERAGE GAP = TRUE',
  },
  {
    step: 6,
    title: 'STEP 6: AI Decision Engine Optimization',
    subtitle: 'Generating Optimal Mobile Unit Recommendations',
    description: 'Constraint satisfaction algorithm filters 38 available fleet officers, evaluating spatial distance, traffic flow, and vehicle speeds.',
    actionBadge: 'AI RECOM. COMPUTED',
  },
  {
    step: 7,
    title: 'STEP 7: Nearest Units Identified (O-17 & O-24)',
    subtitle: 'Sub-Inspector Vikram Singh & Officer Deepak Nimje',
    description: 'Selected rapid-response motorcycle units at Civil Lines and Dhantoli. Estimated ETA: 3.4 minutes to Sitabuldi.',
    actionBadge: 'OFFICERS RANKED',
  },
  {
    step: 8,
    title: 'STEP 8: Dynamic Redeployment Executed',
    subtitle: 'Mobile Units Dispatched with Real-Time Routing',
    description: 'Officers receive push notification on field app with turn-by-turn routing and priority scene briefing. Travel path visualized on live map.',
    actionBadge: 'UNITS IN TRANSIT',
  },
  {
    step: 9,
    title: 'STEP 9: Scene Stabilized & Coverage Restored',
    subtitle: '3 Officers on Scene • Congestion Dissipated',
    description: 'Officers arrive on site, establish bypass lanes, clear incident vehicle. Risk score drops to 44/100. Response time minimized to 3.4 min!',
    actionBadge: 'REDEPLOYMENT COMPLETE',
  },
];

export const DynamicRedeploymentSimulation: React.FC<DynamicRedeploymentSimulationProps> = ({
  junctions,
  officers,
  incidents,
  onTriggerSimulationStep,
  onResetSimulation,
  currentStep,
  isAutoPlaying,
  setIsAutoPlaying,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying && currentStep < 9) {
      timer = setTimeout(() => {
        const nextStep = currentStep + 1;
        onTriggerSimulationStep(nextStep);
        if (nextStep === 9) {
          setIsAutoPlaying(false);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {
            // ignore
          }
        }
      }, 2400);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentStep, onTriggerSimulationStep, setIsAutoPlaying]);

  const activeStepData = SIMULATION_STEPS[currentStep] || SIMULATION_STEPS[0];

  return (
    <div
      id="dynamic-redeployment-simulation-panel"
      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 text-slate-900"
    >
      {/* Simulation Master Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700 border border-sky-200">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-lg text-slate-900">
              Dynamic Redeployment Live Simulation
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono text-xs border border-sky-200 font-semibold">
              HACKATHON DEMO
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Witness how Nagpur Traffic AI dynamically detects sudden incidents, spikes risk scores, flags coverage gaps, and redeploys nearest police units in seconds.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="run-incident-simulation-btn"
            onClick={() => {
              if (currentStep >= 9) {
                onResetSimulation();
                setTimeout(() => setIsAutoPlaying(true), 200);
              } else {
                setIsAutoPlaying(!isAutoPlaying);
              }
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all ${
              isAutoPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 animate-pulse'
                : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-sky-600/25'
            }`}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-4 h-4" /> Pause Simulation
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> RUN INCIDENT SIMULATION
              </>
            )}
          </button>

          <button
            id="step-forward-sim-btn"
            onClick={() => {
              if (currentStep < 9) onTriggerSimulationStep(currentStep + 1);
            }}
            disabled={currentStep >= 9}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs flex items-center gap-1 border border-slate-200"
            title="Next Step"
          >
            <FastForward className="w-4 h-4" />
          </button>

          <button
            id="reset-sim-btn"
            onClick={onResetSimulation}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs border border-slate-200"
            title="Reset to Normal State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Progress Timeline Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-sky-700">
            Timeline Progression: Step {currentStep} / 9
          </span>
          <span className="font-mono text-slate-400">
            {Math.round((currentStep / 9) * 100)}% Complete
          </span>
        </div>
        <div className="grid grid-cols-10 gap-1.5 h-2 w-full">
          {SIMULATION_STEPS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => onTriggerSimulationStep(idx)}
              className={`h-full rounded-sm transition-all ${
                idx === currentStep
                  ? 'bg-sky-600 shadow-sm scale-y-125'
                  : idx < currentStep
                  ? 'bg-sky-300'
                  : 'bg-slate-200'
              }`}
              title={s.title}
            />
          ))}
        </div>
      </div>

      {/* Active Step Card */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 font-mono text-xs font-bold border border-sky-200">
              {activeStepData.actionBadge}
            </span>
            <h4 className="font-bold text-slate-900 text-base">
              {activeStepData.title}: {activeStepData.subtitle}
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {activeStepData.description}
          </p>
        </div>

        {/* Live Step Badge */}
        <div className="p-3 rounded-lg bg-white border border-slate-200 text-center shrink-0 min-w-[140px] shadow-xs">
          <div className="text-[10px] text-slate-500 font-semibold uppercase">
            Sitabuldi Risk State
          </div>
          <div
            className={`font-mono text-xl font-black ${
              currentStep === 0 || currentStep === 9
                ? 'text-emerald-700'
                : currentStep >= 4
                ? 'text-rose-600 animate-pulse'
                : 'text-amber-700'
            }`}
          >
            {currentStep === 0
              ? '48 / 100'
              : currentStep < 4
              ? `${48 + currentStep * 10} / 100`
              : currentStep === 9
              ? '44 / 100'
              : '87 / 100'}
          </div>
          <div className="text-[10px] font-bold text-slate-500">
            {currentStep === 0
              ? 'MEDIUM'
              : currentStep < 4
              ? 'HIGH'
              : currentStep === 9
              ? 'STABILIZED (LOW)'
              : 'CRITICAL'}
          </div>
        </div>
      </div>

      {/* BEFORE / INCIDENT / AFTER Decision Support Comparison Cards */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
          Real-Time Decision Support Impact Matrix (Sitabuldi Junction)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. BEFORE INCIDENT */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentStep === 0
                ? 'bg-white border-sky-400 shadow-xs ring-1 ring-sky-300'
                : 'bg-slate-50 border-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="font-bold text-xs text-slate-800">1. BEFORE INCIDENT</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                NORMAL
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">AI Risk Score:</span>
                <span className="font-mono font-bold text-emerald-700">48 / 100 (Medium)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Police On Scene:</span>
                <span className="font-mono font-semibold text-slate-800">1 Officer</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Coverage Status:</span>
                <span className="text-emerald-700 font-semibold">Adequate</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Avg. Response Time:</span>
                <span className="font-mono text-slate-700">5.8 min</span>
              </div>
            </div>
          </div>

          {/* 2. AFTER INCIDENT (UNMANNED GAP) */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentStep >= 1 && currentStep < 8
                ? 'bg-red-50/50 border-red-400 shadow-xs ring-1 ring-red-300'
                : 'bg-slate-50 border-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="font-bold text-xs text-red-800">2. AFTER INCIDENT</span>
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold animate-pulse">
                UNRESOLVED GAP
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">AI Risk Score:</span>
                <span className="font-mono font-bold text-rose-700">87 / 100 (Critical)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Police On Scene:</span>
                <span className="font-mono font-semibold text-rose-700">1 Officer (Overloaded)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Coverage Status:</span>
                <span className="text-rose-700 font-bold flex items-center gap-1">
                  <AlertOctagon className="w-3 h-3" /> Critical Gap (Deficit: 2)
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Projected Gridlock Delay:</span>
                <span className="font-mono text-rose-700 font-bold">+28 min spillback</span>
              </div>
            </div>
          </div>

          {/* 3. AFTER AI REDEPLOYMENT */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentStep >= 8
                ? 'bg-sky-50/50 border-sky-400 shadow-xs ring-1 ring-sky-300'
                : 'bg-slate-50 border-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="font-bold text-xs text-sky-900">3. AFTER AI REDEPLOYMENT</span>
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                OPTIMIZED
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">AI Risk Score:</span>
                <span className="font-mono font-bold text-emerald-700">44 / 100 (Stabilized)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Police On Scene:</span>
                <span className="font-mono font-semibold text-sky-800">
                  3 Officers (O-101, O-17, O-24)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Coverage Status:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 100% Resolved (+40% gain)
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Rapid Response ETA:</span>
                <span className="font-mono text-sky-700 font-bold">3.4 min (&lt;5 min target)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
