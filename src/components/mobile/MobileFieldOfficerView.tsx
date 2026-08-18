import React, { useState } from 'react';
import { PoliceOfficer, Junction, Incident } from '../../types';
import {
  Smartphone,
  Shield,
  MapPin,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Radio,
  Clock,
  Phone,
  CloudRain,
  Car,
  Bell,
  ArrowRight,
  Send,
  Zap,
} from 'lucide-react';

interface MobileFieldOfficerViewProps {
  officer: PoliceOfficer;
  currentJunction: Junction | null;
  activeIncidents: Incident[];
  onAcknowledgeDispatch: (officerId: string) => void;
  onUpdateDutyStatus: (status: string) => void;
}

export const MobileFieldOfficerView: React.FC<MobileFieldOfficerViewProps> = ({
  officer,
  currentJunction,
  activeIncidents,
  onAcknowledgeDispatch,
  onUpdateDutyStatus,
}) => {
  const [missionStatus, setMissionStatus] = useState<
    'STANDBY' | 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE' | 'RESOLVED'
  >('DISPATCHED');
  const [fieldReportText, setFieldReportText] = useState<string>('');
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);
  const [sosTriggered, setSosTriggered] = useState<boolean>(false);

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldReportText.trim()) return;
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setFieldReportText('');
    }, 3000);
  };

  return (
    <div
      id="mobile-field-officer-terminal"
      className="max-w-md mx-auto p-4 flex flex-col items-center space-y-4"
    >
      <div className="w-full flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-sky-600" />
          <h3 className="font-bold text-sm text-slate-900">
            Nagpur Traffic Police Field App (M-Terminal)
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
          LIVE GPS CONNECTED
        </span>
      </div>

      {/* Simulated Smartphone Device Frame */}
      <div className="w-full bg-white border-4 border-slate-300 rounded-[36px] shadow-xl p-4 overflow-hidden relative text-slate-900 flex flex-col justify-between space-y-4 min-h-[640px]">
        {/* Phone Notch & Status Bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-2 pt-1">
          <span>09:41</span>
          <div className="w-20 h-4 bg-slate-200 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <span>98%</span>
          </div>
        </div>

        {/* Officer Profile Header Pill */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center font-bold text-sky-700">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">{officer.name}</div>
              <div className="text-[11px] text-slate-500">
                {officer.rank} • <span className="text-sky-700 font-semibold">{officer.badgeNumber}</span>
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
            ON DUTY
          </span>
        </div>

        {/* Urgent AI Tactical Dispatch Banner */}
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" /> AI REDEPLOYMENT ORDER
            </span>
            <span className="text-[10px] text-rose-700 font-mono font-bold">PRIORITY 1</span>
          </div>

          <div>
            <h4 className="font-bold text-base text-rose-900">
              {currentJunction ? currentJunction.name : 'Sitabuldi Interchange'}
            </h4>
            <p className="text-xs text-rose-700 mt-0.5">
              Accident + severe congestion gridlock detected. Unmanned coverage deficit.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-rose-200 text-rose-800">
            <span className="flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-rose-600" /> Target ETA: 3.4 min
            </span>
            <span className="font-mono font-bold">Risk: 87/100</span>
          </div>
        </div>

        {/* Mission Status Progression Buttons */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Update Mission Deployment State:
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => {
                setMissionStatus('EN_ROUTE');
                onUpdateDutyStatus('EN_ROUTE');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                missionStatus === 'EN_ROUTE'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              En Route
            </button>
            <button
              onClick={() => {
                setMissionStatus('ON_SCENE');
                onUpdateDutyStatus('ON_SCENE');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                missionStatus === 'ON_SCENE'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              On Scene
            </button>
            <button
              onClick={() => {
                setMissionStatus('RESOLVED');
                onUpdateDutyStatus('RESOLVED');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                missionStatus === 'RESOLVED'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              Cleared
            </button>
          </div>
        </div>

        {/* Turn-by-Turn Navigation Preview */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-sky-600" /> Optimal Transit Route
            </span>
            <span className="font-mono text-sky-700 font-bold">1.2 km • 3 min</span>
          </div>
          <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
            <div>
              <div className="font-semibold text-slate-800">
                Via Wardha Road Underpass (Signal Priority Active)
              </div>
              <div className="text-[10px] text-emerald-700 font-mono mt-0.5 font-semibold">
                Green Corridor Signal Priority enabled for Unit {officer.badgeNumber}
              </div>
            </div>
            <button
              onClick={() => alert('GPS Navigation Opened for Field Unit!')}
              className="px-3 py-1.5 rounded-lg bg-sky-600 text-white font-bold text-xs shrink-0 hover:bg-sky-500"
            >
              Start GPS
            </button>
          </div>
        </div>

        {/* Ground Report Submission */}
        <form onSubmit={handleSendReport} className="space-y-2 text-xs">
          <label className="font-bold uppercase tracking-wider text-slate-500 text-[10px] flex items-center justify-between">
            <span>Send Ground Situation Report:</span>
            {reportSubmitted && (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Transmitted to HQ
              </span>
            )}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={fieldReportText}
              onChange={(e) => setFieldReportText(e.target.value)}
              placeholder="e.g. Waterlogged 2 feet, crane required..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Emergency SOS Button */}
        <button
          onClick={() => {
            setSosTriggered(true);
            alert('🚨 EMERGENCY SOS BROADCAST: Officer ' + officer.name + ' requested emergency assistance at ' + (currentJunction?.name || 'Sitabuldi'));
          }}
          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
            sosTriggered
              ? 'bg-red-600 text-white animate-ping'
              : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-600" />
          EMERGENCY BACKUP SOS (OFFICER IN DISTRESS)
        </button>

        {/* Phone Bottom Bar Indicator */}
        <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
      </div>
    </div>
  );
};
