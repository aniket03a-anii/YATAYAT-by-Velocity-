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
  Activity,
  Cpu,
  Wifi,
  ShieldAlert,
  ArrowRight,
  Sparkles,
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
      telemetry: {
        latencyMs: 14,
        approachQueueNorth: '18 vehicles',
        approachQueueSouth: '24 vehicles',
        approachQueueEast: '8 vehicles',
        approachQueueWest: '11 vehicles',
        cameraOcrActive: true,
        protocol: 'CoSiCoSt-V4.2 / NTCIP-1202',
        firmware: 'ITSC-Nagpur-v2.9',
        coordinationGroup: 'Corridor Alpha (Wardha Rd)',
      },
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
      telemetry: {
        latencyMs: 11,
        approachQueueNorth: '14 vehicles',
        approachQueueSouth: '19 vehicles',
        approachQueueEast: '32 vehicles',
        approachQueueWest: '6 vehicles',
        cameraOcrActive: true,
        protocol: 'SCATS-Edge v3.1',
        firmware: 'ITSC-Nagpur-v2.9',
        coordinationGroup: 'Central West Grid',
      },
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
      telemetry: {
        latencyMs: 8,
        approachQueueNorth: '4 vehicles',
        approachQueueSouth: '6 vehicles',
        approachQueueEast: '12 vehicles',
        approachQueueWest: '9 vehicles',
        cameraOcrActive: true,
        protocol: 'CoSiCoSt-V4.2 / NTCIP-1202',
        firmware: 'ITSC-Nagpur-v2.9',
        coordinationGroup: 'Corridor Alpha (Wardha Rd)',
      },
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
      telemetry: {
        latencyMs: 16,
        approachQueueNorth: '21 vehicles',
        approachQueueSouth: '15 vehicles',
        approachQueueEast: '10 vehicles',
        approachQueueWest: '12 vehicles',
        cameraOcrActive: true,
        protocol: 'CoSiCoSt-V4.2 / NTCIP-1202',
        firmware: 'ITSC-Nagpur-v2.9',
        coordinationGroup: 'South Spine Arterial',
      },
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
      telemetry: {
        latencyMs: 9,
        approachQueueNorth: '0 vehicles (Clear)',
        approachQueueSouth: '2 vehicles',
        approachQueueEast: '14 vehicles',
        approachQueueWest: '18 vehicles',
        cameraOcrActive: true,
        protocol: 'Emergency Wave DSRC / 5G C-V2X',
        firmware: 'ITSC-Nagpur-v2.9-EMG',
        coordinationGroup: 'GMC Trauma Green Channel',
      },
    },
    {
      id: 'SIG-06',
      junction: 'Ajni Square (Railway Approach)',
      mode: 'AI_ADAPTIVE',
      currentPhase: 'EAST_WEST_GREEN',
      cycleLengthSec: 105,
      greenTimeSec: 50,
      amberTimeSec: 5,
      redTimeSec: 50,
      queueClearedPercent: 90,
      actuatedStatus: 'Optimal Flow',
      telemetry: {
        latencyMs: 12,
        approachQueueNorth: '11 vehicles',
        approachQueueSouth: '16 vehicles',
        approachQueueEast: '22 vehicles',
        approachQueueWest: '14 vehicles',
        cameraOcrActive: true,
        protocol: 'CoSiCoSt-V4.2 / NTCIP-1202',
        firmware: 'ITSC-Nagpur-v2.9',
        coordinationGroup: 'South Spine Arterial',
      },
    },
  ]);

  const [selectedSignalId, setSelectedSignalId] = useState<string>('SIG-01');

  const handleExtendGreen = (id: string) => {
    setSignals((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, greenTimeSec: s.greenTimeSec + 15, cycleLengthSec: s.cycleLengthSec + 15 }
          : s
      )
    );
  };

  const selectedSignal = signals.find((s) => s.id === selectedSignalId) || signals[0];

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
                Nagpur Adaptive Traffic Signal Controllers (ATCS) & Telemetry
              </h2>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold">
                124 CONNECTED CONTROLLERS
              </span>
            </div>
            <p className="text-xs text-slate-500">
              AI camera-actuated signal split times adjusting in real-time based on live approach queue telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
            <span className="text-slate-500">Telemetry Sync: </span>
            <span className="font-bold text-emerald-600">LIVE (100ms)</span>
          </div>
        </div>
      </div>

      {/* Signal Controller Telemetry Overview Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Selected Controller Hardware & Telemetry Diagnostic Box */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Controller Hardware Telemetry
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
              {selectedSignal.id}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Junction:</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px]">
                  {selectedSignal.junction}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Control Protocol:</span>
                <span className="font-mono text-blue-700 font-bold">
                  {selectedSignal.telemetry.protocol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Firmware Build:</span>
                <span className="font-mono text-slate-700">
                  {selectedSignal.telemetry.firmware}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Packet RTT Ping:</span>
                <span className="font-mono text-emerald-600 font-bold">
                  {selectedSignal.telemetry.latencyMs} ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Coordination Group:</span>
                <span className="font-semibold text-slate-800">
                  {selectedSignal.telemetry.coordinationGroup}
                </span>
              </div>
            </div>

            {/* Approach Queue Length Telemetry */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Approach Queue Telemetry (AI Video Sensor)
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold font-mono">NORTH APPROACH</div>
                  <div className="font-mono font-bold text-slate-800">
                    {selectedSignal.telemetry.approachQueueNorth}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold font-mono">SOUTH APPROACH</div>
                  <div className="font-mono font-bold text-slate-800">
                    {selectedSignal.telemetry.approachQueueSouth}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold font-mono">EAST APPROACH</div>
                  <div className="font-mono font-bold text-slate-800">
                    {selectedSignal.telemetry.approachQueueEast}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold font-mono">WEST APPROACH</div>
                  <div className="font-mono font-bold text-slate-800">
                    {selectedSignal.telemetry.approachQueueWest}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signals Grid (2 Columns) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {signals.map((sig) => (
            <div
              key={sig.id}
              onClick={() => setSelectedSignalId(sig.id)}
              className={`p-4 rounded-2xl bg-white border shadow-xs space-y-3 cursor-pointer transition-all ${
                selectedSignalId === sig.id
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExtendGreen(sig.id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  +15s Green
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
