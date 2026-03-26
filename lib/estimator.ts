export type ProjectType = "singleOutdoor" | "singleOffice" | "multiLevel";
export type CostCategory = "S" | "P" | "C";

export type EstimateInput = {
  projectType: ProjectType;
  capacityMw: number;
  baseYear: number;
  startYear: number;
  marginRate: number;
  warrantyRate: number;
  siteSurvey: Record<string, number>;
};

export type CostItem = {
  code: string;
  name: string;
  category: CostCategory;
  kind: "reference" | "project-addon" | "site-survey";
  amountEok: number;
  adjustedAmountEok: number;
  unitPriceEok?: number;
  qty?: number;
  note?: string;
};

export type RiskRow = {
  label: string;
  total: number;
};

export type EstimateResult = {
  years: number;
  capacityFactor: number;
  referenceYear: number;
  referenceCapacityMw: number;
  referenceTotalEok: number;
  scaledReferenceTotalEok: number;
  costItems: CostItem[];
  categoryTotals: Record<CostCategory, number>;
  siteItems: CostItem[];
  costSubtotal: number;
  siteSubtotal: number;
  constructionQuote: number;
  warranty: number;
  grandTotal: number;
  riskGrade: "LOW" | "MEDIUM" | "HIGH";
  scenarios: RiskRow[];
  strategies: RiskRow[];
};

type ReferenceSection = {
  category: CostCategory;
  label: string;
  baseAmountEok: number;
  inflationRate: number;
};

type ProjectOption = {
  id: ProjectType;
  label: string;
  description: string;
};

type SiteSurveyOption = {
  id: string;
  label: string;
  unit: string;
  unitPriceEokPerUnit: number;
};

const round = (value: number, digits = 4) => Number(value.toFixed(digits));

const REFERENCE_SECTIONS: ReferenceSection[] = [
  { category: "S", label: "Service", baseAmountEok: 23.34, inflationRate: 0.025 },
  { category: "P", label: "Procurement", baseAmountEok: 36.54, inflationRate: 0.05 },
  { category: "C", label: "Construction", baseAmountEok: 55.78, inflationRate: 0.075 },
];

const PROJECT_ADDONS_PER_MW: Record<ProjectType, CostItem[]> = {
  singleOutdoor: [],
  singleOffice: [
    {
      code: "ADD-C-305",
      name: "Office building and steel frame",
      category: "C",
      kind: "project-addon",
      amountEok: 1.2,
      adjustedAmountEok: 0,
      note: "2025 baseline per MW",
    },
    {
      code: "ADD-C-306",
      name: "HVAC and ancillary systems",
      category: "C",
      kind: "project-addon",
      amountEok: 0.48,
      adjustedAmountEok: 0,
      note: "2025 baseline per MW",
    },
  ],
  multiLevel: [
    {
      code: "ADD-C-307",
      name: "Multi-level structural frame",
      category: "C",
      kind: "project-addon",
      amountEok: 1.8,
      adjustedAmountEok: 0,
      note: "2025 baseline per MW",
    },
    {
      code: "ADD-C-308",
      name: "Vertical transfer equipment",
      category: "C",
      kind: "project-addon",
      amountEok: 0.32,
      adjustedAmountEok: 0,
      note: "2025 baseline per MW",
    },
  ],
};

export const PROJECT_OPTIONS: ProjectOption[] = [
  {
    id: "singleOutdoor",
    label: "Single Outdoor",
    description: "Matches the PJT workbook baseline.",
  },
  {
    id: "singleOffice",
    label: "Single + Office",
    description: "Adds office and support-building scope.",
  },
  {
    id: "multiLevel",
    label: "Multi Level",
    description: "Adds vertical structure and transfer scope.",
  },
];

export const SITE_SURVEY_OPTIONS: SiteSurveyOption[] = [
  { id: "grading", label: "Site grading", unit: "lot", unitPriceEokPerUnit: 1.5 },
  { id: "retainingWall", label: "Retaining wall", unit: "m", unitPriceEokPerUnit: 0.025 },
  { id: "hru", label: "HRU", unit: "MW", unitPriceEokPerUnit: 0.12 },
  { id: "hws", label: "Hot-water system", unit: "MW", unitPriceEokPerUnit: 0.08 },
  { id: "mws", label: "Medium-water system", unit: "MW", unitPriceEokPerUnit: 0.06 },
  { id: "heatPipe", label: "Heat pipe 200A", unit: "km", unitPriceEokPerUnit: 0.35 },
  {
    id: "lineOverhead",
    label: "22.9kV overhead line",
    unit: "km",
    unitPriceEokPerUnit: 0.45,
  },
  {
    id: "lineUnderground",
    label: "22.9kV underground line",
    unit: "km",
    unitPriceEokPerUnit: 0.8,
  },
];

export const DEFAULT_INPUT: EstimateInput = {
  projectType: "singleOutdoor",
  capacityMw: 10,
  baseYear: 2025,
  startYear: 2028,
  marginRate: 12,
  warrantyRate: 1.5,
  siteSurvey: Object.fromEntries(SITE_SURVEY_OPTIONS.map((item) => [item.id, 0])),
};

export const REFERENCE_TEMPLATE = {
  name: "PJT Added Workbook",
  referenceYear: 2025,
  referenceCapacityMw: 9.9,
  referenceType: "Single Outdoor",
  referenceTotalEok: 115.66,
};

function computeMarginTotals(
  costSubtotal: number,
  siteSubtotal: number,
  marginRate: number,
  warrantyRate: number,
) {
  const constructionQuote = (costSubtotal + siteSubtotal) / (1 - marginRate / 100);
  const warranty = constructionQuote * (warrantyRate / 100);
  const grandTotal = constructionQuote + warranty;

  return {
    constructionQuote,
    warranty,
    grandTotal,
  };
}

export function formatEok(value: number, digits = 2) {
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} x100M KRW`;
}

export function calculateEstimate(input: EstimateInput): EstimateResult {
  const years = Math.max(0, input.startYear - input.baseYear);
  const capacityFactor = input.capacityMw / REFERENCE_TEMPLATE.referenceCapacityMw;

  const baseItems = REFERENCE_SECTIONS.map<CostItem>((section) => {
    const amountEok = section.baseAmountEok * capacityFactor;
    const adjustedAmountEok = amountEok * Math.pow(1 + section.inflationRate, years);

    return {
      code: section.category,
      name: `${section.label} baseline`,
      category: section.category,
      kind: "reference",
      amountEok,
      adjustedAmountEok,
      note: `${REFERENCE_TEMPLATE.referenceYear} workbook baseline`,
    };
  });

  const projectAddonItems = PROJECT_ADDONS_PER_MW[input.projectType].map((item) => {
    const amountEok = item.amountEok * input.capacityMw;
    const adjustedAmountEok = amountEok * Math.pow(1 + 0.075, years);

    return {
      ...item,
      amountEok,
      adjustedAmountEok,
      qty: input.capacityMw,
      unitPriceEok: item.amountEok,
    };
  });

  const siteItems = SITE_SURVEY_OPTIONS.map((option) => {
    const qty = input.siteSurvey[option.id] || 0;
    if (qty <= 0) return null;
    const amountEok = option.unitPriceEokPerUnit * qty;
    const adjustedAmountEok = amountEok * Math.pow(1 + 0.075, years);

    return {
      code: `SITE-${option.id}`,
      name: option.label,
      category: "C" as const,
      kind: "site-survey" as const,
      amountEok,
      adjustedAmountEok,
      qty,
      unitPriceEok: option.unitPriceEokPerUnit,
      note: `Field scope / ${option.unit}`,
    };
  }).filter(Boolean) as CostItem[];

  const costItems = [...baseItems, ...projectAddonItems];
  const categoryTotals = costItems.reduce<Record<CostCategory, number>>(
    (acc, item) => {
      acc[item.category] += item.adjustedAmountEok;
      return acc;
    },
    { S: 0, P: 0, C: 0 },
  );

  const costSubtotal = costItems.reduce((sum, item) => sum + item.adjustedAmountEok, 0);
  const siteSubtotal = siteItems.reduce((sum, item) => sum + item.adjustedAmountEok, 0);
  const baseTotals = computeMarginTotals(
    costSubtotal,
    siteSubtotal,
    input.marginRate,
    input.warrantyRate,
  );

  const inflationScenario = computeMarginTotals(
    costSubtotal * 1.01,
    siteSubtotal * 1.01,
    input.marginRate,
    input.warrantyRate,
  );

  const delayedCostSubtotal = costItems.reduce((sum, item) => {
    const annualRate =
      item.category === "S" ? 0.025 : item.category === "P" ? 0.05 : 0.075;
    return sum + item.adjustedAmountEok * (1 + annualRate / 12);
  }, 0);

  const delayedSiteSubtotal = siteItems.reduce(
    (sum, item) => sum + item.adjustedAmountEok * (1 + 0.075 / 12),
    0,
  );

  const oneMonthDelayScenario = computeMarginTotals(
    delayedCostSubtotal,
    delayedSiteSubtotal,
    input.marginRate,
    input.warrantyRate,
  );

  const fxShock = baseTotals.grandTotal + categoryTotals.P * 0.4 * 0.1;

  const conservativeMargin = Math.min(49.9, input.marginRate + 3);
  const aggressiveMargin = Math.max(0, input.marginRate - 3);

  const conservative = computeMarginTotals(
    costSubtotal,
    siteSubtotal,
    conservativeMargin,
    input.warrantyRate,
  );
  const neutral = computeMarginTotals(
    costSubtotal,
    siteSubtotal,
    input.marginRate,
    input.warrantyRate,
  );
  const aggressive = computeMarginTotals(
    costSubtotal,
    siteSubtotal,
    aggressiveMargin,
    input.warrantyRate,
  );

  const scenarios: RiskRow[] = [
    { label: "Inflation +1%", total: inflationScenario.grandTotal },
    { label: "Delay +1 month", total: oneMonthDelayScenario.grandTotal },
    { label: "FX +10% on procurement exposure", total: fxShock },
  ];

  const strategies: RiskRow[] = [
    {
      label: `Conservative (${conservativeMargin.toFixed(1)}%)`,
      total: conservative.grandTotal,
    },
    { label: `Neutral (${input.marginRate.toFixed(1)}%)`, total: neutral.grandTotal },
    {
      label: `Aggressive (${aggressiveMargin.toFixed(1)}%)`,
      total: aggressive.grandTotal,
    },
  ];

  const worstCase = Math.max(...scenarios.map((row) => row.total));
  const delta = worstCase / baseTotals.grandTotal - 1;
  const riskGrade: EstimateResult["riskGrade"] =
    delta < 0.05 ? "LOW" : delta < 0.12 ? "MEDIUM" : "HIGH";

  return {
    years,
    capacityFactor: round(capacityFactor),
    referenceYear: REFERENCE_TEMPLATE.referenceYear,
    referenceCapacityMw: REFERENCE_TEMPLATE.referenceCapacityMw,
    referenceTotalEok: REFERENCE_TEMPLATE.referenceTotalEok,
    scaledReferenceTotalEok: round(
      REFERENCE_TEMPLATE.referenceTotalEok * capacityFactor,
    ),
    costItems,
    categoryTotals: {
      S: round(categoryTotals.S),
      P: round(categoryTotals.P),
      C: round(categoryTotals.C),
    },
    siteItems,
    costSubtotal: round(costSubtotal),
    siteSubtotal: round(siteSubtotal),
    constructionQuote: round(baseTotals.constructionQuote),
    warranty: round(baseTotals.warranty),
    grandTotal: round(baseTotals.grandTotal),
    riskGrade,
    scenarios: scenarios.map((row) => ({
      label: row.label,
      total: round(row.total),
    })),
    strategies: strategies.map((row) => ({
      label: row.label,
      total: round(row.total),
    })),
  };
}
