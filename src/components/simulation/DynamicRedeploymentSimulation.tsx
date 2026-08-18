import React, { useState, useEffect } from 'react';
import {
  Junction,
  PoliceOfficer,
  Incident,
  DeploymentRecommendation,
} from '../../types';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  CheckCircle,
  AlertOctagon,
  CloudRain,
  Shield,
  Clock,
  ArrowRight,
  TrendingUp,
  Radio,
  Sparkles,
  Zap,
  Check,
  Ambulance,
  Sliders,
  Camera,
  Activity,
  Droplets,
  Truck,
  FileCheck,
  Layers,
  ChevronRight,
  Info,
  MapPin,
  Cpu,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface SimulationStepDetail {
  step: number; // 1 to 19
  phaseNumber: number;
  phaseName: string;
  title: string;
  subtitle: string;
  procedureCode: string;
  procedureTitle: string;
  procedureDetails: string;
  whatIsHappening: string;
  actionBadge: string;
  badgeVariant: 'neutral' | 'danger' | 'warning' | 'info' | 'success';
  telemetry: {
    riskScore: number;
    riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    avgSpeedKmph: number;
    queueLengthMeters: number;
    officersOnScene: string;
    signalStatus: string;
    weatherCondition: string;
    hospitalStatus: string;
  };
  aiReasoning: string;
  cadAction: string;
}

export const NINETEEN_SIMULATION_STEPS: SimulationStepDetail[] = [
  {
    step: 1,
    phaseNumber: 1,
    phaseName: 'Baseline City State & Monitoring',
    title: 'Baseline City Equilibrium',
    subtitle: 'Standard Patrol Deployment Across 5 Zones',
    procedureCode: 'SOP-PATROL-01',
    procedureTitle: 'Automated Corridor Telemetry Sweep',
    procedureDetails:
      'Continuous sensor polling of optical ANPR cameras, SCATS loop detectors, and GPS beacons across Wardha Road, Central Ave, Amravati Road, and Ring Road corridors.',
    whatIsHappening:
      'Traffic flows smoothly through Sitabuldi Interchange and Zero Mile Square at 34 km/h with 3,200 vehicles/hr. 1 beat constable (O-101) is on routine foot patrol. City status is green.',
    actionBadge: 'PATROL STABLE',
    badgeVariant: 'neutral',
    telemetry: {
      riskScore: 42,
      riskCategory: 'MEDIUM',
      avgSpeedKmph: 34,
      queueLengthMeters: 180,
      officersOnScene: '1 Officer (O-101)',
      signalStatus: 'ATCS Adaptive Cycle (90s)',
      weatherCondition: 'Clear Sky • 29°C',
      hospitalStatus: 'AIIMS & GMC (Normal)',
    },
    aiReasoning:
      'Baseline SHAP weights: Historical Blackspot (22%), Volume Density (14%), Weather (4%), Violations (2%). Composite score 42/100.',
    cadAction: 'Telemetry heartbeat OK. No active emergency tickets.',
  },
  {
    step: 2,
    phaseNumber: 1,
    phaseName: 'Incident Detection & Optical Telemetry',
    title: 'Automated Computer Vision Detection',
    subtitle: 'CAM-STB-02 Registers Sudden Obstruction',
    procedureCode: 'SOP-CV-ALERT-04',
    procedureTitle: 'Edge Optical Flow & Frame Differencing',
    procedureDetails:
      'Edge camera CAM-STB-02 executes frame-differencing and YOLO-v8 object detection on the Sitabuldi flyover approach, detecting stationary bounding boxes across lanes 1 and 2.',
    whatIsHappening:
      'Computer Vision camera detects two stationary vehicles and debris on the Wardha Road flyover ramp. Confidence score reaches 94.8%. Live snapshot and bounding boxes transmitted to ICCC triage feed.',
    actionBadge: 'CV ALERT (94.8%)',
    badgeVariant: 'warning',
    telemetry: {
      riskScore: 56,
      riskCategory: 'HIGH',
      avgSpeedKmph: 24,
      queueLengthMeters: 450,
      officersOnScene: '1 Officer (O-101)',
      signalStatus: 'ATCS Adaptive Cycle (90s)',
      weatherCondition: 'Clear Sky • 29°C',
      hospitalStatus: 'GMC Trauma Standby',
    },
    aiReasoning:
      'Sudden localized velocity drop of -29% across 2 lanes triggers automated collision probability model (P=0.948).',
    cadAction: 'Pending verification ticket auto-created in CAD feed.',
  },
  {
    step: 3,
    phaseNumber: 1,
    phaseName: 'Incident Detection & Optical Telemetry',
    title: 'Multi-Vehicle Collision Confirmed',
    subtitle: 'Bus & 2 Motorcycles Block 2 Lanes',
    procedureCode: 'SOP-CAD-CONFIRM',
    procedureTitle: 'Emergency Ticket Auto-Creation (INC-STB-919)',
    procedureDetails:
      'Dual-camera cross-triangulation confirms physical collision between City StarBus and two commuter two-wheelers. 2 out of 3 lanes blocked; oil spill detected on road surface.',
    whatIsHappening:
      'Commuters gather around the collision scene. Injured motorcycle rider requires immediate trauma care. Remaining single lane cannot handle incoming traffic of 4,100 vph.',
    actionBadge: 'COLLISION CONFIRMED',
    badgeVariant: 'danger',
    telemetry: {
      riskScore: 68,
      riskCategory: 'HIGH',
      avgSpeedKmph: 17,
      queueLengthMeters: 780,
      officersOnScene: '1 Officer (O-101)',
      signalStatus: 'Split Imbalance Detected',
      weatherCondition: 'Cloud Cover Increasing',
      hospitalStatus: '108 Ambulance Unit Alerted',
    },
    aiReasoning:
      'Accident severity component escalates from 22% to 65% in risk formula due to lane blockage and human casualty risk.',
    cadAction: 'Incident INC-STB-919 created with severity HIGH.',
  },
  {
    step: 4,
    phaseNumber: 1,
    phaseName: 'Incident Detection & Optical Telemetry',
    title: 'Monsoon Cloudburst Escalation',
    subtitle: 'Sudden 48 mm/hr Heavy Rainfall',
    procedureCode: 'SOP-METEOROLOGY-02',
    procedureTitle: 'Automated Weather Station (AWS) Ingestion',
    procedureDetails:
      'IMD automated rain sensor at Zero Mile logs a sharp rainfall spike of 48 mm/hr. Dynamic roadway friction coefficient drops from μ=0.75 to μ=0.32.',
    whatIsHappening:
      'Heavy rain hits Central Nagpur. Braking distances double; water starts pooling near metro pillar underpasses at Sitabuldi. Commuters slow down drastically, worsening tailback.',
    actionBadge: 'MONSOON 48mm/hr',
    badgeVariant: 'danger',
    telemetry: {
      riskScore: 78,
      riskCategory: 'HIGH',
      avgSpeedKmph: 11,
      queueLengthMeters: 1150,
      officersOnScene: '1 Officer (O-101)',
      signalStatus: 'Wet-Weather Timing Adjust',
      weatherCondition: 'Torrential Rain • 48mm/hr',
      hospitalStatus: 'Trauma Unit Alerted',
    },
    aiReasoning:
      'Weather impact multiplier jumps from 0.05 to 0.35 in risk calculation due to wet asphalt, low visibility, and underpass drainage risk.',
    cadAction: 'Weather advisory broadcast to all active patrol units.',
  },
  {
    step: 5,
    phaseNumber: 1,
    phaseName: 'Incident Detection & Optical Telemetry',
    title: 'Queue Spillback & Velocity Collapse',
    subtitle: 'Tailback Reaches 1.6 km (Variety Sq)',
    procedureCode: 'SOP-ATCS-MONITOR',
    procedureTitle: 'Degree of Saturation (DS > 1.25) Trigger',
    procedureDetails:
      'SCATS inductive loops report Degree of Saturation exceeding 1.25 on Wardha Road approach. Shockwave propagation calculated at 420 meters every 3 minutes.',
    whatIsHappening:
      'Vehicular speed collapses to 5.8 km/h. Traffic jam stretches backwards through Variety Square, Maharajbagh, and begins backing onto Amravati Road junction.',
    actionBadge: 'GRIDLOCK SPILLBACK',
    badgeVariant: 'danger',
    telemetry: {
      riskScore: 84,
      riskCategory: 'CRITICAL',
      avgSpeedKmph: 5.8,
      queueLengthMeters: 1600,
      officersOnScene: '1 Officer (O-101)',
      signalStatus: 'Cycle Saturation Exceeded',
      weatherCondition: 'Heavy Rain • 48mm/hr',
      hospitalStatus: 'GMC Trauma 4 Beds Ready',
    },
    aiReasoning:
      'Congestion Risk sub-score reaches 94/100. Upstream secondary collision risk spikes by +340%.',
    cadAction: 'Traffic Control Room sirens activated on Central Desk.',
  },
  {
    step: 6,
    phaseNumber: 2,
    phaseName: 'AI Risk Surge & Decision Intelligence',
    title: 'AI Multi-Factor Risk Surge (42 → 89)',
    subtitle: 'Sitabuldi Leaps to CRITICAL Risk Level',
    procedureCode: 'SOP-XAI-COMPUTE',
    procedureTitle: 'Real-Time Mathematical Risk Re-Evaluation',
    procedureDetails:
      'Explainable AI (XAI) risk engine aggregates 4 real-time inputs: Accident (88%), Congestion (94%), Weather (78%), and Violation Multiplier (45%). Overall score reaches 89/100.',
    whatIsHappening:
      'Nagpur ICCC primary overview wall displays Sitabuldi in pulsing crimson. Automated alerts trigger on senior police officer consoles and Municipal Commissioner dashboard.',
    actionBadge: 'CRITICAL RISK 89/100',
    badgeVariant: 'danger',
    telemetry: {
      riskScore: 89,
      riskCategory: 'CRITICAL',
      avgSpeedKmph: 5.2,
      queueLengthMeters: 1720,
      officersOnScene: '1 Officer (O-101)',
      signalStatus: 'Alarm: Critical Gridlock',
      weatherCondition: 'Heavy Rain • 48mm/hr',
      hospitalStatus: 'GMC Trauma 4 Beds Ready',
    },
    aiReasoning:
      'Risk formula: 0.40(88) + 0.30(94) + 0.15(78) + 0.15(45) = 89.15 (CRITICAL). Mandates immediate supervisor intervention.',
    cadAction: 'Automated executive dispatch recommendation generated.',
  },
  {
    step: 7,
    phaseNumber: 2,
    phaseName: 'AI Risk Surge & Decision Intelligence',
    title: 'Police Coverage Gap Flagged',
    subtitle: '1 Officer on Scene vs 4 Required',
    procedureCode: 'SOP-STAFFING-GAP',
    procedureTitle: 'Personnel Constraint Satisfaction Deficit',
    procedureDetails:
      'Constraint engine compares required personnel for dual-lane diversion, crowd control, and casualty safety (4 officers) vs. 1 beat constable on scene. Gap deficit = 3 officers.',
    whatIsHappening:
      'Constable Vikram Shinde (O-101) on scene is completely overwhelmed trying to administer first-aid and divert traffic simultaneously in heavy rain.',
    actionBadge: 'COVERAGE GAP: DEFICIT 3',
    badgeVariant: 'danger',
    telemetry: {
      riskScore: 89,
      riskCategory: 'CRITICAL',
      avgSpeedKmph: 5.0,
      queueLengthMeters: 1750,
      officersOnScene: '1 Officer (Overwhelmed)',
      signalStatus: 'Manual Request Pending',
      weatherCondition: 'Heavy Rain • 48mm/hr',
      hospitalStatus: 'GMC Trauma 4 Beds Ready',
    },
    aiReasoning:
      'Coverage Gap Rule: High-Volume Major Interchange + Multi-Vehicle Incident + Severe Rain = Minimum 3 Police Officers required for safety.',
    cadAction: 'Redeployment optimizer triggers urgent fleet search.',
  },
  {
    step: 8,
    phaseNumber: 2,
    phaseName: 'AI Risk Surge & Decision Intelligence',
    title: '112 CAD Emergency Priority-1 Escalation',
    subtitle: 'Ticket Promoted to Priority-1 (Code Red)',
    procedureCode: 'SOP-CAD-PRIORITY1',
    procedureTitle: 'Computer-Aided Dispatch Auto-Triage',
    procedureDetails:
      'INC-STB-919 auto-promoted to Top Priority in Nagpur Police Command Matrix. All subordinate low-priority tasks in Zone 1 placed on hold.',
    whatIsHappening:
      'ICCC Senior CAD Dispatcher Pooja Deshmukh receives audible Code Red alert. Master incident dossier links CCTV CAM-STB-01/02 feeds, weather data, and nearby police GPS positions.',
    actionBadge: 'CAD PRIORITY-1 RED',
    badgeVariant: 'danger',
    telemetry: {
      riskScore: 89,
      riskCategory: 'CRITICAL',
      avgSpeedKmph: 4.8,
      queueLengthMeters: 1800,
      officersOnScene: '1 Officer (O-101)',
      signalStatus: 'Code Red CAD Override',
      weatherCondition: 'Heavy Rain • 48mm/hr',
      hospitalStatus: 'GMC Trauma 4 Beds Ready',
    },
    aiReasoning:
      'CAD SLA policy dictates Priority-1 incidents require on-scene reinforcement dispatch within 90 seconds of detection.',
    cadAction: 'CAD Priority-1 broadcast to Zone 1 patrol channel.',
  },
  {
    step: 9,
    phaseNumber: 3,
    phaseName: 'AI Optimization & Officer Dispatch',
    title: 'Spatial Optimization & Unit Ranking',
    subtitle: 'Algorithm Evaluates 42 Fleet Units',
    procedureCode: 'SOP-AI-DISPATCH',
    procedureTitle: 'K-d Tree Heuristic & Shortest Time Routing',
    procedureDetails:
      'Multi-objective heuristic ranks 42 active police officers based on GPS proximity, vehicle type (motorcycle vs patrol car), and current congestion travel times.',
    whatIsHappening:
      'AI identifies optimal units: Sub-Inspector Vikram Singh (O-17, Civil Lines, motorcycle, ETA 3.2 min) and Head Constable Deepak Nimje (O-24, Dhantoli, ETA 3.4 min).',
    actionBadge: 'OFFICERS RANKED',
    badgeVariant: 'info',
    telemetry: {
      riskScore: 88,
      riskCategory: 'CRITICAL',
      avgSpeedKmph: 4.8,
      queueLengthMeters: 1800,
      officersOnScene: '1 Officer (O-101)',
      signalStatus: 'Awaiting Officer Arrival',
      weatherCondition: 'Heavy Rain • 48mm/hr',
      hospitalStatus: 'GMC Trauma 4 Beds Ready',
    },
    aiReasoning:
      'Ranking metric: Min[TravelTime(u)] + Max[OfficerRank(u)] - DistToScene(u). Units O-17 and O-24 scored 98.4 and 96.2 match rating.',
    cadAction: 'AI redeployment recommendation package submitted to Supervisor.',
  },
  {
    step: 10,
    phaseNumber: 3,
    phaseName: 'AI Optimization & Officer Dispatch',
    title: 'Supervisor 1-Click Dispatch Authorization',
    subtitle: 'ICCC Approves Dynamic Redeployment',
    procedureCode: 'SOP-SUPERVISOR-AUTH',
    procedureTitle: 'Human-in-the-Loop Override & Digital Mandate',
    procedureDetails:
      'Command supervisor clicks "Accept & Dispatch Recommendation". System captures supervisor ID, timestamp, and automated justification in audit log.',
    whatIsHappening:
      'Encrypted digital dispatch mandates transmitted via wireless data network directly to in-vehicle terminals and mobile radios of Units O-17 and O-24.',
    actionBadge: 'DISPATCH AUTHORIZED',
    badgeVariant: 'info',
    telemetry: {
      riskScore: 87,
      riskCategory: 'CRITICAL',
      avgSpeedKmph: 5.0,
      queueLengthMeters: 1800,
      officersOnScene: '1 Officer (O-101)',
      signalStatus: 'Dispatch Order Logged',
      weatherCondition: 'Heavy Rain • 48mm/hr',
      hospitalStatus: 'GMC Trauma 4 Beds Ready',
    },
    aiReasoning:
      'Supervisor audit record created (User: Pooja Deshmukh, Reason: Multi-vehicle crash with severe monsoon gridlock).',
    cadAction: 'Mandate transmitted. Acknowledgment timer: 30 seconds.',
  },
  {
    step: 11,
    phaseNumber: 3,
    phaseName: 'AI Optimization & Officer Dispatch',
    title: 'Rapid Response Units In-Transit',
    subtitle: 'O-17 & O-24 En Route with Real-Time Routing',
    procedureCode: 'SOP-TRANSIT-GPS',
    procedureTitle: 'Dynamic GIS Beacon Tracking (500ms Interval)',
    procedureDetails:
      'Patrol units acknowledge dispatch within 12 seconds. Live GPS beacons stream at 500ms intervals; system renders dynamic green transit path on ICCC GIS map.',
    whatIsHappening:
      'Sub-Inspector Vikram Singh (O-17) departs Civil Lines with siren active. Officer Deepak Nimje (O-24) navigates via Dhantoli service lane, bypassing the main queue.',
    actionBadge: 'UNITS IN-TRANSIT',
    badgeVariant: 'info',
    telemetry: {
      riskScore: 85,
      riskCategory: 'CRITICAL',
      avgSpeedKmph: 5.4,
      queueLengthMeters: 1780,
      officersOnScene: '1 Officer (2 In-Transit)',
      signalStatus: 'Transit Tracking Active',
      weatherCondition: 'Heavy Rain • 48mm/hr',
      hospitalStatus: 'Ambulance 108 Mobilized',
    },
    aiReasoning:
      'Dynamic routing guides units via high-elevation service corridors avoiding flooded underpass bottlenecks.',
    cadAction: 'Units status updated to EN_ROUTE. ETA countdown: 2m 45s.',
  },
  {
    step: 12,
    phaseNumber: 4,
    phaseName: 'Green Corridor & Signal Preemption',
    title: 'Emergency 108 Green Corridor Request',
    subtitle: 'Ambulance Evacuation Route Activated to GMC',
    procedureCode: 'SOP-GREEN-CORRIDOR-108',
    procedureTitle: 'Trauma Lifeline Coordination Protocol',
    procedureDetails:
      'GMC Trauma Emergency Unit requests synchronized Green Corridor for arriving 108 Ambulance MH-31-EM-108. Route: Sitabuldi Interchange → Rahate Colony → GMC (3.8 km).',
    whatIsHappening:
      '108 Ambulance siren sounds near Sitabuldi. ICCC green corridor controller locks the 3.8 km transit lifeline with priority signal clearance.',
    actionBadge: 'GREEN CORRIDOR ACTIVE',
    badgeVariant: 'success',
    telemetry: {
      riskScore: 78,
      riskCategory: 'HIGH',
      avgSpeedKmph: 7.2,
      queueLengthMeters: 1700,
      officersOnScene: '1 Officer (2 En-Route)',
      signalStatus: 'Corridor Lock: 3.8 km',
      weatherCondition: 'Rain Easing • 32mm/hr',
      hospitalStatus: 'GMC Trauma Bay 1 Reserved',
    },
    aiReasoning:
      'Green Corridor preemption cuts estimated ambulance transit time from 16 minutes (in traffic) to 4.2 minutes.',
    cadAction: '108 Corridor token issued. Hospital ER team notified.',
  },
  {
    step: 13,
    phaseNumber: 4,
    phaseName: 'Green Corridor & Signal Preemption',
    title: 'ATCS Adaptive Signal Preemption',
    subtitle: 'Hold-Green Cascade Along Wardha Road',
    procedureCode: 'SOP-SIGNAL-PREEMPT',
    procedureTitle: 'SCATS / CoSiCoSt Corridor Preemption Command',
    procedureDetails:
      'Central traffic signal master overrides local junction controllers at RBI Sq, Zero Mile, Sitabuldi, and Rahate Colony, executing synchronized hold-green cascade.',
    whatIsHappening:
      'North-South signal split extended to 110 seconds green. Cross-traffic at East-West approaches safely halted to guarantee zero-stop ambulance corridor.',
    actionBadge: 'HOLD-GREEN (110s)',
    badgeVariant: 'success',
    telemetry: {
      riskScore: 72,
      riskCategory: 'HIGH',
      avgSpeedKmph: 9.8,
      queueLengthMeters: 1550,
      officersOnScene: '1 Officer (2 Arriving)',
      signalStatus: 'HOLD-GREEN (N-S 110s)',
      weatherCondition: 'Light Rain • 22mm/hr',
      hospitalStatus: 'GMC ER Ready for Triage',
    },
    aiReasoning:
      'Signal progression speed set to 48 km/h wave, allowing 108 Ambulance to clear all 4 intersections without braking.',
    cadAction: 'Signal telemetry verified. Controller latency: 24ms.',
  },
  {
    step: 14,
    phaseNumber: 4,
    phaseName: 'Green Corridor & Signal Preemption',
    title: 'Dynamic VMS & Citizen Portal Advisory',
    subtitle: 'Diversion Advisories Broadcast to 12k Users',
    procedureCode: 'SOP-VMS-BROADCAST',
    procedureTitle: 'Public Traffic Guidance & Intelligent Routing',
    procedureDetails:
      'ICCC automated broadcast engine pushes warning to municipal Variable Message Signs at Variety Sq, Lokmat Sq, and Shankar Nagar, plus mobile app alerts.',
    whatIsHappening:
      'VMS electronic boards display: "CAUTION: Wardha Rd Flyover Incident — Use North Ambazari Rd Bypass". Inflow traffic diverts, stopping further queue growth.',
    actionBadge: 'VMS & APP ADVISORY',
    badgeVariant: 'info',
    telemetry: {
      riskScore: 65,
      riskCategory: 'MEDIUM',
      avgSpeedKmph: 13.5,
      queueLengthMeters: 1350,
      officersOnScene: '1 Officer (2 Arrived)',
      signalStatus: 'Dynamic Inflow Throttling',
      weatherCondition: 'Light Drizzle • 12mm/hr',
      hospitalStatus: 'GMC Trauma Bay 1 Active',
    },
    aiReasoning:
      'Diverting 35% of incoming vehicle volume reduces saturation degree below 1.0 within 4 minutes.',
    cadAction: '12,400 app push notifications delivered with 98.6% reach.',
  },
  {
    step: 15,
    phaseNumber: 5,
    phaseName: 'Tactical Resolution & Rescue Operations',
    title: 'Officers On-Scene & Tactical Perimeter',
    subtitle: 'Units O-17 & O-24 Arrive (Response: 3.1 min)',
    procedureCode: 'SOP-TACTICAL-PERIMETER',
    procedureTitle: '300m Safety Taper & Channelized Bypass',
    procedureDetails:
      'Officers O-17 and O-24 arrive at Sitabuldi (response time: 3.1 min, beating the 5-min SLA). Tactical perimeter and orange traffic cones deployed.',
    whatIsHappening:
      '3 police officers are now on site. Sub-Inspector Vikram Singh assists 108 paramedics; Officer Deepak Nimje and Constable Shinde channelize traffic into the open lane.',
    actionBadge: '3 OFFICERS ON-SCENE',
    badgeVariant: 'success',
    telemetry: {
      riskScore: 54,
      riskCategory: 'MEDIUM',
      avgSpeedKmph: 17.5,
      queueLengthMeters: 980,
      officersOnScene: '3 Officers (O-101, O-17, O-24)',
      signalStatus: 'Bypass Manual Phase Active',
      weatherCondition: 'Drizzle Stopped • 4mm/hr',
      hospitalStatus: 'Ambulance En Route to GMC',
    },
    aiReasoning:
      'Coverage gap resolved. 3 active officers eliminate pedestrian crossing hazards and restore single-lane flow.',
    cadAction: 'Police SLA compliance logged: 3.1 min response (Target: <5.0 min).',
  },
  {
    step: 16,
    phaseNumber: 5,
    phaseName: 'Tactical Resolution & Rescue Operations',
    title: 'Towing Crane & Medical Evacuation',
    subtitle: 'Casualty Extracted • Bus Cleared to Shoulder',
    procedureCode: 'SOP-RECOVERY-TOW',
    procedureTitle: 'Heavy Wrecker Deployment (Crane CR-04)',
    procedureDetails:
      'NTP heavy hydraulic recovery crane CR-04 winches the damaged bus onto the shoulder. 108 Ambulance safely evacuates casualty to GMC Trauma Center in 4.1 mins.',
    whatIsHappening:
      'Injured commuter arrives at GMC Trauma Bay with stable vitals. Police crane clears the bus wreckage. All 3 lanes on the flyover ramp are freed of physical obstruction.',
    actionBadge: 'WRECKAGE CLEARED',
    badgeVariant: 'success',
    telemetry: {
      riskScore: 46,
      riskCategory: 'MEDIUM',
      avgSpeedKmph: 22.0,
      queueLengthMeters: 620,
      officersOnScene: '3 Officers on Scene',
      signalStatus: 'Queue Flush Optimization',
      weatherCondition: 'Overcast • 0mm/hr',
      hospitalStatus: 'Patient Received at GMC (Stable)',
    },
    aiReasoning:
      'Removal of roadway obstruction drops accident risk factor from 88% to 24%.',
    cadAction: 'Medical transit successful. Crane return to depot logged.',
  },
  {
    step: 17,
    phaseNumber: 5,
    phaseName: 'Tactical Resolution & Rescue Operations',
    title: 'Smart Stormwater Drainage Activated',
    subtitle: 'Underpass Sluice Pumps Clear Waterlogging',
    procedureCode: 'SOP-SMART-DRAINAGE',
    procedureTitle: 'NSSCDCL IoT Submersible Pump Automation',
    procedureDetails:
      'Ultrasonic depth sensors detect 8 inches of water accumulation at the Sitabuldi metro subway dip and automatically engage twin 1,200 L/min stormwater pumps.',
    whatIsHappening:
      'Pumps clear the flooded roadway into the Nag River drainage channel in 3 minutes. Underpass road friction and traction return to safe dry-roadway parameters.',
    actionBadge: 'DRAINAGE PUMPS (1200L/m)',
    badgeVariant: 'info',
    telemetry: {
      riskScore: 42,
      riskCategory: 'LOW',
      avgSpeedKmph: 25.5,
      queueLengthMeters: 380,
      officersOnScene: '3 Officers on Scene',
      signalStatus: 'Adaptive Cycle Synchronized',
      weatherCondition: 'Overcast • Road Drying',
      hospitalStatus: 'GMC ER All Clear',
    },
    aiReasoning:
      'Removing water accumulation prevents hydroplaning and restores full intersection design capacity.',
    cadAction: 'Municipal engineering telemetries marked normal.',
  },
  {
    step: 18,
    phaseNumber: 6,
    phaseName: 'Signal Normalization & Post-Incident Audit',
    title: 'ATCS Signal Cycle Normalization',
    subtitle: 'Queue Flushed • Speed Recovers to 28 km/h',
    procedureCode: 'SOP-QUEUE-FLUSH',
    procedureTitle: 'Adaptive Dynamic Split Balance Re-Calibration',
    procedureDetails:
      'ATCS controllers execute high-throughput queue clearance phase (140s expanded cycle) for 2 cycles before transitioning back to balanced adaptive splits.',
    whatIsHappening:
      'Remaining tailback at Variety Square dissolves completely. Vehicular speed reaches 28 km/h. Wardha Road and Central Avenue return to free-flow conditions.',
    actionBadge: 'QUEUE FLUSH COMPLETE',
    badgeVariant: 'success',
    telemetry: {
      riskScore: 38,
      riskCategory: 'LOW',
      avgSpeedKmph: 28.0,
      queueLengthMeters: 220,
      officersOnScene: '3 Officers Wrapping Up',
      signalStatus: 'Balanced Adaptive ATCS',
      weatherCondition: 'Clear Sky • 28°C',
      hospitalStatus: 'Normal Operations',
    },
    aiReasoning:
      'Queue dissipation model verifies degree of saturation normalized to DS=0.68.',
    cadAction: 'Patrol units O-17 and O-24 authorized to resume regular beat patrol.',
  },
  {
    step: 19,
    phaseNumber: 6,
    phaseName: 'Signal Normalization & Post-Incident Audit',
    title: 'Full Scene Cleared & Post-Incident Audit',
    subtitle: 'Incident INC-STB-919 Resolved & Archived',
    procedureCode: 'SOP-POST-AUDIT',
    procedureTitle: 'Digital Audit Trail & E-Challan Generation',
    procedureDetails:
      'CAD ticket INC-STB-919 closed with full audit summary: 3.1 min police response time, 4.1 min green corridor transit, zero secondary collisions, e-challans generated.',
    whatIsHappening:
      'Sitabuldi risk score settles at a safe 36/100 (LOW). All lanes fully operational. Comprehensive incident dossier and XAI performance metrics archived in ICCC database.',
    actionBadge: 'AUDIT LOGGED & RESOLVED',
    badgeVariant: 'success',
    telemetry: {
      riskScore: 36,
      riskCategory: 'LOW',
      avgSpeedKmph: 32.0,
      queueLengthMeters: 160,
      officersOnScene: '1 Officer (Regular Beat)',
      signalStatus: 'Normal Adaptive ATCS',
      weatherCondition: 'Clear Sky • 28°C',
      hospitalStatus: 'Normal Operations',
    },
    aiReasoning:
      'Post-incident validation confirms 100% SLA compliance, 0 fatalities, 74% congestion reduction compared to unassisted baseline.',
    cadAction: 'Incident INC-STB-919 marked RESOLVED. Archive ID: NAG-ICCC-2026-919.',
  },
];

interface DynamicRedeploymentSimulationProps {
  junctions: Junction[];
  officers: PoliceOfficer[];
  incidents: Incident[];
  onTriggerSimulationStep: (step: number) => void;
  onResetSimulation: () => void;
  currentStep: number;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (playing: boolean) => void;
  onAcceptDeployment: (rec: DeploymentRecommendation) => void;
}

export const DynamicRedeploymentSimulation: React.FC<
  DynamicRedeploymentSimulationProps
> = ({
  junctions,
  officers,
  incidents,
  onTriggerSimulationStep,
  onResetSimulation,
  currentStep,
  isAutoPlaying,
  setIsAutoPlaying,
  onAcceptDeployment,
}) => {
  const totalSteps = NINETEEN_SIMULATION_STEPS.length; // 19 steps

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying && currentStep < totalSteps - 1) {
      timer = setTimeout(() => {
        const nextStep = currentStep + 1;
        onTriggerSimulationStep(nextStep);
        if (nextStep === totalSteps - 1) {
          setIsAutoPlaying(false);
          try {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
            });
          } catch (e) {
            // ignore
          }
        }
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentStep, onTriggerSimulationStep, setIsAutoPlaying, totalSteps]);

  const activeIndex = Math.min(Math.max(0, currentStep), totalSteps - 1);
  const activeStep = NINETEEN_SIMULATION_STEPS[activeIndex];

  // Group steps by Phase for the phase progress bar
  const phases = [
    { number: 1, name: 'Detection & Telemetry', steps: [1, 2, 3, 4, 5] },
    { number: 2, name: 'AI Risk Surge & Triage', steps: [6, 7, 8] },
    { number: 3, name: 'Optimization & Dispatch', steps: [9, 10, 11] },
    { number: 4, name: 'Green Corridor & Preemption', steps: [12, 13, 14] },
    { number: 5, name: 'Tactical Resolution & Rescue', steps: [15, 16, 17] },
    { number: 6, name: 'Normalization & Audit', steps: [18, 19] },
  ];

  return (
    <div
      id="dynamic-redeployment-simulation-panel"
      className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 text-slate-900"
    >
      {/* Simulation Master Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Zap className="w-5 h-5" />
            </span>
            <h2 className="font-bold text-xl text-slate-900">
              19-Step I²TMS Incident & Redeployment Simulation
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-mono text-xs font-bold border border-blue-200">
              SOP LAB v2.6
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-mono text-xs font-bold border border-amber-200">
              NAGPUR ICCC PROTOCOL
            </span>
          </div>
          <p className="text-xs text-slate-600 max-w-4xl leading-relaxed">
            Experience the complete, high-fidelity 19-step lifecycle of an intelligent traffic command and decision support sequence in Nagpur: from computer vision edge detection and AI risk surging, through human-in-the-loop dispatch, 108 ambulance green corridor signal preemption, and underpass drainage to final post-incident audit.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            id="run-incident-simulation-btn"
            onClick={() => {
              if (currentStep >= totalSteps - 1) {
                onResetSimulation();
                setTimeout(() => setIsAutoPlaying(true), 200);
              } else {
                setIsAutoPlaying(!isAutoPlaying);
              }
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
              isAutoPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-4 h-4" /> Pause 19-Step Run
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> RUN FULL 19-STEP SIMULATION
              </>
            )}
          </button>

          <button
            id="step-prev-sim-btn"
            onClick={() => {
              if (currentStep > 0) onTriggerSimulationStep(currentStep - 1);
            }}
            disabled={currentStep <= 0}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs flex items-center gap-1 border border-slate-200 cursor-pointer"
            title="Previous Step"
          >
            <Rewind className="w-4 h-4" />
          </button>

          <button
            id="step-forward-sim-btn"
            onClick={() => {
              if (currentStep < totalSteps - 1) onTriggerSimulationStep(currentStep + 1);
            }}
            disabled={currentStep >= totalSteps - 1}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs flex items-center gap-1 border border-slate-200 cursor-pointer"
            title="Next Step"
          >
            <FastForward className="w-4 h-4" />
          </button>

          <button
            id="reset-sim-btn"
            onClick={onResetSimulation}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs border border-slate-200 cursor-pointer"
            title="Reset to Step 1 (Baseline)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Phase Track Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
        {phases.map((phase) => {
          const isCurrentPhase = activeStep.phaseNumber === phase.number;
          const isPastPhase = activeStep.phaseNumber > phase.number;
          return (
            <div
              key={phase.number}
              className={`p-2.5 rounded-xl border transition-all text-xs ${
                isCurrentPhase
                  ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-200 shadow-2xs font-semibold'
                  : isPastPhase
                  ? 'bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-white border-slate-200 text-slate-400 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                  Phase {phase.number}
                </span>
                {isPastPhase && (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                )}
                {isCurrentPhase && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                )}
              </div>
              <div className="text-[11px] font-bold truncate text-slate-900">
                {phase.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* 19-Step Scrubber Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span className="font-bold text-blue-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Step {activeStep.step} of 19: {activeStep.title}
          </span>
          <span className="font-mono font-bold text-slate-500">
            Progress: {Math.round((activeStep.step / 19) * 100)}%
          </span>
        </div>

        {/* Clickable 19 Step Pills */}
        <div className="grid grid-cols-19 gap-1 h-3 w-full">
          {NINETEEN_SIMULATION_STEPS.map((s, idx) => {
            const isCurrent = idx === activeIndex;
            const isPast = idx < activeIndex;
            return (
              <button
                key={s.step}
                onClick={() => onTriggerSimulationStep(idx)}
                className={`h-full rounded-xs transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 scale-y-150 shadow-xs ring-2 ring-blue-300'
                    : isPast
                    ? 'bg-blue-300 hover:bg-blue-400'
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Step ${s.step}: ${s.title}`}
              />
            );
          })}
        </div>

        {/* Quick Stepper Labels */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-0.5">
          <span>Step 1: Baseline</span>
          <span>Step 6: Risk Surge</span>
          <span>Step 10: Dispatch</span>
          <span>Step 13: Signal Preempt</span>
          <span>Step 16: Evacuation</span>
          <span>Step 19: Audit Done</span>
        </div>
      </div>

      {/* ACTIVE STEP DEEP DIVE: Procedure vs Ground Truth Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Procedure & Real-World Narrative */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Step Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold">
                  STEP {activeStep.step} / 19
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {activeStep.title}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">
                    {activeStep.subtitle}
                  </div>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                  activeStep.badgeVariant === 'danger'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : activeStep.badgeVariant === 'warning'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : activeStep.badgeVariant === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : activeStep.badgeVariant === 'info'
                    ? 'bg-sky-50 text-sky-800 border-sky-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {activeStep.actionBadge}
              </span>
            </div>

            {/* Standard Operating Procedure Box */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5 text-blue-700">
                  <FileCheck className="w-4 h-4" />
                  Standard Operating Procedure (SOP) Protocol:
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {activeStep.procedureCode}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900">
                {activeStep.procedureTitle}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeStep.procedureDetails}
              </p>
            </div>

            {/* Ground Truth Narrative: What is Happening */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <Activity className="w-4 h-4 text-blue-600" />
                Live Ground Reality — What is happening in Nagpur right now:
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {activeStep.whatIsHappening}
              </p>
            </div>

            {/* AI Reasoning & CAD Action Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  AI Reasoning & Weight Calculation:
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed font-mono">
                  {activeStep.aiReasoning}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amber-600" />
                  ICCC CAD / Controller Command:
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed font-mono">
                  {activeStep.cadAction}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Step Telemetry Panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Real-Time Telemetry Gauges for this Step */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                Sitabuldi Live Telemetry
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                POLLING 500ms
              </span>
            </div>

            {/* Risk Score Big Stat */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-500 font-bold">
                Dynamic Composite Risk Score
              </div>
              <div
                className={`font-mono text-3xl font-black ${
                  activeStep.telemetry.riskCategory === 'CRITICAL'
                    ? 'text-rose-600 animate-pulse'
                    : activeStep.telemetry.riskCategory === 'HIGH'
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {activeStep.telemetry.riskScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
              </div>
              <div
                className={`text-[11px] font-bold uppercase ${
                  activeStep.telemetry.riskCategory === 'CRITICAL'
                    ? 'text-rose-700'
                    : activeStep.telemetry.riskCategory === 'HIGH'
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                }`}
              >
                Category: {activeStep.telemetry.riskCategory}
              </div>
            </div>

            {/* 6 Key Telemetry Rows */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-slate-400" /> Avg. Velocity:
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {activeStep.telemetry.avgSpeedKmph} km/h
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-400" /> Queue Spillback:
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {activeStep.telemetry.queueLengthMeters >= 1000
                    ? `${(activeStep.telemetry.queueLengthMeters / 1000).toFixed(1)} km`
                    : `${activeStep.telemetry.queueLengthMeters} m`}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" /> Police Coverage:
                </span>
                <span className="font-mono font-bold text-slate-900 truncate max-w-[170px]">
                  {activeStep.telemetry.officersOnScene}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" /> Signal ATCS:
                </span>
                <span className="font-mono font-bold text-slate-900 truncate max-w-[170px]">
                  {activeStep.telemetry.signalStatus}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-slate-400" /> Weather AWS:
                </span>
                <span className="font-mono font-bold text-slate-900 truncate max-w-[170px]">
                  {activeStep.telemetry.weatherCondition}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Ambulance className="w-3.5 h-3.5 text-slate-400" /> Trauma Hospital:
                </span>
                <span className="font-mono font-bold text-slate-900 truncate max-w-[170px]">
                  {activeStep.telemetry.hospitalStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Way Phase Comparison Table */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          I²TMS Operational Impact Across 19-Step Lifecycle
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* 1. Baseline Phase */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-xs text-slate-800">1. Baseline (Steps 1–5)</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                INCIDENT STRIKE
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Risk Transition:</span>
                <span className="font-mono font-bold text-amber-700">42 → 84 / 100</span>
              </div>
              <div className="flex justify-between">
                <span>Average Speed:</span>
                <span className="font-mono text-rose-600 font-bold">34 → 5.8 km/h</span>
              </div>
              <div className="flex justify-between">
                <span>Police Presence:</span>
                <span className="font-mono">1 Beat Constable</span>
              </div>
            </div>
          </div>

          {/* 2. AI Decision & Green Corridor Phase */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-300 ring-1 ring-blue-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-xs text-blue-900">2. AI Action (Steps 6–14)</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                DISPATCH & PREEMPT
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Police Dispatch:</span>
                <span className="font-mono font-bold text-blue-700">3.1 min Response</span>
              </div>
              <div className="flex justify-between">
                <span>Signal Preemption:</span>
                <span className="font-mono text-blue-700 font-bold">Hold-Green (110s)</span>
              </div>
              <div className="flex justify-between">
                <span>Ambulance Transit:</span>
                <span className="font-mono font-bold text-emerald-700">4.1 min to GMC</span>
              </div>
            </div>
          </div>

          {/* 3. Resolution & Audit Phase */}
          <div className="p-3.5 rounded-xl bg-white border border-emerald-300 ring-1 ring-emerald-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-xs text-emerald-900">3. Resolution (Steps 15–19)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                STABILIZED
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Final Risk Score:</span>
                <span className="font-mono font-bold text-emerald-700">36 / 100 (LOW)</span>
              </div>
              <div className="flex justify-between">
                <span>Velocity Restored:</span>
                <span className="font-mono font-bold text-emerald-700">32.0 km/h</span>
              </div>
              <div className="flex justify-between">
                <span>Digital Audit:</span>
                <span className="font-mono text-emerald-700 font-bold">100% SLA Saved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
