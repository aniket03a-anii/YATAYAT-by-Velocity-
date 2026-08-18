import React, { useState, useEffect } from 'react';
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
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Check,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface SimulationWaypoint {
  id: string;
  name: string;
  distanceKm: number;
  cleared: boolean;
  active: boolean;
  signalStatus: 'RED' | 'YELLOW' | 'GREEN_LOCKED';
  timeSec: number;
}

export const GreenCorridorView: React.FC = () => {
  const [activeCorridor, setActiveCorridor] = useState<string>('GC-01');
  const [isPreemptionActive, setIsPreemptionActive] = useState<boolean>(true);
  const [etaRemaining, setEtaRemaining] = useState<string>('4.2 min');

  // Simulator State
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [simSpeedKmph, setSimSpeedKmph] = useState<number>(62);
  const [simDistanceRemaining, setSimDistanceRemaining] = useState<number>(6.8);
  const [simEtaSec, setSimEtaSec] = useState<number>(240);
  const [selectedRoute, setSelectedRoute] = useState<string>('route-gmc');
  const [selectedAmbulance, setSelectedAmbulance] = useState<string>('MH-31-EMG-108');
  const [simLogs, setSimLogs] = useState<string[]>([
    'CAD 108 Emergency Telemetry Server connected.',
    'Green wave preemption algorithms primed for Wardha Rd Spine.',
  ]);

  const [waypoints, setWaypoints] = useState<SimulationWaypoint[]>([
    { id: 'wp-1', name: 'Airport Junction (Origin)', distanceKm: 0.0, cleared: true, active: false, signalStatus: 'GREEN_LOCKED', timeSec: 0 },
    { id: 'wp-2', name: 'Chhatrapati Square', distanceKm: 1.6, cleared: false, active: true, signalStatus: 'GREEN_LOCKED', timeSec: 45 },
    { id: 'wp-3', name: 'Rahate Colony Square', distanceKm: 3.4, cleared: false, active: false, signalStatus: 'GREEN_LOCKED', timeSec: 95 },
    { id: 'wp-4', name: 'Congress Nagar Junction', distanceKm: 5.1, cleared: false, active: false, signalStatus: 'GREEN_LOCKED', timeSec: 150 },
    { id: 'wp-5', name: 'GMC Medical Square (Dest)', distanceKm: 6.8, cleared: false, active: false, signalStatus: 'GREEN_LOCKED', timeSec: 210 },
  ]);

  // Simulation timer tick
  useEffect(() => {
    let interval: any = null;
    if (simRunning) {
      interval = setInterval(() => {
        setSimEtaSec((prev) => {
          if (prev <= 10) {
            setSimRunning(false);
            setSimLogs((logs) => [
              `[${new Date().toLocaleTimeString()}] 🏥 ARRIVAL AT HOSPITAL: Emergency trauma unit transferred to GMC ICU!`,
              ...logs,
            ]);
            return 0;
          }
          return prev - 5;
        });

        setSimDistanceRemaining((prev) => Math.max(0, +(prev - 0.15).toFixed(2)));

        setSimStep((step) => {
          const nextStep = (step + 1) % waypoints.length;
          setWaypoints((prevWps) =>
            prevWps.map((wp, idx) => ({
              ...wp,
              cleared: idx < nextStep,
              active: idx === nextStep,
              signalStatus: 'GREEN_LOCKED',
            }))
          );
          if (nextStep === waypoints.length - 1) {
            setSimLogs((logs) => [
              `[${new Date().toLocaleTimeString()}] ✅ Final intersection cleared. GMC Trauma Bay Gates Opened.`,
              ...logs,
            ]);
          } else {
            setSimLogs((logs) => [
              `[${new Date().toLocaleTimeString()}] 🟢 Green Wave Preemption locked for waypoint: ${waypoints[nextStep]?.name}`,
              ...logs,
            ]);
          }
          return nextStep;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [simRunning, waypoints]);

  const handleStartSim = () => {
    setSimRunning(true);
    setSimLogs((logs) => [
      `[${new Date().toLocaleTimeString()}] 🚨 GREEN CORRIDOR ACTIVATED: Unit ${selectedAmbulance} departing on emergency run!`,
      ...logs,
    ]);
  };

  const handlePauseSim = () => {
    setSimRunning(false);
    setSimLogs((logs) => [
      `[${new Date().toLocaleTimeString()}] ⏸ Simulation paused.`,
      ...logs,
    ]);
  };

  const handleResetSim = () => {
    setSimRunning(false);
    setSimStep(0);
    setSimDistanceRemaining(6.8);
    setSimEtaSec(240);
    setWaypoints([
      { id: 'wp-1', name: 'Airport Junction (Origin)', distanceKm: 0.0, cleared: true, active: false, signalStatus: 'GREEN_LOCKED', timeSec: 0 },
      { id: 'wp-2', name: 'Chhatrapati Square', distanceKm: 1.6, cleared: false, active: true, signalStatus: 'GREEN_LOCKED', timeSec: 45 },
      { id: 'wp-3', name: 'Rahate Colony Square', distanceKm: 3.4, cleared: false, active: false, signalStatus: 'GREEN_LOCKED', timeSec: 95 },
      { id: 'wp-4', name: 'Congress Nagar Junction', distanceKm: 5.1, cleared: false, active: false, signalStatus: 'GREEN_LOCKED', timeSec: 150 },
      { id: 'wp-5', name: 'GMC Medical Square (Dest)', distanceKm: 6.8, cleared: false, active: false, signalStatus: 'GREEN_LOCKED', timeSec: 210 },
    ]);
    setSimLogs([
      'Simulation reset to origin state.',
      'CAD 108 Emergency Telemetry Server connected.',
    ]);
  };

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

      {/* GREEN CORRIDOR SIMULATOR MODULE */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>Green Corridor Live Simulator</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                  {simRunning ? 'SIMULATING RUN' : 'STANDBY'}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Interactive real-time demonstration of signal preemption locks and hospital telemetry synchronization.
              </p>
            </div>
          </div>

          {/* Simulator Action Controls */}
          <div className="flex items-center gap-2">
            {!simRunning ? (
              <button
                onClick={handleStartSim}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Corridor Sim</span>
              </button>
            ) : (
              <button
                onClick={handlePauseSim}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={handleResetSim}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Simulator Route Progression & Waypoints */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                Assigned Ambulance
              </div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">{selectedAmbulance}</div>
              <div className="text-[10px] text-emerald-700 font-semibold">Priority 1 (ALS ICU)</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                Distance Remaining
              </div>
              <div className="text-base font-mono font-bold text-blue-700 mt-0.5">
                {simDistanceRemaining.toFixed(1)} km / 6.8 km
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                Estimated Arrival (ETA)
              </div>
              <div className="text-base font-mono font-bold text-emerald-700 mt-0.5">
                {Math.floor(simEtaSec / 60)}m {simEtaSec % 60}s
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                Corridor Speed
              </div>
              <div className="text-base font-mono font-bold text-slate-800 mt-0.5">
                {simSpeedKmph} km/h (Clear Wave)
              </div>
            </div>
          </div>

          {/* Waypoint Visual Step Track */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>INTERSECTION SIGNAL PREEMPTION PIPELINE</span>
              <span className="font-mono text-emerald-700 font-semibold">
                {waypoints.filter((w) => w.cleared).length} of {waypoints.length} Passed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 pt-2">
              {waypoints.map((wp, i) => (
                <div
                  key={wp.id}
                  className={`p-2.5 rounded-xl border text-xs transition-all ${
                    wp.cleared
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                      : wp.active
                      ? 'bg-blue-50 border-blue-300 text-blue-900 ring-2 ring-blue-400/30'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold">
                      J-{i + 1}
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        wp.signalStatus === 'GREEN_LOCKED'
                          ? 'bg-emerald-500 animate-pulse'
                          : 'bg-rose-500'
                      }`}
                      title={wp.signalStatus}
                    />
                  </div>

                  <div className="font-bold text-[11px] mt-1 leading-tight truncate">
                    {wp.name}
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 mt-1 flex items-center justify-between">
                    <span>{wp.distanceKm} km</span>
                    <span className="font-bold text-emerald-700">
                      {wp.cleared ? 'CLEARED' : wp.active ? 'APPROACHING' : 'PREEMPTED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Simulator Event Log Feed */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Live Preemption Event Log:
            </div>
            <div className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] space-y-1 max-h-24 overflow-y-auto">
              {simLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-1.5">
                  <span className="text-emerald-400">❯</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
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
                  onClick={() => handleStartSim()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Run Simulator Run
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
