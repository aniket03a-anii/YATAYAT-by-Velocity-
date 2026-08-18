import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { DEMO_PERSONAS } from '../../data/personas';
import {
  Shield,
  Radio,
  Smartphone,
  Building2,
  User,
  Settings,
  Globe,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Terminal,
  CheckCircle2,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'operator' | 'citizen'>('operator');
  const [email, setEmail] = useState('operator@nagpurpolice.gov.in');
  const [password, setPassword] = useState('DemoPassword2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');

  const getPersonaIcon = (iconType: string) => {
    switch (iconType) {
      case 'shield':
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4" />
          </div>
        );
      case 'radio':
        return (
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4" />
          </div>
        );
      case 'smartphone':
        return (
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
        );
      case 'building':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
        );
      case 'user':
        return (
          <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
        );
      case 'settings':
        return (
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
            <Settings className="w-4 h-4" />
          </div>
        );
      case 'globe':
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4" />
          </div>
        );
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Find matching persona or default to Government Admin
      const matched = DEMO_PERSONAS.find(
        (p) => p.email.toLowerCase() === email.toLowerCase()
      ) || DEMO_PERSONAS[3];

      setIsLoading(false);
      onLogin(matched);
    }, 450);
  };

  const handleSelectPersona = (persona: UserProfile) => {
    setEmail(persona.email);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(persona);
    }, 300);
  };

  const handleCitizenRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const citizenUser: UserProfile = {
        id: 'user-citizen-custom',
        name: citizenName || 'Nagpur Resident Citizen',
        email: email || 'citizen@nagpur.gov.in',
        role: 'CITIZEN',
        roleTitle: 'Public Citizen',
        roleSubtitle: 'Citizen traffic & grievance portal',
        department: 'Citizen Public Services',
        badgeNumber: citizenPhone ? `MOB-${citizenPhone.slice(-4)}` : 'CIT-REG',
      };
      setIsLoading(false);
      onLogin(citizenUser);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] flex flex-col justify-between items-center font-sans antialiased text-slate-900">
      {/* Top Dark Banner matching Screenshot 084018 */}
      <div className="w-full bg-[#111827] text-slate-300 text-[11px] px-4 sm:px-6 py-2 flex items-center justify-between border-b border-slate-800 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-slate-200 uppercase tracking-wide">
            GOVERNMENT OF MAHARASHTRA | NAGPUR SMART & CONNECTED CITY
          </span>
        </div>
        <div className="hidden sm:block text-slate-400 text-[10px] uppercase font-bold tracking-wider">
          INTELLIGENT INTEGRATED TRAFFIC MANAGEMENT SYSTEM (I²TMS)
        </div>
      </div>

      <div className="w-full flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 py-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
          {/* LEFT COLUMN: Operator / Citizen Sign-In Form */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 space-y-6">
            <div className="space-y-6">
              {/* Header with I2TMS Logo & Badge */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <Shield className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                      I<sup className="text-sm font-bold text-blue-600">2</sup>TMS
                    </h1>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-mono font-bold uppercase tracking-wider">
                      NAGPUR ICCC
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Command Center Authentication Gateway
                  </p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('operator')}
                  className={`pb-3 text-xs font-bold transition-all relative mr-6 ${
                    activeTab === 'operator'
                      ? 'text-blue-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Operator Sign In
                  {activeTab === 'operator' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('citizen')}
                  className={`pb-3 text-xs font-bold transition-all relative ${
                    activeTab === 'citizen'
                      ? 'text-blue-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Citizen Self-Registration
                  {activeTab === 'citizen' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              </div>

              {/* Tab Form 1: Operator Sign In */}
              {activeTab === 'operator' ? (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Official Email / Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="operator@nagpurpolice.gov.in"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Security Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-75 mt-2"
                  >
                    <Lock className="w-4 h-4" />
                    {isLoading ? 'Authenticating Session...' : 'Authenticate Session'}
                  </button>
                </form>
              ) : (
                /* Tab Form 2: Citizen Self-Registration */
                <form onSubmit={handleCitizenRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Mobile Number / OTP
                    </label>
                    <input
                      type="tel"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-75 mt-2"
                  >
                    <Globe className="w-4 h-4" />
                    {isLoading ? 'Entering Citizen Portal...' : 'Access Citizen Traffic Portal'}
                  </button>
                </form>
              )}
            </div>

            {/* Bottom Meta Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Security Standard: TLS 1.3 | RBAC 2.0</span>
              <span>Node: NGP-ICCC-SRV-01</span>
            </div>
          </div>

          {/* RIGHT COLUMN: 1-Click Demo Personas */}
          <div className="lg:col-span-6 bg-slate-50/70 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Personas Title Header */}
              <div>
                <div className="flex items-center gap-2 text-blue-700 font-extrabold text-xs tracking-wider uppercase font-mono">
                  <Terminal className="w-4 h-4" />
                  <span>1-CLICK DEMO PERSONAS</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Click any role to test authentic database-backed authentication and role-specific permissions:
                </p>
              </div>

              {/* Personas List */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {DEMO_PERSONAS.map((persona) => (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => handleSelectPersona(persona)}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-left flex items-center justify-between group cursor-pointer shadow-2xs hover:shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      {getPersonaIcon(persona.iconType)}
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                          {persona.roleTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 group-hover:text-slate-600 truncate max-w-[220px] sm:max-w-[280px]">
                          {persona.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 pl-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Demo Password Box */}
            <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-200/70 text-xs">
              <div className="text-[10px] font-extrabold font-mono text-sky-800 uppercase tracking-wider">
                DEMO PASSWORD:
              </div>
              <div className="text-xs font-mono font-bold text-sky-950 mt-0.5">
                DemoPassword2026!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Bottom Footer */}
      <footer className="text-center text-[11px] text-slate-500 py-2">
        Nagpur Municipal Corporation & Traffic Police Command • Authorized Personnel Only
      </footer>
    </div>
  );
};
