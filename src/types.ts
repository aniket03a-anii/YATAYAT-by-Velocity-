export type RiskCategory = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ACKNOWLEDGED';

export type IncidentType =
  | 'Accident'
  | 'Congestion'
  | 'Road Blockage'
  | 'Violation Hotspot'
  | 'Weather Hazard'
  | 'Special Event'
  | 'Signal Failure';

export type OfficerStatus = 'AVAILABLE' | 'DEPLOYED' | 'ON_BREAK' | 'OFF_DUTY';

export type UserRole =
  | 'POLICE_COMMISSIONER'
  | 'POLICE_SUPERVISOR'
  | 'FIELD_OFFICER'
  | 'GOVERNMENT_ADMIN'
  | 'GOVERNMENT_OFFICER'
  | 'SYSTEM_ADMIN'
  | 'CITIZEN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  roleSubtitle: string;
  department: string;
  badgeNumber?: string;
  avatarUrl?: string;
}

export type ZoneName = 'Central' | 'North' | 'South' | 'East' | 'West' | 'Outer Arc';

export interface ContributingFactor {
  name: string;
  weightPercent: number;
  score: number; // 0 - 100
  contributionPoints: number; // calculated added points
  description: string;
  impactLevel: 'High' | 'Medium' | 'Low';
}

export interface Junction {
  id: string;
  name: string;
  marathiName?: string;
  zone: ZoneName;
  lat: number;
  lng: number;
  mapX: number; // 0 - 1000 for SVG canvas
  mapY: number; // 0 - 700 for SVG canvas
  roads: string[];
  riskScore: number; // 0 - 100
  riskCategory: RiskCategory;
  accidentRisk: number; // 0 - 100
  congestionRisk: number; // 0 - 100
  violationRisk: number; // 0 - 100
  weatherImpact: number; // 0 - 100
  infrastructureRisk: number; // 0 - 100
  pedestrianDensity: number; // 0 - 100
  temporalFactor: number; // 0 - 100
  eventFactor: number; // 0 - 100
  policeCoverage: 'SUFFICIENT' | 'INSUFFICIENT' | 'UNMANNED';
  assignedOfficerIds: string[];
  requiredOfficers: number;
  hasCoverageGap: boolean;
  activeIncidentIds: string[];
  trafficCondition: 'Light' | 'Moderate' | 'Heavy' | 'Gridlock';
  weatherCondition: 'Clear' | 'Rainy' | 'Foggy' | 'High Heat';
  avgSpeedKmph: number;
  vehicleCountPerHour: number;
  cctvStatus: 'Active (Simulated)' | 'Maintenance' | 'Calibrating';
  cctvStreamId: string;
  lastUpdated: string;
  contributingFactors?: ContributingFactor[];
}

export interface PoliceOfficer {
  id: string;
  badgeNumber: string;
  name: string;
  rank: 'Inspector' | 'Sub-Inspector' | 'Head Constable' | 'Traffic Warden' | 'Beat Constable';
  status: OfficerStatus;
  zone: ZoneName;
  lat: number;
  lng: number;
  mapX: number;
  mapY: number;
  vehicleType: 'Motorcycle' | 'Patrol Car (PCR)' | 'Interceptor' | 'Scooter' | 'On Foot';
  vehicleNumber: string;
  phone: string;
  assignedJunctionId: string | null;
  etaMinutes: number;
  shiftTiming: string;
  incidentsHandledToday: number;
  performanceScore: number; // 1.0 - 5.0
  currentActivity?: string;
}

export interface Incident {
  id: string;
  junctionId: string;
  junctionName: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  detectionMethod: 'AI Computer Vision' | 'ANPR Alert' | 'Manual Citizen Report' | 'Traffic Sensor' | 'Field Officer';
  timestamp: string;
  timeAgo: string;
  description: string;
  lat: number;
  lng: number;
  mapX: number;
  mapY: number;
  assignedOfficerIds: string[];
  estimatedResolutionMinutes: number;
  imageUrl?: string;
  reportedBy?: string;
}

export interface DeploymentRecommendation {
  id: string;
  junctionId: string;
  junctionName: string;
  zone: ZoneName;
  riskScore: number;
  riskCategory: RiskCategory;
  priority: 'IMMEDIATE' | 'HIGH' | 'MODERATE';
  requiredOfficersCount: number;
  recommendedOfficerIds: string[];
  recommendedOfficers: PoliceOfficer[];
  estimatedEtaMinutes: number;
  expectedCoverageImprovementPercent: number;
  expectedRiskReductionPercent: number;
  reasons: string[];
  generatedAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'OVERRIDDEN' | 'REJECTED';
  overrideDetails?: {
    overriddenOfficerIds: string[];
    overrideReason: string;
    timestamp: string;
  };
}

export interface AccidentBlackspot {
  rank: number;
  locationName: string;
  zone: ZoneName;
  accidentCountPastYear: number;
  fatalities: number;
  severityScore: number;
  riskScore: number;
  primaryCauses: string[];
  recommendedInterventions: string[];
  gisClusterRadiusMeters: number;
}

export interface SystemHealthMetric {
  service: string;
  status: 'Healthy' | 'Operational' | 'Simulated' | 'Degraded';
  latencyMs: number;
  uptimePercent: number;
  dataRate: string;
  lastSync: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: 'DEPLOY' | 'OVERRIDE' | 'ACKNOWLEDGE' | 'RESOLVE' | 'CREATE_INCIDENT' | 'SIMULATION_TRIGGER';
  details: string;
  entityType: 'Junction' | 'Officer' | 'Incident' | 'System';
  entityId: string;
}

export interface TrafficSimulationState {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  stepName: string;
  stepDescription: string;
  highlightedJunctionId: string | null;
  targetOfficerIds: string[];
  beforeMetrics: {
    junctionName: string;
    riskScore: number;
    riskCategory: RiskCategory;
    officersCount: number;
    coverageStatus: string;
    avgResponseMinutes: number;
  };
  incidentMetrics: {
    incidentDescription: string;
    riskScore: number;
    riskCategory: RiskCategory;
    officersCount: number;
    coverageGap: boolean;
    avgResponseMinutes: number;
  };
  afterMetrics: {
    riskScore: number;
    riskCategory: RiskCategory;
    officersCount: number;
    coverageStatus: string;
    avgResponseMinutes: number;
  };
}
