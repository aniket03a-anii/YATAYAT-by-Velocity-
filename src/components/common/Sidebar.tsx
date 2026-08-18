import React from 'react';
import { UserRole, UserProfile } from '../../types';
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  Flame,
  Ambulance,
  Shield,
  Sliders,
  BarChart3,
  FileText,
  FileSpreadsheet,
  Cpu,
  PlayCircle,
  ShieldCheck,
  Globe,
  Radio,
  Smartphone,
  LogOut,
  User,
} from 'lucide-react';

export type TabId =
  | 'overview'
  | 'live-traffic'
  | 'incidents'
  | 'heatmap'
  | 'green-corridor'
  | 'officers'
  | 'signals'
  | 'analytics'
  | 'violations'
  | 'reports'
  | 'system-health'
  | 'simulation'
  | 'command-center'
  | 'citizen-portal';

interface SidebarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  currentRole: UserRole;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  activeIncidentsCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  currentUser,
  onLogout,
  activeIncidentsCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const primaryNavItems: Array<{
    id: TabId;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeColor?: string;
  }> = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'live-traffic',
      label: 'Live Traffic',
      icon: <Activity className="w-4 h-4" />,
    },
    {
      id: 'incidents',
      label: 'Incidents',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: 'CAD',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    },
    {
      id: 'heatmap',
      label: 'Risk Map',
      icon: <Flame className="w-4 h-4" />,
    },
    {
      id: 'green-corridor',
      label: 'Green Corridor',
      icon: <Ambulance className="w-4 h-4" />,
      badge: 'CAD 108',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    },
    {
      id: 'officers',
      label: 'Deployments',
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: 'signals',
      label: 'Signals',
      icon: <Sliders className="w-4 h-4" />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'violations',
      label: 'Violations',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileSpreadsheet className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="main-sidebar"
        className={`fixed lg:sticky top-0 lg:top-[90px] left-0 z-40 w-60 h-full lg:h-[calc(100vh-90px)] bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-3 space-y-4">
          {/* Section Header */}
          <div className="px-3 pt-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            OPERATIONS CONTROL
          </div>

          {/* Primary Navigation Group */}
          <div className="space-y-1">
            {primaryNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-tab-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${
                        item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* SIMULATION ENGINE SECTION */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              SIMULATION ENGINE
            </div>
            <button
              id="sidebar-tab-simulation"
              onClick={() => {
                onSelectTab('simulation');
                onCloseMobile();
              }}
              className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                activeTab === 'simulation'
                  ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={activeTab === 'simulation' ? 'text-blue-600' : 'text-amber-500'}>
                  <PlayCircle className="w-4 h-4" />
                </span>
                <span>Simulation Lab</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                19-Step
              </span>
            </button>
          </div>

          {/* USER INTERFACES SECTION */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              USER INTERFACES
            </div>
            <button
              id="sidebar-tab-command-center"
              onClick={() => {
                onSelectTab('command-center');
                onCloseMobile();
              }}
              className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                activeTab === 'command-center'
                  ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={activeTab === 'command-center' ? 'text-blue-600' : 'text-slate-400'}>
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <span>Police Command Center</span>
              </div>
            </button>

            <button
              id="sidebar-tab-citizen-portal"
              onClick={() => {
                onSelectTab('citizen-portal');
                onCloseMobile();
              }}
              className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                activeTab === 'citizen-portal'
                  ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={activeTab === 'citizen-portal' ? 'text-blue-600' : 'text-slate-400'}>
                  <Globe className="w-4 h-4" />
                </span>
                <span>Citizen Portal</span>
              </div>
            </button>
          </div>
        </div>

        {/* Sidebar Footer User Card matching Screenshot */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-2">
          {currentUser ? (
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                  {currentUser.name}
                </div>
                <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-mono font-bold uppercase truncate max-w-[80px]">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>Badge: {currentUser.badgeNumber || 'NTP-001'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full mt-1 pt-1.5 border-t border-slate-100 text-[10px] font-bold text-rose-600 hover:text-rose-700 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out Session</span>
                </button>
              )}
            </div>
          ) : (
            <div className="text-[10px] text-slate-400 font-mono text-center">
              Nagpur ICCC Telemetry v2.6
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
