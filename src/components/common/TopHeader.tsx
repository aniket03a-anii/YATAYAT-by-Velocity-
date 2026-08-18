import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../../types';
import { DEMO_PERSONAS } from '../../data/personas';
import {
  Shield,
  Clock,
  Radio,
  Building2,
  Smartphone,
  Users,
  LogOut,
  ChevronDown,
  User,
  Settings,
  Globe,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface TopHeaderProps {
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
  onLogout: () => void;
  isLiveSimulationActive: boolean;
  onToggleLiveSimulation: () => void;
  onOpenReportIncident: () => void;
  activeIncidentsCount: number;
  lastUpdatedSeconds: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  onSwitchUser,
  onLogout,
  isLiveSimulationActive,
  onToggleLiveSimulation,
  onOpenReportIncident,
  activeIncidentsCount,
  lastUpdatedSeconds,
}) => {
  const [timeString, setTimeString] = useState<string>('01:42:06 IST');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setTimeString(`${hours}:${mins}:${secs} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'POLICE_COMMISSIONER':
        return 'POLICE COMMISSIONER';
      case 'POLICE_SUPERVISOR':
        return 'POLICE SUPERVISOR';
      case 'FIELD_OFFICER':
        return 'FIELD OFFICER';
      case 'GOVERNMENT_ADMIN':
        return 'GOVERNMENT ADMIN';
      case 'GOVERNMENT_OFFICER':
        return 'GOVERNMENT OFFICER';
      case 'SYSTEM_ADMIN':
        return 'SYSTEM ADMIN';
      case 'CITIZEN':
      default:
        return 'PUBLIC CITIZEN';
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full flex flex-col">
      {/* Top Dark Prototype Status Banner */}
      <div className="w-full bg-[#111827] text-slate-300 text-[11px] px-4 py-1.5 flex items-center justify-between border-b border-slate-800 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200">
            DEMO PROTOTYPE MODE: Intelligent Integrated Traffic Management System (I²TMS) — Nagpur Jurisdiction.
          </span>
        </div>
        <div className="hidden sm:block text-slate-400 text-[10px]">
          Govt. of Maharashtra / Smart City Project
        </div>
      </div>

      <header
        id="nagpur-top-header"
        className="w-full bg-white border-b border-slate-200 shadow-2xs text-slate-800"
      >
      <div className="w-full px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left Branding matching image: I2TMS NAGPUR tag & subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20 shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight text-slate-900 flex items-center">
                I<sup className="text-xs text-blue-600 font-bold">2</sup>TMS
              </h1>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-extrabold uppercase tracking-wider">
                NAGPUR
              </span>
            </div>
            <div className="text-[11px] text-slate-500 hidden sm:block">
              Intelligent Integrated Traffic Management System
            </div>
          </div>
        </div>

        {/* Center Pills matching image */}
        <div className="hidden md:flex items-center gap-2 text-xs font-medium">
          {/* Area Pill */}
          <div className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[11px]">
            <span className="text-slate-400 font-bold uppercase text-[9px] mr-1.5">AREA:</span>
            <span className="font-semibold text-slate-800">Nagpur Traffic Control (ICCC)</span>
          </div>

          {/* System Operational Pill */}
          <div className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SYSTEM OPERATIONAL</span>
          </div>

          {/* Digital Clock Pill */}
          <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{timeString}</span>
          </div>

          {/* Mode Pill */}
          <div className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1">
            <span>MODE: SIMULATION</span>
          </div>
        </div>

        {/* Right User Profile Chip matching image */}
        <div className="relative flex items-center gap-2">
          <button
            id="user-profile-button"
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] font-mono font-bold text-blue-700 leading-tight">
                {getRoleBadge(currentUser.role)}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown / Persona Switcher */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-12 z-50 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 space-y-2 animate-fade-in">
              <div className="px-2 py-1 border-b border-slate-100 pb-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  ACTIVE AUTHENTICATED SESSION
                </div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                <div className="text-[10px] text-blue-600 font-mono mt-0.5">
                  {currentUser.department}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-1 font-mono">
                  SWITCH PERSONA:
                </div>
                {DEMO_PERSONAS.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => {
                      onSwitchUser(persona);
                      setIsProfileMenuOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      persona.id === currentUser.id
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{persona.roleTitle}</span>
                    {persona.id === currentUser.id && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-200/60 text-blue-800 font-mono font-bold">
                        ACTIVE
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full px-2.5 py-2 rounded-lg text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Return to Gateway</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
    </div>
  );
};
