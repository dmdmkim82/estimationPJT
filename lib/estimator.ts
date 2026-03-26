export type ProjectType = "singleOutdoor" | "singleOffice" | "multiLevel";
export type CostCategory = "S" | "P" | "C";

export type ReferenceProjectItem = {
  code: string;
  name: string;
  category: CostCategory;
  amountEok: number;
  note?: string;
};

export type ReferenceProject = {
  id: string;
  name: string;
  source: "built-in" | "excel-upload";
  sourceFileName?: string;
  referenceYear: number;
  referenceCapacityMw: number;
  totalEok: number;
  items: ReferenceProjectItem[];
  notes: string[];
};

export type DrawingChangeInput = {
  referenceDrawingName: string;
  targetDrawingName: string;
  civilPct: number;
  electricalPct: number;
  mechanicalPct: number;
  controlPct: number;
};

export type InflationProfileInput = {
  sourceLabel: string;
  serviceRate: number;
  procurementRate: number;
  constructionRate: number;
};

export type LcoeInput = {
  capacityFactorPct: number;
  fixedOandMRatePct: number;
  stackReplacementRatePct: number;
  fuelCostKrwPerKwh: number;
  discountRatePct: number;
  projectLifeYears: number;
};

export type EstimateInput = {
  projectName: string;
  siteName: string;
  siteAddress: string;
  latitude: number;
  longitude: number;
  projectType: ProjectType;
  capacityMw: number;
  baseYear: number;
  startYear: number;
  marginRate: number;
  warrantyRate: number;
  siteSurvey: Record<string, number>;
  drawingChange: DrawingChangeInput;
  inflation: InflationProfileInput;
  lcoe: LcoeInput;
};

export type CostItem = {
  code: string;
  name: string;
  category: CostCategory;
  kind: "reference" | "project-addon" | "site-survey" | "drawing-change";
  amountEok: number;
  adjustedAmountEok: number;
  unitPriceEok?: number;
  qty?: number;
  note?: string;
  basis?: string;
};

export type RiskRow = {
  label: string;
  total: number;
};

export type RiskFinding = {
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  reason: string;
  mitigation: string;
  impactEok: number;
};

export type BasisPoint = {
  title: string;
  detail: string;
};

export type LcoeBenchmark = {
  label: string;
  lcoeKrwPerKwh: number;
  deltaPct: number;
  note: string;
};

export type LcoeResult = {
  fuelCellKrwPerKwh: number;
  annualGenerationMWh: number;
  annualizedCapexEok: number;
  annualFuelCostEok: number;
  annualFixedCostEok: number;
  benchmarks: LcoeBenchmark[];
};

export type LayoutBlock = {
  id: string;
  label: string;
  kind: "module" | "aux" | "grid";
  x: number;
  y: number;
  w: number;
  h: number;
};

export type LayoutPreview = {
  moduleCount: number;
  rows: number;
  cols: number;
  estimatedLandM2: number;
  blocks: LayoutBlock[];
  notes: string[];
};

export type EstimateResult = {
  years: number;
  capacityFactor: number;
  referenceProjectName: string;
  referenceYear: number;
  referenceCapacityMw: number;
  referenceTotalEok: number;
  scaledReferenceTotalEok: number;
  escalatedReferenceTotalEok: number;
  costItems: CostItem[];
  categoryTotals: Record<CostCategory, number>;
  siteItems: CostItem[];
  drawingItems: CostItem[];
  costSubtotal: number;
  siteSubtotal: number;
  drawingSubtotal: number;
  constructionQuote: number;
  warranty: number;
  grandTotal: number;
  referenceDeltaEok: number;
  referenceDeltaPct: number;
  riskGrade: "LOW" | "MEDIUM" | "HIGH";
  scenarios: RiskRow[];
  strategies: RiskRow[];
  findings: RiskFinding[];
  basis: BasisPoint[];
  lcoe: LcoeResult;
  layout: LayoutPreview;
  mapQuery: string;
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
  note: string;
};

const round = (value: number, digits = 4) => Number(value.toFixed(digits));

const DEFAULT_REFERENCE_ITEMS: ReferenceProjectItem[] = [
  {
    code: "S-101",
    name: "Engineering / permitting",
    category: "S",
    amountEok: 12.44,
    note: "Reference PJT design, permit, licensing package",
  },
  {
    code: "S-102",
    name: "Project management / commissioning",
    category: "S",
    amountEok: 10.9,
    note: "Reference PJT PMO and startup support",
  },
  {
    code: "P-201",
    name: "Fuel-cell module package",
    category: "P",
    amountEok: 22.1,
    note: "Main SOFC / BOP procurement package",
  },
  {
    code: "P-202",
    name: "Balance-of-plant equipment",
    category: "P",
    amountEok: 8.4,
    note: "Skids, water treatment, auxiliaries",
  },
  {
    code: "P-203",
    name: "Electrical package",
    category: "P",
    amountEok: 6.04,
    note: "Transformers, switchgear, controls interface",
  },
  {
    code: "C-301",
    name: "Civil and foundation works",
    category: "C",
    amountEok: 18.5,
    note: "Ground improvement and equipment foundation",
  },
  {
    code: "C-302",
    name: "Mechanical erection / piping",
    category: "C",
    amountEok: 15.8,
    note: "Mechanical installation and utility routing",
  },
  {
    code: "C-303",
    name: "Electrical installation",
    category: "C",
    amountEok: 10.2,
    note: "Cable, terminations, panel hookup",
  },
  {
    code: "C-304",
    name: "Auxiliary building / enclosure",
    category: "C",
    amountEok: 11.28,
    note: "Ancillary structures and utility rooms",
  },
];

const DEFAULT_REFERENCE_TOTAL = round(
  DEFAULT_REFERENCE_ITEMS.reduce((sum, item) => sum + item.amountEok, 0),
  2,
);

export const DEFAULT_REFERENCE_PROJECT: ReferenceProject = {
  id: "built-in-2025-9p9mw",
  name: "PJT Added Workbook",
  source: "built-in",
  referenceYear: 2025,
  referenceCapacityMw: 9.9,
  totalEok: DEFAULT_REFERENCE_TOTAL,
  items: DEFAULT_REFERENCE_ITEMS,
  notes: [
    "Built-in fallback reference matching the reviewed 9.9MW workbook.",
    "Use uploaded Excel references to improve fidelity for actual bids.",
  ],
};

export const DEFAULT_REFERENCE_DATABASE: ReferenceProject[] = [
  DEFAULT_REFERENCE_PROJECT,
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
      note: "Base-year unit allowance per MW",
      basis: "Office / admin enclosure",
    },
    {
      code: "ADD-C-306",
      name: "HVAC and ancillary systems",
      category: "C",
      kind: "project-addon",
      amountEok: 0.48,
      adjustedAmountEok: 0,
      note: "Base-year unit allowance per MW",
      basis: "Building HVAC and support systems",
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
      note: "Base-year unit allowance per MW",
      basis: "Stacked plant arrangement",
    },
    {
      code: "ADD-C-308",
      name: "Vertical transfer equipment",
      category: "C",
      kind: "project-addon",
      amountEok: 0.32,
      adjustedAmountEok: 0,
      note: "Base-year unit allowance per MW",
      basis: "Vertical logistics / lifting allowance",
    },
  ],
};

export const PROJECT_OPTIONS: ProjectOption[] = [
  {
    id: "singleOutdoor",
    label: "Single Outdoor",
    description: "Closest to the 9.9MW outdoor reference PJT.",
  },
  {
    id: "singleOffice",
    label: "Single + Office",
    description: "Adds office / support building scope to the outdoor baseline.",
  },
  {
    id: "multiLevel",
    label: "Multi Level",
    description: "Assumes stacked arrangement with additional structure and handling.",
  },
];

export const SITE_SURVEY_OPTIONS: SiteSurveyOption[] = [
  {
    id: "grading",
    label: "Site grading",
    unit: "lot",
    unitPriceEokPerUnit: 1.5,
    note: "Bulk earthwork and leveling",
  },
  {
    id: "retainingWall",
    label: "Retaining wall",
    unit: "m",
    unitPriceEokPerUnit: 0.025,
    note: "Slope stabilization or site retaining wall",
  },
  {
    id: "hru",
    label: "HRU",
    unit: "MW",
    unitPriceEokPerUnit: 0.12,
    note: "Heat recovery package tied to output scale",
  },
  {
    id: "hws",
    label: "Hot-water system",
    unit: "MW",
    unitPriceEokPerUnit: 0.08,
    note: "District heat or utility hot-water distribution",
  },
  {
    id: "mws",
    label: "Medium-water system",
    unit: "MW",
    unitPriceEokPerUnit: 0.06,
    note: "Process / utility water balance package",
  },
  {
    id: "heatPipe",
    label: "Heat pipe 200A",
    unit: "km",
    unitPriceEokPerUnit: 0.35,
    note: "District utility routing",
  },
  {
    id: "lineOverhead",
    label: "22.9kV overhead line",
    unit: "km",
    unitPriceEokPerUnit: 0.45,
    note: "Overhead grid tie",
  },
  {
    id: "lineUnderground",
    label: "22.9kV underground line",
    unit: "km",
    unitPriceEokPerUnit: 0.8,
    note: "Underground grid tie",
  },
];

export const DEFAULT_INPUT: EstimateInput = {
  projectName: "Incheon Fuel Cell EPC",
  siteName: "Songdo District Energy Site",
  siteAddress: "Songdo, Incheon, South Korea",
  latitude: 37.3886,
  longitude: 126.6432,
  projectType: "singleOutdoor",
  capacityMw: 10,
  baseYear: 2025,
  startYear: 2027,
  marginRate: 12,
  warrantyRate: 1.5,
  siteSurvey: Object.fromEntries(SITE_SURVEY_OPTIONS.map((item) => [item.id, 0])),
  drawingChange: {
    referenceDrawingName: "",
    targetDrawingName: "",
    civilPct: 0,
    electricalPct: 0,
    mechanicalPct: 0,
    controlPct: 0,
  },
  inflation: {
    sourceLabel: "2025 Korea EPC composite price-index assumption",
    serviceRate: 2.8,
    procurementRate: 5.4,
    constructionRate: 6.8,
  },
  lcoe: {
    capacityFactorPct: 90,
    fixedOandMRatePct: 3,
    stackReplacementRatePct: 1.5,
    fuelCostKrwPerKwh: 110,
    discountRatePct: 6,
    projectLifeYears: 20,
  },
};

export const REFERENCE_TEMPLATE = {
  name: DEFAULT_REFERENCE_PROJECT.name,
  referenceYear: DEFAULT_REFERENCE_PROJECT.referenceYear,
  referenceCapacityMw: DEFAULT_REFERENCE_PROJECT.referenceCapacityMw,
  referenceType: "Single Outdoor",
  referenceTotalEok: DEFAULT_REFERENCE_PROJECT.totalEok,
};

function getAnnualRateForCategory(
  category: CostCategory,
  inflation: InflationProfileInput,
) {
  if (category === "S") return inflation.serviceRate / 100;
  if (category === "P") return inflation.procurementRate / 100;
  return inflation.constructionRate / 100;
}

function inflateAmount(
  amountEok: number,
  category: CostCategory,
  years: number,
  inflation: InflationProfileInput,
) {
  const annualRate = getAnnualRateForCategory(category, inflation);
  return amountEok * Math.pow(1 + annualRate, years);
}

function computeMarginTotals(
  costSubtotal: number,
  siteSubtotal: number,
  marginRate: number,
  warrantyRate: number,
) {
  const quotedBase = costSubtotal + siteSubtotal;
  const constructionQuote = quotedBase / (1 - marginRate / 100);
  const warranty = constructionQuote * (warrantyRate / 100);
  const grandTotal = constructionQuote + warranty;

  return {
    constructionQuote,
    warranty,
    grandTotal,
  };
}

function reduceCategoryTotals(items: CostItem[]) {
  return items.reduce<Record<CostCategory, number>>(
    (acc, item) => {
      acc[item.category] += item.adjustedAmountEok;
      return acc;
    },
    { S: 0, P: 0, C: 0 },
  );
}

function buildDrawingItems(
  input: EstimateInput,
  baseCategoryTotals: Record<CostCategory, number>,
  years: number,
): CostItem[] {
  const drawing = input.drawingChange;
  const items: Array<{
    code: string;
    name: string;
    category: CostCategory;
    pct: number;
    amountEok: number;
    note: string;
  }> = [];

  const civilBase = baseCategoryTotals.C * 0.4;
  if (drawing.civilPct > 0) {
    items.push({
      code: "DRW-C-401",
      name: "Civil drawing variation",
      category: "C",
      pct: drawing.civilPct,
      amountEok: civilBase * (drawing.civilPct / 100),
      note: "Applied to civil / foundation-heavy construction slice",
    });
  }

  const electricalBase = baseCategoryTotals.C * 0.2 + baseCategoryTotals.P * 0.12;
  if (drawing.electricalPct > 0) {
    items.push({
      code: "DRW-P-402",
      name: "Electrical drawing variation",
      category: "P",
      pct: drawing.electricalPct,
      amountEok: electricalBase * (drawing.electricalPct / 100),
      note: "Applied to switchgear, cable, and connection package",
    });
  }

  const mechanicalBase = baseCategoryTotals.C * 0.18 + baseCategoryTotals.P * 0.16;
  if (drawing.mechanicalPct > 0) {
    items.push({
      code: "DRW-C-403",
      name: "Mechanical / piping variation",
      category: "C",
      pct: drawing.mechanicalPct,
      amountEok: mechanicalBase * (drawing.mechanicalPct / 100),
      note: "Applied to piping, skids, and mechanical tie-ins",
    });
  }

  const controlBase = baseCategoryTotals.S * 0.18 + baseCategoryTotals.P * 0.08;
  if (drawing.controlPct > 0) {
    items.push({
      code: "DRW-S-404",
      name: "Control / I&C variation",
      category: "S",
      pct: drawing.controlPct,
      amountEok: controlBase * (drawing.controlPct / 100),
      note: "Applied to logic, controls, and interface engineering",
    });
  }

  return items.map((item) => ({
    code: item.code,
    name: item.name,
    category: item.category,
    kind: "drawing-change",
    amountEok: item.amountEok,
    adjustedAmountEok: inflateAmount(item.amountEok, item.category, years, input.inflation),
    qty: item.pct,
    note: item.note,
    basis:
      input.drawingChange.referenceDrawingName && input.drawingChange.targetDrawingName
        ? `${input.drawingChange.referenceDrawingName} -> ${input.drawingChange.targetDrawingName}`
        : "Manual discipline delta",
  }));
}

function calculateLcoe(grandTotal: number, input: EstimateInput): LcoeResult {
  const annualGenerationMWh =
    input.capacityMw * 8760 * (input.lcoe.capacityFactorPct / 100);
  const annualGenerationKWh = annualGenerationMWh * 1000;
  const capexKrw = grandTotal * 100_000_000;
  const discountRate = input.lcoe.discountRatePct / 100;
  const life = Math.max(1, input.lcoe.projectLifeYears);
  const capitalRecoveryFactor =
    discountRate === 0
      ? 1 / life
      : (discountRate * Math.pow(1 + discountRate, life)) /
        (Math.pow(1 + discountRate, life) - 1);

  const annualizedCapexKrw = capexKrw * capitalRecoveryFactor;
  const annualFuelCostKrw = annualGenerationKWh * input.lcoe.fuelCostKrwPerKwh;
  const annualFixedCostKrw =
    capexKrw *
    ((input.lcoe.fixedOandMRatePct + input.lcoe.stackReplacementRatePct) / 100);

  const fuelCellKrwPerKwh =
    (annualizedCapexKrw + annualFuelCostKrw + annualFixedCostKrw) /
    Math.max(1, annualGenerationKWh);

  const benchmarks = [
    {
      label: "Utility solar PV",
      lcoeKrwPerKwh: 118,
      note: "Internal planning benchmark",
    },
    {
      label: "Onshore wind",
      lcoeKrwPerKwh: 136,
      note: "Internal planning benchmark",
    },
    {
      label: "LNG CHP",
      lcoeKrwPerKwh: 173,
      note: "Internal planning benchmark",
    },
    {
      label: "BESS + renewable hybrid",
      lcoeKrwPerKwh: 194,
      note: "Internal planning benchmark",
    },
  ].map((item) => ({
    ...item,
    deltaPct: round((fuelCellKrwPerKwh / item.lcoeKrwPerKwh - 1) * 100, 1),
  }));

  return {
    fuelCellKrwPerKwh: round(fuelCellKrwPerKwh, 1),
    annualGenerationMWh: round(annualGenerationMWh, 0),
    annualizedCapexEok: round(annualizedCapexKrw / 100_000_000, 2),
    annualFuelCostEok: round(annualFuelCostKrw / 100_000_000, 2),
    annualFixedCostEok: round(annualFixedCostKrw / 100_000_000, 2),
    benchmarks,
  };
}

function buildLayoutPreview(input: EstimateInput): LayoutPreview {
  const moduleCapacityMw =
    input.projectType === "multiLevel"
      ? 0.6
      : input.projectType === "singleOffice"
        ? 0.5
        : 0.45;
  const moduleCount = Math.max(1, Math.ceil(input.capacityMw / moduleCapacityMw));
  const cols = Math.max(2, Math.ceil(Math.sqrt(moduleCount * 1.4)));
  const rows = Math.max(1, Math.ceil(moduleCount / cols));
  const blocks: LayoutBlock[] = [];

  for (let index = 0; index < moduleCount; index += 1) {
    const row = Math.floor(index / cols);
    const col = index % cols;
    blocks.push({
      id: `module-${index + 1}`,
      label: `FC-${index + 1}`,
      kind: "module",
      x: col * 1.25,
      y: row * 1.08,
      w: 1,
      h: 0.82,
    });
  }

  blocks.push({
    id: "aux-control",
    label: "Control / office",
    kind: "aux",
    x: cols * 1.25 + 0.25,
    y: 0,
    w: 1.35,
    h: 0.95,
  });
  blocks.push({
    id: "aux-water",
    label: "Water / utility",
    kind: "aux",
    x: cols * 1.25 + 0.25,
    y: 1.15,
    w: 1.35,
    h: 0.95,
  });
  blocks.push({
    id: "grid-yard",
    label: "Grid tie",
    kind: "grid",
    x: cols * 1.25 + 0.25,
    y: 2.3,
    w: 1.35,
    h: 1.05,
  });

  const lineLength =
    (input.siteSurvey.lineOverhead || 0) + (input.siteSurvey.lineUnderground || 0);
  const estimatedLandM2 =
    Math.round(moduleCount * 420 + 2400 + lineLength * 1100 + (input.siteSurvey.grading || 0) * 1200);

  const notes = [
    `${moduleCount} fuel-cell blocks arranged in ${rows} rows x ${cols} cols.`,
    "Auxiliary zone reserves control building, utility systems, and grid tie yard.",
    lineLength > 0
      ? `Grid interconnection corridor reflects ${lineLength.toFixed(1)}km of line scope.`
      : "No transmission corridor quantity entered yet.",
  ];

  return {
    moduleCount,
    rows,
    cols,
    estimatedLandM2,
    blocks,
    notes,
  };
}

function buildRiskFindings(
  input: EstimateInput,
  years: number,
  referenceProject: ReferenceProject,
  siteSubtotal: number,
  drawingSubtotal: number,
  categoryTotals: Record<CostCategory, number>,
): RiskFinding[] {
  const findings: RiskFinding[] = [];

  if (years >= 2) {
    findings.push({
      title: "Price escalation exposure",
      severity: years >= 3 ? "HIGH" : "MEDIUM",
      reason: `${years} years of escalation are being applied from ${input.baseYear} to ${input.startYear}.`,
      mitigation: "Lock long-lead procurement packages early and separate escalation clauses by category.",
      impactEok: round(
        categoryTotals.P * (Math.pow(1 + input.inflation.procurementRate / 100, 0.5) - 1),
        2,
      ),
    });
  }

  if (siteSubtotal >= 5) {
    findings.push({
      title: "Site preparation / utility scope risk",
      severity: siteSubtotal >= 10 ? "HIGH" : "MEDIUM",
      reason: "Civil and grid interconnection adders are materially affecting the estimate.",
      mitigation: "Validate geotechnical, utility corridor, and grid-tie assumptions during early site review.",
      impactEok: round(siteSubtotal * 0.15, 2),
    });
  }

  if (drawingSubtotal >= 2) {
    findings.push({
      title: "Drawing variation risk",
      severity: drawingSubtotal >= 5 ? "HIGH" : "MEDIUM",
      reason: "Reference and target drawings differ enough to require explicit discipline-level allowances.",
      mitigation: "Run a formal model / drawing delta review before final bid freeze.",
      impactEok: round(drawingSubtotal * 0.3, 2),
    });
  }

  const scaleDelta = input.capacityMw / referenceProject.referenceCapacityMw - 1;
  if (Math.abs(scaleDelta) >= 0.35) {
    findings.push({
      title: "Reference scaling uncertainty",
      severity: Math.abs(scaleDelta) >= 0.6 ? "HIGH" : "MEDIUM",
      reason: `Target capacity is ${(scaleDelta * 100).toFixed(1)}% away from the selected reference project.`,
      mitigation: "Use at least one closer-capacity reference project or normalize by equipment block count.",
      impactEok: round(categoryTotals.P * Math.abs(scaleDelta) * 0.08, 2),
    });
  }

  if (referenceProject.source === "built-in") {
    findings.push({
      title: "Reference fidelity gap",
      severity: "LOW",
      reason: "The estimate is still anchored to the built-in sample workbook, not an uploaded project-specific reference.",
      mitigation: "Upload a detailed reference workbook to replace the generic baseline.",
      impactEok: round(categoryTotals.S * 0.03, 2),
    });
  }

  return findings;
}

function inferRiskGrade(findings: RiskFinding[], scenarios: RiskRow[], grandTotal: number) {
  if (findings.some((item) => item.severity === "HIGH")) return "HIGH" as const;
  if (findings.some((item) => item.severity === "MEDIUM")) return "MEDIUM" as const;
  const worstScenario = Math.max(...scenarios.map((item) => item.total));
  const delta = worstScenario / Math.max(1, grandTotal) - 1;
  if (delta >= 0.12) return "HIGH" as const;
  if (delta >= 0.05) return "MEDIUM" as const;
  return "LOW" as const;
}

export function formatEok(value: number, digits = 2) {
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}\uC5B5\uC6D0`;
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function inferCostCategoryFromText(text: string): CostCategory {
  const normalized = text.toLowerCase();
  if (
    /(service|engineering|permit|commission|pm|startup|licen|용역|설계|인허가|시운전|pm)/i.test(
      normalized,
    )
  ) {
    return "S";
  }

  if (
    /(equipment|package|procurement|purchase|material|stack|module|transformer|switchgear|기기|주기기|구매|자재|변압기|반출입)/i.test(
      normalized,
    )
  ) {
    return "P";
  }

  return "C";
}

export function calculateEstimate(
  input: EstimateInput,
  referenceProject: ReferenceProject = DEFAULT_REFERENCE_PROJECT,
): EstimateResult {
  const years = Math.max(0, input.startYear - input.baseYear);
  const capacityFactor = input.capacityMw / Math.max(0.1, referenceProject.referenceCapacityMw);

  const referenceItems = referenceProject.items.map<CostItem>((item) => ({
    code: item.code,
    name: item.name,
    category: item.category,
    kind: "reference",
    amountEok: item.amountEok * capacityFactor,
    adjustedAmountEok: inflateAmount(
      item.amountEok * capacityFactor,
      item.category,
      years,
      input.inflation,
    ),
    note: item.note ?? `${referenceProject.name} baseline`,
    basis: referenceProject.name,
  }));

  const projectAddonItems = PROJECT_ADDONS_PER_MW[input.projectType].map((item) => {
    const amountEok = item.amountEok * input.capacityMw;

    return {
      ...item,
      amountEok,
      adjustedAmountEok: inflateAmount(amountEok, item.category, years, input.inflation),
      qty: input.capacityMw,
      unitPriceEok: item.amountEok,
    };
  });

  const preDrawingItems = [...referenceItems, ...projectAddonItems];
  const preDrawingBaseCategoryTotals = preDrawingItems.reduce<Record<CostCategory, number>>(
    (acc, item) => {
      acc[item.category] += item.amountEok;
      return acc;
    },
    { S: 0, P: 0, C: 0 },
  );
  const drawingItems = buildDrawingItems(input, preDrawingBaseCategoryTotals, years);

  const siteItems = SITE_SURVEY_OPTIONS.map((option) => {
    const qty = input.siteSurvey[option.id] || 0;
    if (qty <= 0) return null;

    const amountEok = option.unitPriceEokPerUnit * qty;

    return {
      code: `SITE-${option.id}`,
      name: option.label,
      category: "C" as const,
      kind: "site-survey" as const,
      amountEok,
      adjustedAmountEok: inflateAmount(amountEok, "C", years, input.inflation),
      qty,
      unitPriceEok: option.unitPriceEokPerUnit,
      note: `${option.note} / ${option.unit}`,
      basis: `Site review input (${option.unit})`,
    };
  }).filter(Boolean) as CostItem[];

  const costItems = [...preDrawingItems, ...drawingItems];
  const categoryTotals = reduceCategoryTotals(costItems);
  const costSubtotal = costItems.reduce((sum, item) => sum + item.adjustedAmountEok, 0);
  const siteSubtotal = siteItems.reduce((sum, item) => sum + item.adjustedAmountEok, 0);
  const drawingSubtotal = drawingItems.reduce((sum, item) => sum + item.adjustedAmountEok, 0);
  const baseTotals = computeMarginTotals(
    costSubtotal,
    siteSubtotal,
    input.marginRate,
    input.warrantyRate,
  );

  const inflationScenario = computeMarginTotals(
    costSubtotal * 1.025,
    siteSubtotal * 1.025,
    input.marginRate,
    input.warrantyRate,
  );

  const delayedCostSubtotal = costItems.reduce((sum, item) => {
    const annualRate = getAnnualRateForCategory(item.category, input.inflation);
    return sum + item.adjustedAmountEok * (1 + annualRate / 2);
  }, 0);

  const delayedSiteSubtotal = siteItems.reduce(
    (sum, item) =>
      sum + item.adjustedAmountEok * (1 + input.inflation.constructionRate / 100 / 2),
    0,
  );

  const oneHalfYearDelayScenario = computeMarginTotals(
    delayedCostSubtotal,
    delayedSiteSubtotal,
    input.marginRate,
    input.warrantyRate,
  );

  const gridShock = computeMarginTotals(
    costSubtotal,
    siteSubtotal + Math.max(1, siteSubtotal * 0.12),
    input.marginRate,
    input.warrantyRate,
  );

  const commodityShock = computeMarginTotals(
    costSubtotal + categoryTotals.P * 0.06,
    siteSubtotal,
    input.marginRate,
    input.warrantyRate,
  );

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
    { label: "Composite inflation +2.5%", total: inflationScenario.grandTotal },
    { label: "Delay +6 months", total: oneHalfYearDelayScenario.grandTotal },
    { label: "Grid / civil surprise", total: gridShock.grandTotal },
    { label: "Procurement commodity +6%", total: commodityShock.grandTotal },
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

  const escalatedReferenceTotalEok = referenceItems.reduce(
    (sum, item) => sum + item.adjustedAmountEok,
    0,
  );
  const comparisonBase = Math.max(0.01, escalatedReferenceTotalEok);
  const referenceDeltaEok = baseTotals.grandTotal - comparisonBase;
  const referenceDeltaPct = (referenceDeltaEok / comparisonBase) * 100;
  const findings = buildRiskFindings(
    input,
    years,
    referenceProject,
    siteSubtotal,
    drawingSubtotal,
    categoryTotals,
  );
  const riskGrade = inferRiskGrade(findings, scenarios, baseTotals.grandTotal);
  const lcoe = calculateLcoe(baseTotals.grandTotal, input);
  const layout = buildLayoutPreview(input);

  const basis: BasisPoint[] = [
    {
      title: "Selected reference project",
      detail: `${referenceProject.name} (${referenceProject.referenceCapacityMw}MW / ${referenceProject.referenceYear}) with ${referenceProject.items.length} cost items.`,
    },
    {
      title: "Capacity scaling",
      detail: `${referenceProject.referenceCapacityMw}MW reference scaled to ${input.capacityMw.toFixed(1)}MW (${formatPercent(capacityFactor * 100, 1)} of reference).`,
    },
    {
      title: "Escalation logic",
      detail: `${input.baseYear} -> ${input.startYear}, using ${input.inflation.sourceLabel} with S/P/C rates ${formatPercent(input.inflation.serviceRate)}, ${formatPercent(input.inflation.procurementRate)}, ${formatPercent(input.inflation.constructionRate)}.`,
    },
    {
      title: "Site review adders",
      detail:
        siteItems.length > 0
          ? `${siteItems.length} site-review items applied, totaling ${formatEok(siteSubtotal)} after escalation.`
          : "No site-review quantity adders entered yet.",
    },
    {
      title: "Drawing variation",
      detail:
        drawingItems.length > 0
          ? `${drawingItems.length} discipline allowances applied from drawing deltas, totaling ${formatEok(drawingSubtotal)}.`
          : "No drawing-change allowance applied.",
    },
    {
      title: "Commercial assumptions",
      detail: `Target margin ${formatPercent(input.marginRate)} and warranty ${formatPercent(input.warrantyRate)} applied to EPC subtotal.`,
    },
    {
      title: "LCOE assumption",
      detail: `Capacity factor ${formatPercent(input.lcoe.capacityFactorPct)}, fuel ${input.lcoe.fuelCostKrwPerKwh.toFixed(0)} KRW/kWh, project life ${input.lcoe.projectLifeYears} years.`,
    },
  ];

  const mapQuery =
    input.latitude || input.longitude
      ? `${input.latitude},${input.longitude}`
      : `${input.siteName} ${input.siteAddress}`.trim();

  return {
    years,
    capacityFactor: round(capacityFactor),
    referenceProjectName: referenceProject.name,
    referenceYear: referenceProject.referenceYear,
    referenceCapacityMw: referenceProject.referenceCapacityMw,
    referenceTotalEok: round(referenceProject.totalEok, 2),
    scaledReferenceTotalEok: round(referenceProject.totalEok * capacityFactor, 2),
    escalatedReferenceTotalEok: round(escalatedReferenceTotalEok, 2),
    costItems,
    categoryTotals: {
      S: round(categoryTotals.S, 2),
      P: round(categoryTotals.P, 2),
      C: round(categoryTotals.C, 2),
    },
    siteItems,
    drawingItems,
    costSubtotal: round(costSubtotal, 2),
    siteSubtotal: round(siteSubtotal, 2),
    drawingSubtotal: round(drawingSubtotal, 2),
    constructionQuote: round(baseTotals.constructionQuote, 2),
    warranty: round(baseTotals.warranty, 2),
    grandTotal: round(baseTotals.grandTotal, 2),
    referenceDeltaEok: round(referenceDeltaEok, 2),
    referenceDeltaPct: round(referenceDeltaPct, 1),
    riskGrade,
    scenarios: scenarios.map((row) => ({
      label: row.label,
      total: round(row.total, 2),
    })),
    strategies: strategies.map((row) => ({
      label: row.label,
      total: round(row.total, 2),
    })),
    findings: findings.map((item) => ({
      ...item,
      impactEok: round(item.impactEok, 2),
    })),
    basis,
    lcoe,
    layout,
    mapQuery,
  };
}
