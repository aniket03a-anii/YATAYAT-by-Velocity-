import { ContributingFactor, Junction, RiskCategory } from '../types';

export const WEIGHTS = {
  accident: 0.25,
  congestion: 0.25,
  violation: 0.15,
  weather: 0.10,
  infrastructure: 0.10,
  pedestrian: 0.05,
  temporal: 0.05,
  event: 0.05,
};

export function getRiskCategory(score: number): RiskCategory {
  if (score <= 20) return 'LOW';
  if (score <= 50) return 'MEDIUM';
  if (score <= 80) return 'HIGH';
  return 'CRITICAL';
}

export function getRiskColor(category: RiskCategory): {
  bg: string;
  text: string;
  border: string;
  hex: string;
  badge: string;
  glow: string;
} {
  switch (category) {
    case 'LOW':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        hex: '#10b981',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        glow: 'rgba(16, 185, 129, 0.2)',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        hex: '#f59e0b',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        glow: 'rgba(245, 158, 11, 0.2)',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        hex: '#f97316',
        badge: 'bg-orange-100 text-orange-800 border-orange-300',
        glow: 'rgba(249, 115, 22, 0.2)',
      };
    case 'CRITICAL':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        hex: '#ef4444',
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        glow: 'rgba(239, 68, 68, 0.25)',
      };
  }
}

export function calculateRiskFactors(params: {
  accidentRisk: number;
  congestionRisk: number;
  violationRisk: number;
  weatherImpact: number;
  infrastructureRisk: number;
  pedestrianDensity: number;
  temporalFactor: number;
  eventFactor: number;
}): {
  overallRisk: number;
  category: RiskCategory;
  contributingFactors: ContributingFactor[];
} {
  const cAccident = Math.round(params.accidentRisk * WEIGHTS.accident);
  const cCongestion = Math.round(params.congestionRisk * WEIGHTS.congestion);
  const cViolation = Math.round(params.violationRisk * WEIGHTS.violation);
  const cWeather = Math.round(params.weatherImpact * WEIGHTS.weather);
  const cInfra = Math.round(params.infrastructureRisk * WEIGHTS.infrastructure);
  const cPedestrian = Math.round(params.pedestrianDensity * WEIGHTS.pedestrian);
  const cTemporal = Math.round(params.temporalFactor * WEIGHTS.temporal);
  const cEvent = Math.round(params.eventFactor * WEIGHTS.event);

  const rawSum =
    cAccident +
    cCongestion +
    cViolation +
    cWeather +
    cInfra +
    cPedestrian +
    cTemporal +
    cEvent;

  const overallRisk = Math.min(100, Math.max(0, rawSum));
  const category = getRiskCategory(overallRisk);

  const contributingFactors: ContributingFactor[] = [
    {
      name: 'Accident History & Severity',
      weightPercent: 25,
      score: params.accidentRisk,
      contributionPoints: cAccident,
      description: 'Historical fatal/non-fatal crash frequency and collision severity index at this junction.',
      impactLevel: params.accidentRisk >= 75 ? 'High' : params.accidentRisk >= 45 ? 'Medium' : 'Low',
    },
    {
      name: 'Real-Time Congestion Index',
      weightPercent: 25,
      score: params.congestionRisk,
      contributionPoints: cCongestion,
      description: 'Current queue spillback length, vehicle speed reduction, and arterial bottleneck saturation.',
      impactLevel: params.congestionRisk >= 75 ? 'High' : params.congestionRisk >= 45 ? 'Medium' : 'Low',
    },
    {
      name: 'Traffic Violations & Driving Behavior',
      weightPercent: 15,
      score: params.violationRisk,
      contributionPoints: cViolation,
      description: 'ANPR/RLVD detected red-light jumping, helmetless riding, illegal turns, and speeding clusters.',
      impactLevel: params.violationRisk >= 70 ? 'High' : params.violationRisk >= 40 ? 'Medium' : 'Low',
    },
    {
      name: 'Monsoon / Weather Impact',
      weightPercent: 10,
      score: params.weatherImpact,
      contributionPoints: cWeather,
      description: 'Road waterlogging vulnerability, low visibility, and slippery asphalt risks.',
      impactLevel: params.weatherImpact >= 60 ? 'High' : params.weatherImpact >= 30 ? 'Medium' : 'Low',
    },
    {
      name: 'Junction Infrastructure & Blind Spots',
      weightPercent: 10,
      score: params.infrastructureRisk,
      contributionPoints: cInfra,
      description: 'Number of intersection arms, sight distance limitations, and construction diversions.',
      impactLevel: params.infrastructureRisk >= 60 ? 'High' : params.infrastructureRisk >= 30 ? 'Medium' : 'Low',
    },
    {
      name: 'Pedestrian Density & Footfall',
      weightPercent: 5,
      score: params.pedestrianDensity,
      contributionPoints: cPedestrian,
      description: 'Proximity to markets, metro stations, educational hubs, and hospital crossing corridors.',
      impactLevel: params.pedestrianDensity >= 65 ? 'High' : 'Medium',
    },
    {
      name: 'Temporal / Peak Hour Factor',
      weightPercent: 5,
      score: params.temporalFactor,
      contributionPoints: cTemporal,
      description: 'Office commute peaks, school opening/dispersal times, and night-shift transit windows.',
      impactLevel: params.temporalFactor >= 65 ? 'High' : 'Medium',
    },
    {
      name: 'Public Events & VIP Corridors',
      weightPercent: 5,
      score: params.eventFactor,
      contributionPoints: cEvent,
      description: 'Scheduled rallies, sports events, festivals, or sudden commercial market surges.',
      impactLevel: params.eventFactor >= 50 ? 'High' : 'Low',
    },
  ];

  // Sort factors by contribution points descending
  contributingFactors.sort((a, b) => b.contributionPoints - a.contributionPoints);

  return {
    overallRisk,
    category,
    contributingFactors,
  };
}

export function calculateJunctionRisk(input: Junction): Junction;
export function calculateJunctionRisk(input: {
  accidentRisk: number;
  congestionRisk: number;
  violationRisk: number;
  weatherImpact: number;
  infrastructureRisk: number;
  pedestrianDensity: number;
  temporalFactor: number;
  eventFactor: number;
}): {
  overallRisk: number;
  category: RiskCategory;
  contributingFactors: ContributingFactor[];
};
export function calculateJunctionRisk(input: any): any {
  if ('id' in input && 'mapX' in input) {
    const junction = input as Junction;
    const { overallRisk, category, contributingFactors } = calculateRiskFactors({
      accidentRisk: junction.accidentRisk ?? 30,
      congestionRisk: junction.congestionRisk ?? 30,
      violationRisk: junction.violationRisk ?? 30,
      weatherImpact: junction.weatherImpact ?? 20,
      infrastructureRisk: junction.infrastructureRisk ?? 30,
      pedestrianDensity: junction.pedestrianDensity ?? 30,
      temporalFactor: junction.temporalFactor ?? 30,
      eventFactor: junction.eventFactor ?? 20,
    });

    const finalRisk = junction.riskScore !== undefined && junction.riskScore !== overallRisk && junction.riskScore > overallRisk
      ? junction.riskScore
      : overallRisk;
    const finalCategory = getRiskCategory(finalRisk);

    const required = finalRisk >= 80 ? 3 : finalRisk >= 50 ? 2 : 1;
    const assigned = junction.assignedOfficerIds?.length || 0;
    const isUnmanned = assigned === 0;
    const hasGap = finalRisk >= 50 && assigned < required;

    const coverageStatus: 'SUFFICIENT' | 'INSUFFICIENT' | 'UNMANNED' =
      isUnmanned ? 'UNMANNED' : assigned < required ? 'INSUFFICIENT' : 'SUFFICIENT';

    return {
      ...junction,
      riskScore: finalRisk,
      riskCategory: finalCategory,
      contributingFactors,
      requiredOfficers: required,
      hasCoverageGap: hasGap,
      policeCoverage: coverageStatus,
    };
  }

  return calculateRiskFactors(input);
}

export function recalculateAllJunctions(junctions: Junction[]): Junction[] {
  return junctions.map((j) => calculateJunctionRisk(j));
}

export function evaluateCoverageGap(junction: Junction): {
  hasGap: boolean;
  requiredOfficers: number;
  coverageStatus: 'SUFFICIENT' | 'INSUFFICIENT' | 'UNMANNED';
  recommendedAction: string;
} {
  let required = 1;
  if (junction.riskScore >= 80) {
    required = 3;
  } else if (junction.riskScore >= 50) {
    required = 2;
  } else {
    required = 1;
  }

  const assignedCount = junction.assignedOfficerIds.length;
  const isUnmanned = assignedCount === 0;
  const hasGap = junction.riskScore >= 50 && assignedCount < required;

  let coverageStatus: 'SUFFICIENT' | 'INSUFFICIENT' | 'UNMANNED' = 'SUFFICIENT';
  if (isUnmanned) {
    coverageStatus = 'UNMANNED';
  } else if (assignedCount < required) {
    coverageStatus = 'INSUFFICIENT';
  }

  let recommendedAction = 'Maintain routine patrol observation.';
  if (hasGap) {
    const deficit = required - assignedCount;
    recommendedAction = `Deploy ${deficit} additional traffic officer${deficit > 1 ? 's' : ''} immediately.`;
  }

  return {
    hasGap,
    requiredOfficers: required,
    coverageStatus,
    recommendedAction,
  };
}
