import React, { useState } from 'react';
import {
  Sliders,
  Radio,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { INITIAL_JUNCTIONS } from '../../data/nagpurData';

export const TrafficSignalsView: React.FC = () => {
  const [signals, setSignals] = useState([
    {
      id: 'SIG-01',
      junction: 'Sitabuldi Interchange Square',
      mode: 'AI_ADAPTIVE',
      currentPhase: 'NORTH_SOUTH_GREEN',
      cycleLengthSec: 120,
      greenTimeSec: 65,
      amberTimeSec: 5,
      redTimeSec: 50,
      queueClearedPercent: 94,
      actuatedStatus: 'Optimal Flow',
    },
    {
      id: 'SIG-02',
      junction: 'Variety Square (Maharajbagh)',
      mode: 'AI_ADAPTIVE',
      currentPhase: 'EAST_WEST_GREEN',
      cycleLengthSec: 110,
      greenTimeSec: 55,
      amberTimeSec: 5,
      redTimeSec: 50,
      queueClearedPercent: 88,
      actuatedStatus: 'Congestion Draining',
    },
    {
      id: 'SIG-03',
      junction: 'Samvidhan Square (RBI Chowk)',
      mode: 'GREEN_WAVE_LINKED',
      currentPhase: 'NORTH_SOUTH_GREEN',
      cycleLengthSec: 130,
      greenTimeSec: 80,
      amberTimeSec: 5,
      redTimeSec: 45,
      queueClearedPercent: 98,
      actuatedStatus: 'Corridor Preemption Active',
    },
    {
      id: 'SIG-04',
      junction: 'Chhatrapati Square (Wardha Rd)',
      mode: 'AI_ADAPTIVE',
      currentPhase: 'NORTH_SOUTH_GREEN',
      cycleLengthSec: 115,
      greenTimeSec: 60,
      amberTimeSec: 5,
      redTimeSec: 50,
      queueClearedPercent: 91,
      actuatedStatus: 'Normal Flow',
    },
    {
      id: 'SIG-05',
      junction: 'Medical Square (GMC Spine)',
      mode: 'EMERGENCY_PRIORITY',
      currentPhase: 'AMBULANCE_PREEMPTION',
      cycleLengthSec: 90,
      greenTimeSec: 75,
      amberTimeSec: 5,
      redTimeSec: 10,
      queueClearedPercent: 99,
      actuatedStatus: 'Green Wave Locked',
    },
  ]);

  const [overrideSignalId, setOverrideSignalId] = useState<string | null>(null);

  const handleExtendGreen = (id: string) => {
    setSignals((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, greenTimeSec: s.greenTimeSec + 15, cycleLengthSec: s.cycleLengthSec + 15 } : s
      )
    );
  };

  return (
    <div id="traffic-signals-panel" className="space-y-6 animate-fade-in text-slate-900">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900">
                Nagpur Adaptive Traffic Signal Controllers (ATCS)
              </h2>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold">
                124 CONNECTED SIGNALS
              </span>
            </div>
            <p className="text-xs text-slate-500">
              AI camera-actuated signal split times adjusting in real-time based on live approach queue length.
            </p>
          </div>
        </div>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {signals.map((sig) => (
          <div
            key={sig.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-mono font-bold">
                {sig.id}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  sig.mode === 'EMERGENCY_PRIORITY'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                {sig.mode}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900">{sig.junction}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Phase: <strong className="text-slate-800">{sig.currentPhase}</strong>
              </p>
            </div>

            {/* Signal Phase Visual Progress */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Green Phase Duration:</span>
                <span className="font-mono font-bold text-emerald-600">{sig.greenTimeSec}s</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${(sig.greenTimeSec / sig.cycleLengthSec) * 100}%` }}
                  className="bg-emerald-500 h-full"
                />
                <div
                  style={{ width: `${(sig.amberTimeSec / sig.cycleLengthSec) * 100}%` }}
                  className="bg-amber-500 h-full"
                />
                <div
                  style={{ width: `${(sig.redTimeSec / sig.cycleLengthSec) * 100}%` }}
                  className="bg-rose-500 h-full"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Cycle: {sig.cycleLengthSec}s</span>
                <span>Queue Cleared: {sig.queueClearedPercent}%</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {sig.actuatedStatus}
              </span>

              <button
                onClick={() => handleExtendGreen(sig.id)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
              >
                +15s Green
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
