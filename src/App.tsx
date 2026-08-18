import React, { useState, useEffect } from 'react';
import {
  Junction,
  PoliceOfficer,
  Incident,
  DeploymentRecommendation,
  UserRole,
  UserProfile,
} from './types';
import {
  INITIAL_JUNCTIONS,
  INITIAL_OFFICERS,
  INITIAL_INCIDENTS,
} from './data/nagpurData';
import { DEFAULT_USER, DEMO_PERSONAS } from './data/personas';
import {
  calculateJunctionRisk,
  recalculateAllJunctions,
} from './services/riskEngine';
import {
  generateRecommendations,
  applyDeployment,
  applyOverride,
} from './services/deploymentOptimizer';

// Components
import { LoginPage } from './components/auth/LoginPage';
import { TopHeader } from './components/common/TopHeader';
import { Sidebar, TabId } from './components/common/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { NagpurRiskMap } from './components/map/NagpurRiskMap';
import { JunctionDetailModal } from './components/map/JunctionDetailModal';
import { ExplainableAiModal } from './components/ai/ExplainableAiModal';
import { HumanOverrideModal } from './components/ai/HumanOverrideModal';
import { RecommendationsView } from './components/ai/RecommendationsView';
import { IncidentManagement } from './components/incidents/IncidentManagement';
import { PoliceCommandCenter } from './components/officers/PoliceCommandCenter';
import { GreenCorridorView } from './components/corridor/GreenCorridorView';
import { TrafficSignalsView } from './components/signals/TrafficSignalsView';
import { ViolationsView } from './components/violations/ViolationsView';
import { AuditReportsView } from './components/reports/AuditReportsView';
import { CitizenPortalView } from './components/citizen/CitizenPortalView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { DynamicRedeploymentSimulation } from './components/simulation/DynamicRedeploymentSimulation';
import { MobileFieldOfficerView } from './components/mobile/MobileFieldOfficerView';
import { SystemHealthView } from './components/system/SystemHealthView';
import { ArchitectureImpactView } from './components/system/ArchitectureImpactView';

import {
  Sparkles,
  Menu,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  // Authentication State (Default logged in with Municipal Commissioner / Government Admin matching Image 2, with full login toggle)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEFAULT_USER);

  // Master State
  const [junctions, setJunctions] = useState<Junction[]>(() =>
    recalculateAllJunctions(INITIAL_JUNCTIONS)
  );
  const [officers, setOfficers] = useState<PoliceOfficer[]>(INITIAL_OFFICERS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [recommendations, setRecommendations] = useState<DeploymentRecommendation[]>([]);

  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Modals & Selection State
  const [selectedJunction, setSelectedJunction] = useState<Junction | null>(null);
  const [explainableJunction, setExplainableJunction] = useState<Junction | null>(null);
  const [overrideRecommendation, setOverrideRecommendation] =
    useState<DeploymentRecommendation | null>(null);

  // Simulation State
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [isSimulationAutoPlaying, setIsSimulationAutoPlaying] = useState<boolean>(false);
  const [isLiveFeedActive, setIsLiveFeedActive] = useState<boolean>(true);
  const [lastUpdatedSec, setLastUpdatedSec] = useState<number>(27);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Re-generate recommendations whenever junctions or officers change
  useEffect(() => {
    const recs = generateRecommendations(junctions, officers);
    setRecommendations((prev) => {
      const past = prev.filter((p) => p.status !== 'PENDING');
      return [...recs, ...past];
    });
  }, [junctions, officers]);

  // Periodic subtle live sensor updates
  useEffect(() => {
    if (!isLiveFeedActive) return;

    const interval = setInterval(() => {
      setLastUpdatedSec((prev) => (prev >= 60 ? 1 : prev + 2));

      setJunctions((prevJunctions) =>
        prevJunctions.map((j) => {
          if (simulationStep > 0 && (j.id === 'J-01' || j.id === 'JNC-01')) return j;

          const deltaVehicles = Math.floor(Math.random() * 9) - 4;
          const newCount = Math.max(800, j.vehicleCountPerHour + deltaVehicles);
          const deltaSpeed = Math.floor(Math.random() * 3) - 1;
          const newSpeed = Math.max(8, Math.min(65, j.avgSpeedKmph + deltaSpeed));

          return calculateJunctionRisk({
            ...j,
            vehicleCountPerHour: newCount,
            avgSpeedKmph: newSpeed,
            lastUpdated: 'Just now',
          });
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveFeedActive, simulationStep]);

  // Handlers for Simulation
  const handleTriggerSimulationStep = (step: number) => {
    setSimulationStep(step);

    setJunctions((prevJunctions) => {
      return prevJunctions.map((j) => {
        if (j.id === 'J-01' || j.id === 'JNC-01' || j.name.toLowerCase().includes('sitabuldi')) {
          if (step === 0) {
            return calculateJunctionRisk({
              ...j,
              riskScore: 48,
              riskCategory: 'MEDIUM',
              trafficCondition: 'Moderate',
              avgSpeedKmph: 28,
              vehicleCountPerHour: 3400,
              weatherCondition: 'Clear',
              accidentRisk: 35,
              congestionRisk: 42,
              weatherImpact: 20,
              violationRisk: 40,
              assignedOfficerIds: ['OFF-101'],
              requiredOfficers: 2,
              activeIncidentIds: [],
              hasCoverageGap: false,
              policeCoverage: 'ADEQUATE',
            });
          } else if (step === 1) {
            return calculateJunctionRisk({
              ...j,
              accidentRisk: 85,
              activeIncidentIds: ['INC-SIM-01'],
              trafficCondition: 'Heavy',
              avgSpeedKmph: 18,
            });
          } else if (step === 2) {
            return calculateJunctionRisk({
              ...j,
              weatherCondition: 'Rainy',
              weatherImpact: 80,
              avgSpeedKmph: 14,
            });
          } else if (step === 3) {
            return calculateJunctionRisk({
              ...j,
              congestionRisk: 92,
              trafficCondition: 'Gridlock',
              avgSpeedKmph: 6,
              vehicleCountPerHour: 4800,
            });
          } else if (step >= 4 && step < 8) {
            return calculateJunctionRisk({
              ...j,
              riskScore: 87,
              riskCategory: 'CRITICAL',
              accidentRisk: 88,
              congestionRisk: 95,
              weatherImpact: 78,
              violationRisk: 65,
              requiredOfficers: 3,
              assignedOfficerIds: ['OFF-101'],
              hasCoverageGap: true,
              policeCoverage: 'INSUFFICIENT',
            });
          } else if (step >= 8) {
            return calculateJunctionRisk({
              ...j,
              riskScore: 44,
              riskCategory: 'LOW',
              accidentRisk: 28,
              congestionRisk: 34,
              trafficCondition: 'Moderate',
              avgSpeedKmph: 26,
              requiredOfficers: 3,
              assignedOfficerIds: ['OFF-101', 'OFF-017', 'OFF-024'],
              hasCoverageGap: false,
              policeCoverage: 'ADEQUATE',
            });
          }
        }
        return j;
      });
    });

    if (step >= 8) {
      setOfficers((prevOfficers) =>
        prevOfficers.map((o) => {
          if (o.id === 'OFF-017' || o.id === 'OFF-024' || o.badgeNumber === 'O-17' || o.badgeNumber === 'O-24') {
            return {
              ...o,
              status: 'DEPLOYED',
              assignedJunctionId: 'JNC-01',
              assignedJunctionName: 'Sitabuldi Interchange Square',
            };
          }
          return o;
        })
      );
      showToast('⚡ AI Dynamic Redeployment Executed: Officers O-17 & O-24 on scene at Sitabuldi!');
    }
  };

  const handleResetSimulation = () => {
    setSimulationStep(0);
    setIsSimulationAutoPlaying(false);
    setJunctions(recalculateAllJunctions(INITIAL_JUNCTIONS));
    setOfficers(INITIAL_OFFICERS);
    setIncidents(INITIAL_INCIDENTS);
    showToast('Simulation reset to baseline patrol state.');
  };

  // Handlers for Deploying Recommendations
  const handleAcceptDeployment = (rec: DeploymentRecommendation) => {
    const { updatedJunctions, updatedOfficers } = applyDeployment(
      rec,
      junctions,
      officers
    );
    setJunctions(updatedJunctions);
    setOfficers(updatedOfficers);

    setRecommendations((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, status: 'ACCEPTED' } : r))
    );

    showToast(
      `✓ Deployment Approved: ${rec.recommendedOfficerIds.length} officers dispatched to ${rec.junctionName}!`
    );

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
  };

  const handleConfirmOverride = (
    recId: string,
    overrideOfficerIds: string[],
    overrideJunctionId: string,
    overrideReason: string
  ) => {
    const rec = recommendations.find((r) => r.id === recId);
    if (!rec) return;

    const { updatedJunctions, updatedOfficers } = applyOverride(
      rec,
      overrideOfficerIds,
      overrideJunctionId,
      overrideReason,
      junctions,
      officers
    );

    setJunctions(updatedJunctions);
    setOfficers(updatedOfficers);

    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === recId
          ? {
              ...r,
              status: 'OVERRIDDEN',
              overrideDetails: {
                overriddenBy: currentUser?.name || 'Supervisor S-04',
                overriddenAt: new Date().toLocaleTimeString(),
                overrideReason,
                selectedOfficerIds: overrideOfficerIds,
                selectedJunctionId: overrideJunctionId,
              },
            }
          : r
      )
    );

    showToast(`⚠️ Manual Supervisor Override Logged: "${overrideReason}"`);
  };

  // Incident Lifecycle Handlers
  const handleAcknowledgeIncident = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId ? { ...i, status: 'IN_PROGRESS' } : i
      )
    );
    showToast(`Incident ${incidentId} marked as ACKNOWLEDGED / IN PROGRESS.`);
  };

  const handleAssignOfficerToIncident = (
    incidentId: string,
    officerId: string
  ) => {
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId
          ? {
              ...i,
              status: 'IN_PROGRESS',
              assignedOfficerIds: [...i.assignedOfficerIds, officerId],
            }
          : i
      )
    );

    const officer = officers.find((o) => o.id === officerId);
    setOfficers((prev) =>
      prev.map((o) =>
        o.id === officerId ? { ...o, status: 'DEPLOYED' } : o
      )
    );

    showToast(`Officer ${officer?.badgeNumber || officerId} assigned to incident!`);
  };

  const handleResolveIncident = (incidentId: string) => {
    const inc = incidents.find((i) => i.id === incidentId);
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId ? { ...i, status: 'RESOLVED' } : i
      )
    );

    if (inc) {
      setJunctions((prev) =>
        prev.map((j) => {
          if (j.id === inc.junctionId) {
            return calculateJunctionRisk({
              ...j,
              accidentRisk: Math.max(15, j.accidentRisk - 35),
              activeIncidentIds: j.activeIncidentIds.filter((id) => id !== incidentId),
            });
          }
          return j;
        })
      );
    }

    showToast(`✓ Incident ${incidentId} resolved and cleared!`);
  };

  const handleCreateIncident = (
    newInc: Omit<Incident, 'id' | 'timestamp' | 'timeAgo'>
  ) => {
    const createdIncident: Incident = {
      ...newInc,
      id: `INC-SIM-0${String(incidents.length + 68).padStart(2, '0')}`,
      timestamp: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      timeAgo: 'Just now',
    };

    setIncidents((prev) => [createdIncident, ...prev]);

    setJunctions((prev) =>
      prev.map((j) => {
        if (j.id === createdIncident.junctionId) {
          const elevAccident =
            createdIncident.severity === 'CRITICAL' ? 88 : 70;
          return calculateJunctionRisk({
            ...j,
            accidentRisk: elevAccident,
            trafficCondition: 'Heavy',
            activeIncidentIds: [...j.activeIncidentIds, createdIncident.id],
            hasCoverageGap: true,
          });
        }
        return j;
      })
    );

    showToast(`🚨 New Incident Reported at ${createdIncident.junctionName}! Risk updated.`);
  };

  // Officer Management Handlers
  const handleDeployOfficerToJunction = (
    officerId: string,
    junctionId: string
  ) => {
    const junction = junctions.find((j) => j.id === junctionId);
    const officer = officers.find((o) => o.id === officerId);

    setOfficers((prev) =>
      prev.map((o) =>
        o.id === officerId
          ? {
              ...o,
              status: 'DEPLOYED',
              assignedJunctionId: junctionId,
              assignedJunctionName: junction?.name || 'Assigned Junction',
            }
          : o
      )
    );

    setJunctions((prev) =>
      prev.map((j) => {
        if (j.id === junctionId) {
          const newOfficers = Array.from(
            new Set([...j.assignedOfficerIds, officerId])
          );
          return calculateJunctionRisk({
            ...j,
            assignedOfficerIds: newOfficers,
            hasCoverageGap: newOfficers.length < j.requiredOfficers,
            policeCoverage:
              newOfficers.length >= j.requiredOfficers
                ? 'ADEQUATE'
                : 'INSUFFICIENT',
          });
        }
        return j;
      })
    );

    showToast(
      `Officer ${officer?.badgeNumber} dispatched to ${junction?.name}!`
    );
  };

  const handleUpdateOfficerStatus = (
    officerId: string,
    status: PoliceOfficer['status']
  ) => {
    setOfficers((prev) =>
      prev.map((o) => (o.id === officerId ? { ...o, status } : o))
    );
    showToast(`Officer status updated to ${status}.`);
  };

  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED');

  const activeSimulationPath =
    simulationStep === 8
      ? {
          from: { lat: 21.154, lng: 79.072, name: 'Civil Lines' },
          to: { lat: 21.1466, lng: 79.0825, name: 'Sitabuldi Interchange' },
          officerBadge: 'O-17',
          progress: 0.75,
        }
      : null;

  // If user is not logged in, render the Login Page matching Image 1
  if (!currentUser) {
    return (
      <LoginPage
        onLogin={(user) => {
          setCurrentUser(user);
          showToast(`Authenticated as ${user.name} (${user.roleTitle})`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Toast Banner Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 p-3.5 rounded-xl bg-white border border-blue-300 text-blue-950 text-xs font-semibold shadow-xl flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header matching Image 2 */}
      <TopHeader
        currentUser={currentUser}
        onSwitchUser={(user) => {
          setCurrentUser(user);
          showToast(`Switched active persona to ${user.name}`);
        }}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Signed out of I²TMS Command Center');
        }}
        isLiveSimulationActive={isLiveFeedActive}
        onToggleLiveSimulation={() => setIsLiveFeedActive(!isLiveFeedActive)}
        onOpenReportIncident={() => setActiveTab('incidents')}
        activeIncidentsCount={activeIncidents.length}
        lastUpdatedSeconds={lastUpdatedSec}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex w-full">
        {/* Responsive Sidebar Navigation matching Image 2 */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentRole={currentUser.role}
          activeIncidentsCount={activeIncidents.length}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-5 overflow-x-hidden max-w-[1680px] mx-auto w-full space-y-4">
          {/* Mobile Menu Toggle Bar */}
          <div className="lg:hidden flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-2 text-blue-600 font-bold"
            >
              <Menu className="w-4 h-4" /> Navigation Menu
            </button>
            <span className="font-mono text-slate-500 uppercase font-semibold">
              Tab: {activeTab}
            </span>
          </div>

          {/* TAB 1: OVERVIEW DASHBOARD matching Image 2 */}
          {activeTab === 'overview' && (
            <OverviewDashboard
              junctions={junctions}
              officers={officers}
              incidents={incidents}
              recommendations={recommendations}
              selectedJunction={selectedJunction}
              onSelectJunction={setSelectedJunction}
              onOpenExplainableAi={setExplainableJunction}
              onNavigateToIncidents={() => setActiveTab('incidents')}
              onAcknowledgeIncident={handleAcknowledgeIncident}
              onResolveIncident={handleResolveIncident}
              onRefreshData={() => {
                setLastUpdatedSec(1);
                showToast('Refreshed telemetry feeds from Nagpur ICCC servers.');
              }}
              activeSimulationPath={activeSimulationPath}
            />
          )}

          {/* TAB 2: LIVE TRAFFIC */}
          {activeTab === 'live-traffic' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Live Traffic & Arterial Corridors GIS</h3>
                  <p className="text-xs text-slate-500">Continuous telemetry of Wardha Rd, Central Ave, Amravati Rd, and Ring Road.</p>
                </div>
              </div>
              <NagpurRiskMap
                junctions={junctions}
                officers={officers}
                incidents={incidents}
                selectedJunction={selectedJunction}
                onSelectJunction={setSelectedJunction}
                onOpenExplainableAi={setExplainableJunction}
                activeSimulationPath={activeSimulationPath}
              />
            </div>
          )}

          {/* TAB 3: INCIDENTS CAD */}
          {activeTab === 'incidents' && (
            <div className="animate-fade-in">
              <IncidentManagement
                incidents={incidents}
                junctions={junctions}
                officers={officers}
                onAcknowledgeIncident={handleAcknowledgeIncident}
                onAssignOfficer={handleAssignOfficerToIncident}
                onResolveIncident={handleResolveIncident}
                onCreateIncident={handleCreateIncident}
                onFocusJunction={(jId) => {
                  const junc = junctions.find((j) => j.id === jId);
                  if (junc) {
                    setSelectedJunction(junc);
                    setActiveTab('heatmap');
                  }
                }}
              />
            </div>
          )}

          {/* TAB 4: RISK HEATMAP & GIS */}
          {activeTab === 'heatmap' && (
            <div className="space-y-4 animate-fade-in">
              <NagpurRiskMap
                junctions={junctions}
                officers={officers}
                incidents={incidents}
                selectedJunction={selectedJunction}
                onSelectJunction={setSelectedJunction}
                onOpenExplainableAi={setExplainableJunction}
                activeSimulationPath={activeSimulationPath}
              />
            </div>
          )}

          {/* TAB 5: GREEN CORRIDOR CAD 108 */}
          {activeTab === 'green-corridor' && (
            <GreenCorridorView />
          )}

          {/* TAB 6: DEPLOYMENTS (POLICE OFFICERS) */}
          {activeTab === 'officers' && (
            <div className="animate-fade-in">
              <PoliceCommandCenter
                officers={officers}
                junctions={junctions}
                onDeployOfficerToJunction={handleDeployOfficerToJunction}
                onUpdateOfficerStatus={handleUpdateOfficerStatus}
                onFocusJunction={(jId) => {
                  const junc = junctions.find((j) => j.id === jId);
                  if (junc) {
                    setSelectedJunction(junc);
                    setActiveTab('heatmap');
                  }
                }}
              />
            </div>
          )}

          {/* TAB 7: SIGNALS ATCS */}
          {activeTab === 'signals' && (
            <TrafficSignalsView />
          )}

          {/* TAB 8: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="animate-fade-in">
              <AnalyticsView />
            </div>
          )}

          {/* TAB 9: VIOLATIONS & E-CHALLAN */}
          {activeTab === 'violations' && (
            <ViolationsView />
          )}

          {/* TAB 10: REPORTS */}
          {activeTab === 'reports' && (
            <AuditReportsView />
          )}

          {/* TAB 11: SYSTEM HEALTH */}
          {activeTab === 'system-health' && (
            <div className="animate-fade-in">
              <SystemHealthView
                junctions={junctions}
                officers={officers}
                incidents={incidents}
              />
            </div>
          )}

          {/* TAB 12: SIMULATION LAB (19-STEP) */}
          {activeTab === 'simulation' && (
            <div className="space-y-6 animate-fade-in">
              <DynamicRedeploymentSimulation
                junctions={junctions}
                officers={officers}
                incidents={incidents}
                onTriggerSimulationStep={handleTriggerSimulationStep}
                onResetSimulation={handleResetSimulation}
                currentStep={simulationStep}
                isAutoPlaying={isSimulationAutoPlaying}
                setIsAutoPlaying={setIsSimulationAutoPlaying}
                onAcceptDeployment={handleAcceptDeployment}
              />

              <NagpurRiskMap
                junctions={junctions}
                officers={officers}
                incidents={incidents}
                selectedJunction={selectedJunction}
                onSelectJunction={setSelectedJunction}
                onOpenExplainableAi={setExplainableJunction}
                activeSimulationPath={activeSimulationPath}
              />
            </div>
          )}

          {/* TAB 13: POLICE COMMAND CENTER */}
          {activeTab === 'command-center' && (
            <div className="animate-fade-in">
              <PoliceCommandCenter
                officers={officers}
                junctions={junctions}
                onDeployOfficerToJunction={handleDeployOfficerToJunction}
                onUpdateOfficerStatus={handleUpdateOfficerStatus}
                onFocusJunction={(jId) => {
                  const junc = junctions.find((j) => j.id === jId);
                  if (junc) {
                    setSelectedJunction(junc);
                    setActiveTab('heatmap');
                  }
                }}
              />
            </div>
          )}

          {/* TAB 14: CITIZEN PORTAL & GRIEVANCES */}
          {activeTab === 'citizen-portal' && (
            <CitizenPortalView />
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. Junction Inspector Modal */}
      <JunctionDetailModal
        junction={selectedJunction}
        officers={officers}
        incidents={incidents}
        onClose={() => setSelectedJunction(null)}
        onOpenExplainableAi={(junc) => {
          setSelectedJunction(null);
          setExplainableJunction(junc);
        }}
        onOpenDeploy={(junc) => {
          setSelectedJunction(null);
          setActiveTab('officers');
        }}
        onSelectIncident={(inc) => {
          setSelectedJunction(null);
          setActiveTab('incidents');
        }}
      />

      {/* 2. Explainable AI Risk Decomposition Modal */}
      <ExplainableAiModal
        junction={explainableJunction}
        onClose={() => setExplainableJunction(null)}
        onDeployRecommendation={(junc) => {
          setExplainableJunction(null);
          setActiveTab('overview');
        }}
      />

      {/* 3. Human Supervisor Override Modal */}
      <HumanOverrideModal
        recommendation={overrideRecommendation}
        junctions={junctions}
        officers={officers}
        onClose={() => setOverrideRecommendation(null)}
        onConfirmOverride={handleConfirmOverride}
      />
    </div>
  );
}

export default App;
