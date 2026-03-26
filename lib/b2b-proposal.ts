import {
  DEFAULT_INPUT,
  DEFAULT_REFERENCE_PROJECT,
  calculateEstimate,
  type EstimateResult,
} from "@/lib/estimator";

export type BoundaryPoint = {
  lat: number;
  lng: number;
};

export type B2BLeadInput = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  siteAddress: string;
  areaSource: "google" | "cadastral" | "manual";
  boundaryText: string;
  widthM: number;
  depthM: number;
  landUseFactorPct: number;
  preferredStartYear: number;
};

export type B2BLeadResult = {
  areaSqm: number;
  areaPyeong: number;
  usableAreaSqm: number;
  boundaryPoints: BoundaryPoint[];
  recommendedCapacityMw: number;
  isStandardProposal: boolean;
  estimate: EstimateResult;
  notes: string[];
};

const STANDARD_PROPOSAL_MW = 9.9;
const LAND_PER_MW_SQM = 1650;

const round = (value: number, digits = 2) => Number(value.toFixed(digits));

export function parseBoundaryPoints(boundaryText: string) {
  return boundaryText
    .split(/\r?\n|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/[,\t ]+/).filter(Boolean);
      if (parts.length < 2) return null;

      const lat = Number(parts[0]);
      const lng = Number(parts[1]);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

      return { lat, lng };
    })
    .filter(Boolean) as BoundaryPoint[];
}

export function calculatePolygonAreaSqm(points: BoundaryPoint[]) {
  if (points.length < 3) return 0;

  const avgLatRad =
    (points.reduce((sum, point) => sum + point.lat, 0) / points.length) *
    (Math.PI / 180);
  const metersPerDegreeLat = 111_320;
  const metersPerDegreeLng = 111_320 * Math.cos(avgLatRad);
  const projected = points.map((point) => ({
    x: point.lng * metersPerDegreeLng,
    y: point.lat * metersPerDegreeLat,
  }));

  let area = 0;

  for (let index = 0; index < projected.length; index += 1) {
    const current = projected[index];
    const next = projected[(index + 1) % projected.length];
    area += current.x * next.y - next.x * current.y;
  }

  return Math.abs(area) / 2;
}

function calculateAreaSqm(input: B2BLeadInput, points: BoundaryPoint[]) {
  if (points.length >= 3) return calculatePolygonAreaSqm(points);
  if (input.widthM > 0 && input.depthM > 0) return input.widthM * input.depthM;
  return 0;
}

function recommendCapacityMw(usableAreaSqm: number) {
  const rawCapacity = usableAreaSqm / LAND_PER_MW_SQM;
  if (rawCapacity >= STANDARD_PROPOSAL_MW) return STANDARD_PROPOSAL_MW;
  return round(Math.max(0.5, rawCapacity), 1);
}

export function buildB2BLeadProposal(input: B2BLeadInput): B2BLeadResult {
  const boundaryPoints = parseBoundaryPoints(input.boundaryText);
  const areaSqm = calculateAreaSqm(input, boundaryPoints);
  const usableAreaSqm = areaSqm * (input.landUseFactorPct / 100);
  const recommendedCapacityMw = recommendCapacityMw(usableAreaSqm);
  const isStandardProposal = recommendedCapacityMw === STANDARD_PROPOSAL_MW;
  const leadName = input.companyName || "Prospect";
  const anchorPoint = boundaryPoints[0];

  const estimate = calculateEstimate(
    {
      ...DEFAULT_INPUT,
      projectName: `${leadName} Quick Proposal`,
      siteName: leadName,
      siteAddress: input.siteAddress || DEFAULT_INPUT.siteAddress,
      latitude: anchorPoint?.lat ?? DEFAULT_INPUT.latitude,
      longitude: anchorPoint?.lng ?? DEFAULT_INPUT.longitude,
      capacityMw: recommendedCapacityMw,
      startYear: input.preferredStartYear,
    },
    DEFAULT_REFERENCE_PROJECT,
  );

  const notes = [
    boundaryPoints.length >= 3
      ? `${boundaryPoints.length} boundary points were converted into a polygon area.`
      : "Boundary polygon was incomplete, so rectangular site dimensions were used.",
    `Usable land factor ${input.landUseFactorPct.toFixed(0)}% applied to gross site area.`,
    isStandardProposal
      ? `Site can support the standard ${STANDARD_PROPOSAL_MW}MW commercial proposal.`
      : `Site appears better suited to ${recommendedCapacityMw.toFixed(1)}MW based on current usable area.`,
    `Estimate is anchored to the built-in ${DEFAULT_REFERENCE_PROJECT.referenceYear} / ${DEFAULT_REFERENCE_PROJECT.referenceCapacityMw}MW reference project.`,
  ];

  return {
    areaSqm: round(areaSqm, 1),
    areaPyeong: round(areaSqm / 3.305785, 1),
    usableAreaSqm: round(usableAreaSqm, 1),
    boundaryPoints,
    recommendedCapacityMw,
    isStandardProposal,
    estimate,
    notes,
  };
}
