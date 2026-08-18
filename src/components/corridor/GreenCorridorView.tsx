import React, { useState } from 'react';
import {
  Ambulance,
  Heart,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Radio,
  Zap,
  Building2,
  Activity,
  ArrowRight,
  AlertOctagon,
} from 'lucide-react';

export const GreenCorridorView: React.FC = () => {
  const [activeCorridor, setActiveCorridor] = useState<string>('GC-01');
  const [isPreemptionActive, setIsPreemptionActive] = useState<boolean>(true);
  const [etaRemaining, setEtaRemaining] = useState<string>('4.2 min');

  const hospitals = [
    {
      id: 'hosp-aiims',
      name: 'AIIMS Nagpur (Mihan)',
      bedsAvailable: 9,
      icuAvailable: 3,
      traumaStatus: 'Standby / Ready',
      zone: 'South Corridor',
    },
    {
      id: 'hosp-gmc',
      name: 'Government Medical College (GMC) & Hospital',
      bedsAvailable: 12,
      icuAvailable: 5,
      traumaStatus: 'Active Receiving',
      zone: 'Medical Square Spine',
    },
    {
      id: 'hosp-wockhardt',
      name: 'Wockhardt Super Speciality Hospital',
      bedsAvailable: 7,
      icuAvailable: 2,
      traumaStatus: 'Ready',
      zone: 'Shankar Nagar / WHC',
    },
  ];

  const corridors = [
    {
      id: 'GC-01',
      name: 'Wardha Road → Medical Square Emergency Corridor',
      ambulanceId: 'MH-31-EMG-108',
      patientType: 'Critical Cardiac Trauma Transfer',
      source: 'Airport Junction (Wardha Rd)',
      destination: 'GMC Medical Square',
      distance: '6.8 km',
      clearedJunctions: 5,
      totalJunctions: 7,
      status: 'ACTIVE_PREEMPTION',
      speedKmph: 52,
    },
    {
      id: 'GC-02',
      name: 'Amravati Road → AIIMS Organ Transit Spine',
      ambulanceId: 'MH-31-ORG-102',
      patientType: 'Live Organ (Heart) Express Airlift',
      source: 'Wadi Naka',
      destination: 'AIIMS Nagpur',
      distance: '14.2 km',
      clearedJunctions: 9,
      totalJunctions: 11,
      status: 'ACTIVE_PREEMPTION',
      speedKmph: 68,
    },
  ];

  return (
    <div id="green-corridor-panel" className="space-y-6 animate-fade-in text-slate-900">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-teal-50 border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 shrink-0">
            <Ambulance className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900">
                CAD 108 Emergency Green Corridor & Preemption
              </h2>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                SIGNAL OVERRIDE ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Sub-second automated green wave preemption for 108 EMS ambulances and organ transfer convoys.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreemptionActive(!isPreemptionActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isPreemptionActive
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {isPreemptionActive ? 'Preemption Active (All Clear)' : 'Preemption Paused'}
          </button>
        </div>
      </div>

      {/* Hospital Bed Live Capacity Cards */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
          Nagpur Trauma Center Bed & ICU Telemetry
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-slate-900">{hosp.name}</h3>
                  <div className="text-[11px] text-slate-500">{hosp.zone}</div>
                </div>
                <span className="p-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                  <Building2 className="w-4 h-4" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Trauma Beds</div>
                  <div className="text-xl font-mono font-black text-emerald-700">
                    {hosp.bedsAvailable} Beds
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-100">
                  <div className="text-[10px] text-blue-800 font-bold uppercase">ICU Ready</div>
                  <div className="text-xl font-mono font-black text-blue-700">
                    {hosp.icuAvailable} Units
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{hosp.traumaStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Corridors List */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
          Active Green Corridor Missions
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {corridors.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                    {c.id}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{c.ambulanceId}</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <Activity className="w-3 h-3 animate-pulse" /> LIVE PREEMPTION
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                <p className="text-xs text-rose-600 font-semibold mt-0.5 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-current" /> {c.patientType}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Route Envelope:</span>
                  <span className="font-semibold text-slate-800">
                    {c.source} → {c.destination}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Distance & Speed:</span>
                  <span className="font-mono text-blue-700 font-bold">
                    {c.distance} • {c.speedKmph} km/h (Clear Wave)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Signal Intersections Cleared:</span>
                  <span className="font-mono text-emerald-700 font-bold">
                    {c.clearedJunctions} of {c.totalJunctions} Green-Locked
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Target ETA to Hospital: <strong className="text-slate-900 font-mono">{etaRemaining}</strong></span>
                </div>

                <button
                  onClick={() => alert(`Preemption Green Wave signals locked for ${c.ambulanceId}`)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Monitor Telemetry
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
