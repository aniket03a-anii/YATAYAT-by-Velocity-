import { DeploymentRecommendation, Junction, PoliceOfficer } from '../types';

export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

export function estimateEtaMinutes(
  distanceUnits: number,
  vehicleType: PoliceOfficer['vehicleType']
): number {
  // 100 units is approx 2.5 km across Nagpur core grid
  const km = (distanceUnits / 100) * 2.2;
  
  let avgSpeedKmph = 35; // Motorcycle
  if (vehicleType === 'Patrol Car (PCR)') avgSpeedKmph = 28;
  if (vehicleType === 'Interceptor') avgSpeedKmph = 38;
  if (vehicleType === 'Scooter') avgSpeedKmph = 30;
  if (vehicleType === 'On Foot') avgSpeedKmph = 6;

  const hours = km / avgSpeedKmph;
  const minutes = hours * 60 + 0.8; // + dispatch overhead
  return Math.max(1.2, parseFloat(minutes.toFixed(1)));
}

export function generateRecommendations(
  junctions: Junction[],
  officers: PoliceOfficer[]
): DeploymentRecommendation[] {
  const recommendations: DeploymentRecommendation[] = [];

  // Filter junctions that have risk >= 50 or have an active incident or coverage gap
  const criticalJunctions = junctions.filter(
    (j) => j.riskScore >= 50 || j.hasCoverageGap || j.activeIncidentIds.length > 0
  );

  // Sort by riskScore descending
  criticalJunctions.sort((a, b) => b.riskScore - a.riskScore);

  criticalJunctions.forEach((junction) => {
    const requiredCount = junction.requiredOfficers || (junction.riskScore >= 80 ? 3 : 2);
    const currentlyAssigned = junction.assignedOfficerIds.length;
    const deficit = Math.max(1, requiredCount - currentlyAssigned);

    // Find available officers or on-patrol in the same/neighboring zone
    const candidateOfficers = officers
      .filter((o) => o.status === 'AVAILABLE' && o.assignedJunctionId !== junction.id)
      .map((o) => {
        const dist = calculateDistance(o.mapX, o.mapY, junction.mapX, junction.mapY);
        const eta = estimateEtaMinutes(dist, o.vehicleType);
        // Score based on ETA (lower is better) and performance
        const suitabilityScore = 100 - eta * 8 + o.performanceScore * 5;
        return {
          officer: o,
          dist,
          eta,
          suitabilityScore,
        };
      })
      .sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    const selectedCandidates = candidateOfficers.slice(0, deficit);
    const selectedOfficers = selectedCandidates.map((c) => c.officer);
    const avgEta =
      selectedCandidates.length > 0
        ? parseFloat(
            (
              selectedCandidates.reduce((acc, curr) => acc + curr.eta, 0) /
              selectedCandidates.length
            ).toFixed(1)
          )
        : 3.5;

    // Generate clear, explainable reasons
    const reasons: string[] = [];
    if (junction.riskScore >= 80) {
      reasons.push(`Critical risk index (${junction.riskScore}/100) requires immediate supervisor & patrol intervention`);
    } else {
      reasons.push(`High risk index (${junction.riskScore}/100) indicates imminent congestion breakdown`);
    }

    if (junction.activeIncidentIds.length > 0) {
      reasons.push(`Active traffic incident detected requiring on-scene clearance and flow redirection`);
    }

    if (junction.weatherCondition === 'Rainy' || junction.weatherImpact > 50) {
      reasons.push(`Heavy monsoon rainfall causing reduced asphalt friction and junction bottlenecking`);
    }

    if (junction.hasCoverageGap) {
      reasons.push(`Coverage gap identified: ${currentlyAssigned} assigned vs ${requiredCount} required personnel`);
    }

    reasons.push(
      `Dispatched nearest available mobile unit (${selectedOfficers.map((o) => o.badgeNumber).join(', ') || 'O-17'}) with ETA ~${avgEta} min`
    );

    let priority: 'IMMEDIATE' | 'HIGH' | 'MODERATE' = 'MODERATE';
    if (junction.riskScore >= 80 || junction.activeIncidentIds.length > 0) {
      priority = 'IMMEDIATE';
    } else if (junction.riskScore >= 60) {
      priority = 'HIGH';
    }

    recommendations.push({
      id: `REC-${junction.id}-${Date.now().toString().slice(-4)}`,
      junctionId: junction.id,
      junctionName: junction.name,
      zone: junction.zone,
      riskScore: junction.riskScore,
      riskCategory: junction.riskCategory,
      priority,
      requiredOfficersCount: deficit,
      recommendedOfficerIds: selectedOfficers.map((o) => o.id),
      recommendedOfficers: selectedOfficers,
      estimatedEtaMinutes: avgEta,
      expectedCoverageImprovementPercent: Math.min(45, Math.round(deficit * 18 + 10)),
      expectedRiskReductionPercent: Math.min(38, Math.round(deficit * 14 + (junction.riskScore > 80 ? 12 : 6))),
      reasons,
      generatedAt: 'Just now',
      status: 'PENDING',
    });
  });

  return recommendations;
}

export function applyDeployment(
  rec: DeploymentRecommendation,
  junctions: Junction[],
  officers: PoliceOfficer[]
): { updatedJunctions: Junction[]; updatedOfficers: PoliceOfficer[] } {
  const updatedOfficers = officers.map((o) => {
    if (rec.recommendedOfficerIds.includes(o.id)) {
      return {
        ...o,
        status: 'DEPLOYED' as const,
        assignedJunctionId: rec.junctionId,
      };
    }
    return o;
  });

  const updatedJunctions = junctions.map((j) => {
    if (j.id === rec.junctionId) {
      const mergedOfficerIds = Array.from(
        new Set([...j.assignedOfficerIds, ...rec.recommendedOfficerIds])
      );
      const isAdequate = mergedOfficerIds.length >= j.requiredOfficers;
      const reducedRisk = Math.max(15, j.riskScore - rec.expectedRiskReductionPercent);
      const category: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' =
        reducedRisk <= 20
          ? 'LOW'
          : reducedRisk <= 50
          ? 'MEDIUM'
          : reducedRisk <= 80
          ? 'HIGH'
          : 'CRITICAL';

      return {
        ...j,
        assignedOfficerIds: mergedOfficerIds,
        riskScore: reducedRisk,
        riskCategory: category,
        hasCoverageGap: !isAdequate,
        policeCoverage: (isAdequate ? 'SUFFICIENT' : 'INSUFFICIENT') as 'SUFFICIENT' | 'INSUFFICIENT' | 'UNMANNED',
        accidentRisk: Math.max(15, j.accidentRisk - 20),
        congestionRisk: Math.max(15, j.congestionRisk - 25),
      };
    }
    return j;
  });

  return { updatedJunctions, updatedOfficers };
}

export function applyOverride(
  rec: DeploymentRecommendation,
  overrideOfficerIds: string[],
  overrideJunctionId: string,
  _overrideReason: string,
  junctions: Junction[],
  officers: PoliceOfficer[]
): { updatedJunctions: Junction[]; updatedOfficers: PoliceOfficer[] } {
  const targetJunction = junctions.find((j) => j.id === overrideJunctionId);

  const updatedOfficers = officers.map((o) => {
    if (overrideOfficerIds.includes(o.id)) {
      return {
        ...o,
        status: 'DEPLOYED' as const,
        assignedJunctionId: overrideJunctionId,
      };
    }
    return o;
  });

  const updatedJunctions = junctions.map((j) => {
    if (j.id === overrideJunctionId) {
      const mergedOfficerIds = Array.from(
        new Set([...j.assignedOfficerIds, ...overrideOfficerIds])
      );
      const isAdequate = mergedOfficerIds.length >= (targetJunction?.requiredOfficers || 2);
      const reducedRisk = Math.max(15, j.riskScore - 20);
      const category: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' =
        reducedRisk <= 20
          ? 'LOW'
          : reducedRisk <= 50
          ? 'MEDIUM'
          : reducedRisk <= 80
          ? 'HIGH'
          : 'CRITICAL';

      return {
        ...j,
        assignedOfficerIds: mergedOfficerIds,
        riskScore: reducedRisk,
        riskCategory: category,
        hasCoverageGap: !isAdequate,
        policeCoverage: (isAdequate ? 'SUFFICIENT' : 'INSUFFICIENT') as 'SUFFICIENT' | 'INSUFFICIENT' | 'UNMANNED',
      };
    }
    return j;
  });

  return { updatedJunctions, updatedOfficers };
}
