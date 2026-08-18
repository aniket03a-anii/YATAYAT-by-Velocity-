import React from 'react';
import {
  Shield,
  BrainCircuit,
  Users,
  Building2,
  Lock,
  Sparkles,
  Layers,
  Zap,
  CheckCircle2,
  HelpCircle,
  FileCheck,
  Compass,
  Radio,
  MapPin,
  Ambulance,
} from 'lucide-react';

export const ArchitectureImpactView: React.FC = () => {
  return (
    <div id="architecture-impact-panel" className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-sky-600" />
          System Architecture, Responsible AI & Nagpur Smart City Alignment
        </h2>
        <p className="text-xs text-slate-500">
          Complete end-to-end AI decision support blueprint, ethical compliance framework, and operational deployment roadmap.
        </p>
      </div>

      {/* 1. End-to-End System Architecture Pipeline */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-600" />
          End-to-End Decision Support Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold font-mono">
              1
            </div>
            <h5 className="font-bold text-slate-900">Sensor & Telemetry Ingestion</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Nagpur ICCC CCTV camera feeds, ANPR logs, radar loops, IMD weather radar, and 112 citizen incident calls.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold font-mono">
              2
            </div>
            <h5 className="font-bold text-slate-900">Multi-Factor Risk Engine</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Computes weighted risk index (0–100) per junction using historical accident density, real-time speed, rain index & violation surges.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold font-mono">
              3
            </div>
            <h5 className="font-bold text-slate-900">Coverage Gap Analysis</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Cross-references computed junction risk score against stationed police personnel to flag high-risk unmanned vulnerabilities.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold font-mono">
              4
            </div>
            <h5 className="font-bold text-slate-900">Decision & Dispatch Optimizer</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Evaluates nearest mobile police units, minimizing transit ETA (&lt;5 min) and maximizing city-wide safety coverage.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold font-mono">
              5
            </div>
            <h5 className="font-bold text-slate-900">Human Supervisor & Field App</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Supervisor approves or overrides recommendations with logged audit trails. Field units receive mobile turn-by-turn guidance.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Responsible AI & Ethical Governance Framework */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-sky-600" />
          <h3 className="font-bold text-sm text-slate-900">
            Responsible AI & Ethical Governance Standards
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. Transparent Explainability (XAI)
            </div>
            <p className="text-slate-600 leading-relaxed">
              Every computed risk score is fully decomposed into readable, weighted point contributions (+23 accident history, +21 congestion, +10 rain, etc.). No "black-box" decisions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              2. Sovereign Human Authority (Human-in-the-Loop)
            </div>
            <p className="text-slate-600 leading-relaxed">
              AI provides advisory decision support only. Police officers are NEVER deployed autonomously without authorized supervisor attestation or pre-approved policy triggers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              3. Officer Workload & Fatigue Fairness
            </div>
            <p className="text-slate-600 leading-relaxed">
              Dispatch optimizer enforces maximum shift hours and prevents disproportionately redeploying the same patrol unit repeatedly, preserving wellness and tactical readiness.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-teal-600" />
              4. Complete Auditability (IT Act 2000 Compliance)
            </div>
            <p className="text-slate-600 leading-relaxed">
              All officer dispatches, manual supervisor overrides, and incident resolutions are permanently recorded in an immutable operational audit log.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Real-World Feasibility & Future Integrations */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-600" />
          Nagpur Smart City Integration Roadmap & Feasibility
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-600" /> ICCC Integration
            </div>
            <p className="text-slate-500 leading-relaxed">
              Direct API integration with Nagpur Smart and Sustainable City Development Corporation Limited (NSSCDCL) Integrated Command and Control Centre.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-red-600" /> Dial 112 Dispatch
            </div>
            <p className="text-slate-500 leading-relaxed">
              Two-way automatic sync with Maharashtra Police Dial 112 emergency response vehicle CAD (Computer-Aided Dispatch) framework.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Ambulance className="w-4 h-4 text-emerald-600" /> Green Corridors
            </div>
            <p className="text-slate-500 leading-relaxed">
              Automated emergency green light waves for AIIMS / GMC ambulances and organ transplants connecting Wardha Road to Medical Square.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" /> Drone Tether Feeds
            </div>
            <p className="text-slate-500 leading-relaxed">
              Tethered surveillance drones for major religious processions, cricket matches at VCA Stadium, and peak festival crowd surges.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Nagpur Local Context Card */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-600" />
          Nagpur Local Geography & Traffic Micro-Dynamics
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Nagpur is Maharashtra's winter capital and a major logistics hub connected by National Highway 44 and Asian Highway 46. The urban traffic matrix is characterized by heavy freight transit on the Outer Ring Road, high commercial density along Central Avenue (CA Road), commercial congestion at Sitabuldi and Variety Square, and acute monsoon waterlogging vulnerabilities near Nag River underpasses. Nagpur Traffic AI is tailored specifically to these micro-corridors.
        </p>
      </div>
    </div>
  );
};
