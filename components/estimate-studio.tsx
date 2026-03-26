"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { importReferenceWorkbook } from "@/lib/excel-import";
import {
  DEFAULT_INPUT,
  DEFAULT_REFERENCE_DATABASE,
  DEFAULT_REFERENCE_PROJECT,
  PROJECT_OPTIONS,
  SITE_SURVEY_OPTIONS,
  calculateEstimate,
  formatEok,
  formatPercent,
  type EstimateInput,
  type LayoutPreview,
  type ProjectType,
  type ReferenceProject,
  type RiskFinding,
} from "@/lib/estimator";

const STORAGE_KEY = "fuel-cell-epc-reference-db-v1";

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function severityClass(severity: RiskFinding["severity"]) {
  if (severity === "HIGH") return "risk-chip risk-chip--high";
  if (severity === "MEDIUM") return "risk-chip risk-chip--medium";
  return "risk-chip risk-chip--low";
}

function gradeClass(grade: "LOW" | "MEDIUM" | "HIGH") {
  if (grade === "HIGH") return "result-grade result-grade--high";
  if (grade === "MEDIUM") return "result-grade result-grade--medium";
  return "result-grade result-grade--low";
}

function mapEmbedSrc(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;
}

function LayoutCanvas({ layout }: { layout: LayoutPreview }) {
  const scale = 92;
  const maxX = Math.max(...layout.blocks.map((block) => block.x + block.w), 0) + 0.5;
  const maxY = Math.max(...layout.blocks.map((block) => block.y + block.h), 0) + 0.5;
  const width = Math.max(640, maxX * scale);
  const height = Math.max(320, maxY * scale);

  return (
    <svg
      className="layout-canvas"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Virtual fuel-cell plant layout preview"
    >
      <defs>
        <pattern id="layout-grid" width={scale} height={scale} patternUnits="userSpaceOnUse">
          <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="rgba(17,17,17,0.07)" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="url(#layout-grid)" rx="28" />
      {layout.blocks.map((block) => {
        const x = block.x * scale;
        const y = block.y * scale;
        const w = block.w * scale;
        const h = block.h * scale;
        const className =
          block.kind === "module"
            ? "layout-canvas__block layout-canvas__block--module"
            : block.kind === "aux"
              ? "layout-canvas__block layout-canvas__block--aux"
              : "layout-canvas__block layout-canvas__block--grid";

        return (
          <g key={block.id}>
            <rect className={className} x={x} y={y} width={w} height={h} rx="18" />
            <text
              x={x + w / 2}
              y={y + h / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="layout-canvas__label"
            >
              {block.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function EstimateStudio() {
  const [input, setInput] = useState<EstimateInput>(DEFAULT_INPUT);
  const [uploadedReferences, setUploadedReferences] = useState<ReferenceProject[]>([]);
  const [selectedReferenceId, setSelectedReferenceId] = useState(
    DEFAULT_REFERENCE_PROJECT.id,
  );
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as ReferenceProject[];
      if (Array.isArray(parsed)) setUploadedReferences(parsed);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(uploadedReferences));
  }, [uploadedReferences]);

  const referenceProjects = [...DEFAULT_REFERENCE_DATABASE, ...uploadedReferences];
  const selectedReference =
    referenceProjects.find((project) => project.id === selectedReferenceId) ??
    DEFAULT_REFERENCE_PROJECT;
  const result = calculateEstimate(input, selectedReference);
  const lcoeRows = [
    {
      label: "Fuel-cell EPC",
      lcoeKrwPerKwh: result.lcoe.fuelCellKrwPerKwh,
      deltaPct: 0,
      note: "Current estimate",
    },
    ...result.lcoe.benchmarks,
  ];
  const lcoeMax = Math.max(...lcoeRows.map((row) => row.lcoeKrwPerKwh), 1);

  const setField = <K extends keyof EstimateInput,>(key: K, value: EstimateInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const setSiteSurvey = (id: string, quantity: number) => {
    setInput((current) => ({
      ...current,
      siteSurvey: { ...current.siteSurvey, [id]: Math.max(0, quantity) },
    }));
  };

  const setInflationField = <K extends keyof EstimateInput["inflation"],>(
    key: K,
    value: EstimateInput["inflation"][K],
  ) => {
    setInput((current) => ({
      ...current,
      inflation: { ...current.inflation, [key]: value },
    }));
  };

  const setDrawingField = <K extends keyof EstimateInput["drawingChange"],>(
    key: K,
    value: EstimateInput["drawingChange"][K],
  ) => {
    setInput((current) => ({
      ...current,
      drawingChange: { ...current.drawingChange, [key]: value },
    }));
  };

  const setLcoeField = <K extends keyof EstimateInput["lcoe"],>(
    key: K,
    value: EstimateInput["lcoe"][K],
  ) => {
    setInput((current) => ({
      ...current,
      lcoe: { ...current.lcoe, [key]: value },
    }));
  };

  const selectReference = (projectId: string) => {
    const project =
      referenceProjects.find((item) => item.id === projectId) ?? DEFAULT_REFERENCE_PROJECT;
    setSelectedReferenceId(projectId);
    setInput((current) => ({ ...current, baseYear: project.referenceYear }));
  };

  const removeReference = (projectId: string) => {
    setUploadedReferences((current) => current.filter((project) => project.id !== projectId));
    if (selectedReferenceId === projectId) {
      setSelectedReferenceId(DEFAULT_REFERENCE_PROJECT.id);
      setInput((current) => ({ ...current, baseYear: DEFAULT_REFERENCE_PROJECT.referenceYear }));
    }
  };

  const handleReferenceImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setImportError(null);
    setIsImporting(true);

    try {
      const importedProjects: ReferenceProject[] = [];
      for (const file of files) importedProjects.push(await importReferenceWorkbook(file));
      if (importedProjects.length > 0) {
        setUploadedReferences((current) => [...importedProjects, ...current]);
        setSelectedReferenceId(importedProjects[0].id);
        setInput((current) => ({ ...current, baseYear: importedProjects[0].referenceYear }));
      }
    } catch (error) {
      setImportError(
        error instanceof Error
          ? error.message
          : "Workbook import failed. Check item / amount columns and try again.",
      );
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  return (
    <div className="estimate-shell">
      <div className="estimate-layout">
        <aside className="estimate-panel estimate-panel--sticky">
          <div className="control-group">
            <div className="control-header">
              <span className="control-label">Reference DB</span>
              <h2>Fuel Cell Estimate Studio</h2>
              <p>
                Upload reference PJT workbooks into a browser-local library, then
                scale, escalate, and compare against the target project.
              </p>
            </div>

            <label className="upload-zone">
              <input
                accept=".xlsx,.xls,.csv"
                className="upload-zone__input"
                multiple
                type="file"
                onChange={handleReferenceImport}
              />
              <span>{isImporting ? "Importing workbook..." : "Upload reference workbook(s)"}</span>
              <small>Excel files are parsed on-device into a local reference DB.</small>
            </label>

            {importError ? <p className="feedback feedback--error">{importError}</p> : null}

            <div className="reference-library">
              {referenceProjects.map((project) => (
                <article
                  key={project.id}
                  className={
                    project.id === selectedReferenceId
                      ? "reference-card reference-card--active"
                      : "reference-card"
                  }
                >
                  <button
                    className="reference-card__select"
                    type="button"
                    onClick={() => selectReference(project.id)}
                  >
                    <div>
                      <strong>{project.name}</strong>
                      <span>
                        {project.referenceCapacityMw.toFixed(1)}MW / {project.referenceYear}
                      </span>
                    </div>
                    <strong>{formatEok(project.totalEok)}</strong>
                  </button>
                  <div className="reference-card__meta">
                    <span>
                      {project.source === "excel-upload"
                        ? project.sourceFileName ?? "Uploaded workbook"
                        : "Built-in sample reference"}
                    </span>
                    {project.source === "excel-upload" ? (
                      <button
                        className="text-button"
                        type="button"
                        onClick={() => removeReference(project.id)}
                      >
                        Remove
                      </button>
                    ) : (
                      <span className="tag">Default</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="control-group">
            <div className="control-header control-header--compact">
              <span className="control-label">Project</span>
              <h3>Target project profile</h3>
            </div>
            <div className="field-grid field-grid--two">
              <label className="field field--full">
                <span>Project name</span>
                <input
                  type="text"
                  value={input.projectName}
                  onChange={(event) => setField("projectName", event.target.value)}
                />
              </label>
              <label className="field">
                <span>Site name</span>
                <input
                  type="text"
                  value={input.siteName}
                  onChange={(event) => setField("siteName", event.target.value)}
                />
              </label>
              <label className="field">
                <span>Capacity (MW)</span>
                <input
                  type="number"
                  min="0.1"
                  max="300"
                  step="0.1"
                  value={input.capacityMw}
                  onChange={(event) =>
                    setField(
                      "capacityMw",
                      clampNumber(Number(event.target.value), 0.1, 300),
                    )
                  }
                />
              </label>
              <label className="field field--full">
                <span>Site address / map query</span>
                <input
                  type="text"
                  value={input.siteAddress}
                  onChange={(event) => setField("siteAddress", event.target.value)}
                />
              </label>
              <label className="field">
                <span>Latitude</span>
                <input
                  type="number"
                  min="-90"
                  max="90"
                  step="0.0001"
                  value={input.latitude}
                  onChange={(event) =>
                    setField(
                      "latitude",
                      clampNumber(Number(event.target.value), -90, 90),
                    )
                  }
                />
              </label>
              <label className="field">
                <span>Longitude</span>
                <input
                  type="number"
                  min="-180"
                  max="180"
                  step="0.0001"
                  value={input.longitude}
                  onChange={(event) =>
                    setField(
                      "longitude",
                      clampNumber(Number(event.target.value), -180, 180),
                    )
                  }
                />
              </label>
            </div>

            <div className="segmented">
              {PROJECT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  className={
                    option.id === input.projectType
                      ? "segmented__button segmented__button--active"
                      : "segmented__button"
                  }
                  type="button"
                  onClick={() => setField("projectType", option.id as ProjectType)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <div className="control-header control-header--compact">
              <span className="control-label">Escalation</span>
              <h3>Price year and commercials</h3>
            </div>
            <div className="field-grid field-grid--two">
              <label className="field field--full">
                <span>Escalation source note</span>
                <input
                  type="text"
                  value={input.inflation.sourceLabel}
                  onChange={(event) =>
                    setInflationField("sourceLabel", event.target.value)
                  }
                />
              </label>
              <label className="field">
                <span>Price year</span>
                <input
                  type="number"
                  min="2020"
                  max="2040"
                  step="1"
                  value={input.baseYear}
                  onChange={(event) =>
                    setField(
                      "baseYear",
                      clampNumber(Number(event.target.value), 2020, 2040),
                    )
                  }
                />
              </label>
              <label className="field">
                <span>Start year</span>
                <input
                  type="number"
                  min="2024"
                  max="2045"
                  step="1"
                  value={input.startYear}
                  onChange={(event) =>
                    setField(
                      "startYear",
                      clampNumber(Number(event.target.value), 2024, 2045),
                    )
                  }
                />
              </label>
              <label className="field">
                <span>Service escalation (%)</span>
                <input
                  type="number"
                  min="0"
                  max="15"
                  step="0.1"
                  value={input.inflation.serviceRate}
                  onChange={(event) =>
                    setInflationField(
                      "serviceRate",
                      clampNumber(Number(event.target.value), 0, 15),
                    )
                  }
                />
              </label>
              <label className="field">
                <span>Procurement escalation (%)</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  value={input.inflation.procurementRate}
                  onChange={(event) =>
                    setInflationField(
                      "procurementRate",
                      clampNumber(Number(event.target.value), 0, 20),
                    )
                  }
                />
              </label>
              <label className="field">
                <span>Construction escalation (%)</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  value={input.inflation.constructionRate}
                  onChange={(event) =>
                    setInflationField(
                      "constructionRate",
                      clampNumber(Number(event.target.value), 0, 20),
                    )
                  }
                />
              </label>
              <label className="field">
                <span>Target margin (%)</span>
                <input
                  type="number"
                  min="0"
                  max="49.9"
                  step="0.1"
                  value={input.marginRate}
                  onChange={(event) =>
                    setField(
                      "marginRate",
                      clampNumber(Number(event.target.value), 0, 49.9),
                    )
                  }
                />
              </label>
              <label className="field">
                <span>Warranty (%)</span>
                <input
                  type="number"
                  min="0"
                  max="8"
                  step="0.1"
                  value={input.warrantyRate}
                  onChange={(event) =>
                    setField(
                      "warrantyRate",
                      clampNumber(Number(event.target.value), 0, 8),
                    )
                  }
                />
              </label>
            </div>
          </div>

          <div className="control-group">
            <div className="control-header control-header--compact">
              <span className="control-label">Site Review</span>
              <h3>Field and utility scope</h3>
            </div>
            <div className="site-list">
              {SITE_SURVEY_OPTIONS.map((item) => (
                <label className="site-row" key={item.id}>
                  <div className="site-row__meta">
                    <strong>{item.label}</strong>
                    <span>
                      {item.unitPriceEokPerUnit.toFixed(3)} x100M KRW / {item.unit}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={input.siteSurvey[item.id] ?? 0}
                    onChange={(event) =>
                      setSiteSurvey(
                        item.id,
                        clampNumber(Number(event.target.value), 0, 9999),
                      )
                    }
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="control-group">
            <div className="control-header control-header--compact">
              <span className="control-label">Drawing Review</span>
              <h3>Reference vs target drawing delta</h3>
            </div>
            <div className="field-grid field-grid--two">
              <label className="upload-compact">
                <span>Reference drawing</span>
                <input
                  accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
                  type="file"
                  onChange={(event) =>
                    setDrawingField(
                      "referenceDrawingName",
                      event.target.files?.[0]?.name ?? "",
                    )
                  }
                />
                <small>{input.drawingChange.referenceDrawingName || "No file selected"}</small>
              </label>
              <label className="upload-compact">
                <span>Target drawing</span>
                <input
                  accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
                  type="file"
                  onChange={(event) =>
                    setDrawingField(
                      "targetDrawingName",
                      event.target.files?.[0]?.name ?? "",
                    )
                  }
                />
                <small>{input.drawingChange.targetDrawingName || "No file selected"}</small>
              </label>
              <label className="field">
                <span>Civil change (%)</span>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={input.drawingChange.civilPct}
                  onChange={(event) =>
                    setDrawingField(
                      "civilPct",
                      clampNumber(Number(event.target.value), 0, 50),
                    )
                  }
                />
              </label>
              <label className="field">
                <span>Electrical change (%)</span>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={input.drawingChange.electricalPct}
                  onChange={(event) =>
                    setDrawingField(
                      "electricalPct",
                      clampNumber(Number(event.target.value), 0, 50),
                    )
                  }
                />
              </label>
              <label className="field">
                <span>Mechanical change (%)</span>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={input.drawingChange.mechanicalPct}
                  onChange={(event) =>
                    setDrawingField(
                      "mechanicalPct",
                      clampNumber(Number(event.target.value), 0, 50),
                    )
                  }
                />
              </label>
              <label className="field">
                <span>Control / I&amp;C change (%)</span>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={input.drawingChange.controlPct}
                  onChange={(event) =>
                    setDrawingField(
                      "controlPct",
                      clampNumber(Number(event.target.value), 0, 50),
                    )
                  }
                />
              </label>
            </div>
          </div>

          <div className="control-group">
            <div className="control-header control-header--compact">
              <span className="control-label">LCOE</span>
              <h3>Operating assumptions</h3>
            </div>
            <div className="field-grid field-grid--two">
              <label className="field">
                <span>Capacity factor (%)</span>
                <input
                  type="number"
                  min="30"
                  max="100"
                  step="0.1"
                  value={input.lcoe.capacityFactorPct}
                  onChange={(event) =>
                    setLcoeField(
                      "capacityFactorPct",
                      clampNumber(Number(event.target.value), 30, 100),
                    )
                  }
                />
              </label>
              <label className="field">
                <span>Fuel cost (KRW/kWh)</span>
                <input
                  type="number"
                  min="0"
                  max="500"
                  step="1"
                  value={input.lcoe.fuelCostKrwPerKwh}
                  onChange={(event) =>
                    setLcoeField(
                      "fuelCostKrwPerKwh",
                      clampNumber(Number(event.target.value), 0, 500),
                    )
                  }
                />
              </label>
              <label className="field">
                <span>Fixed O&amp;M (% / yr)</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={input.lcoe.fixedOandMRatePct}
                  onChange={(event) =>
                    setLcoeField(
                      "fixedOandMRatePct",
                      clampNumber(Number(event.target.value), 0, 10),
                    )
                  }
                />
              </label>
              <label className="field">
                <span>Stack reserve (% / yr)</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={input.lcoe.stackReplacementRatePct}
                  onChange={(event) =>
                    setLcoeField(
                      "stackReplacementRatePct",
                      clampNumber(Number(event.target.value), 0, 10),
                    )
                  }
                />
              </label>
              <label className="field">
                <span>Discount rate (%)</span>
                <input
                  type="number"
                  min="0"
                  max="15"
                  step="0.1"
                  value={input.lcoe.discountRatePct}
                  onChange={(event) =>
                    setLcoeField(
                      "discountRatePct",
                      clampNumber(Number(event.target.value), 0, 15),
                    )
                  }
                />
              </label>
              <label className="field">
                <span>Project life (yr)</span>
                <input
                  type="number"
                  min="5"
                  max="40"
                  step="1"
                  value={input.lcoe.projectLifeYears}
                  onChange={(event) =>
                    setLcoeField(
                      "projectLifeYears",
                      clampNumber(Number(event.target.value), 5, 40),
                    )
                  }
                />
              </label>
            </div>
          </div>
        </aside>

        <section className="estimate-results">
          <div className="result-main">
            <div className="result-main__copy">
              <span className="control-label">EPC Quote</span>
              <h2>{formatEok(result.grandTotal)}</h2>
              <p>
                {input.projectName} uses <strong>{selectedReference.name}</strong> as the
                reference basis, scaled to {input.capacityMw.toFixed(1)}MW and escalated{" "}
                {result.years} year(s) from {input.baseYear} to {input.startYear}.
              </p>
            </div>
            <div className="result-main__meta">
              <div>
                <span>Risk grade</span>
                <strong className={gradeClass(result.riskGrade)}>{result.riskGrade}</strong>
              </div>
              <div>
                <span>Reference delta</span>
                <strong>
                  {result.referenceDeltaEok >= 0 ? "+" : ""}
                  {formatEok(result.referenceDeltaEok)}
                </strong>
              </div>
              <div>
                <span>Fuel-cell LCOE</span>
                <strong>{result.lcoe.fuelCellKrwPerKwh.toFixed(1)} KRW/kWh</strong>
              </div>
            </div>
          </div>

          <div className="summary-grid summary-grid--wide">
            <article className="summary-card">
              <span className="summary-card__label">Scaled reference</span>
              <strong>{formatEok(result.scaledReferenceTotalEok)}</strong>
              <span className="summary-card__sub">Before year escalation</span>
            </article>
            <article className="summary-card">
              <span className="summary-card__label">Escalated reference</span>
              <strong>{formatEok(result.escalatedReferenceTotalEok)}</strong>
              <span className="summary-card__sub">Reference PJT escalated to start year</span>
            </article>
            <article className="summary-card">
              <span className="summary-card__label">Core EPC subtotal</span>
              <strong>{formatEok(result.costSubtotal)}</strong>
              <span className="summary-card__sub">Reference + type adders + drawing changes</span>
            </article>
            <article className="summary-card">
              <span className="summary-card__label">Site additions</span>
              <strong>{formatEok(result.siteSubtotal)}</strong>
              <span className="summary-card__sub">Field review and utility allowances</span>
            </article>
            <article className="summary-card">
              <span className="summary-card__label">Warranty</span>
              <strong>{formatEok(result.warranty)}</strong>
              <span className="summary-card__sub">
                {formatPercent(input.warrantyRate)} of construction quote
              </span>
            </article>
            <article className="summary-card">
              <span className="summary-card__label">Drawing change adders</span>
              <strong>{formatEok(result.drawingSubtotal)}</strong>
              <span className="summary-card__sub">Reference vs target drawing allowance</span>
            </article>
          </div>

          <div className="insight-grid">
            <article className="panel-surface">
              <div className="panel-surface__header">
                <span className="control-label">Category Split</span>
                <h3>Escalated EPC cost by S / P / C</h3>
              </div>
              <div className="metric-list">
                <div className="metric-row">
                  <span>Service</span>
                  <strong>{formatEok(result.categoryTotals.S)}</strong>
                </div>
                <div className="metric-row">
                  <span>Procurement</span>
                  <strong>{formatEok(result.categoryTotals.P)}</strong>
                </div>
                <div className="metric-row">
                  <span>Construction</span>
                  <strong>{formatEok(result.categoryTotals.C)}</strong>
                </div>
              </div>
            </article>

            <article className="panel-surface">
              <div className="panel-surface__header">
                <span className="control-label">Risk Envelope</span>
                <h3>Scenario totals</h3>
              </div>
              <div className="metric-list">
                {result.scenarios.map((row) => (
                  <div className="metric-row" key={row.label}>
                    <span>{row.label}</span>
                    <strong>{formatEok(row.total)}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel-surface">
              <div className="panel-surface__header">
                <span className="control-label">Bid Strategy</span>
                <h3>Margin posture</h3>
              </div>
              <div className="metric-list">
                {result.strategies.map((row) => (
                  <div className="metric-row" key={row.label}>
                    <span>{row.label}</span>
                    <strong>{formatEok(row.total)}</strong>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="comparison-grid">
            <article className="panel-surface">
              <div className="panel-surface__header">
                <span className="control-label">Reference Comparison</span>
                <h3>Against the selected PJT</h3>
              </div>
              <div className="key-metric-grid">
                <div className="key-metric">
                  <span>Reference original</span>
                  <strong>{formatEok(result.referenceTotalEok)}</strong>
                </div>
                <div className="key-metric">
                  <span>Reference escalated</span>
                  <strong>{formatEok(result.escalatedReferenceTotalEok)}</strong>
                </div>
                <div className="key-metric">
                  <span>Current quote</span>
                  <strong>{formatEok(result.grandTotal)}</strong>
                </div>
                <div className="key-metric">
                  <span>Delta</span>
                  <strong>{formatPercent(result.referenceDeltaPct)}</strong>
                </div>
              </div>
              <div className="detail-list">
                {selectedReference.notes.map((note, index) => (
                  <div className="detail-list__row" key={`${selectedReference.id}-${index}`}>
                    <strong>Reference note {index + 1}</strong>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel-surface">
              <div className="panel-surface__header">
                <span className="control-label">Risk Review</span>
                <h3>Commercial and technical flags</h3>
              </div>
              {result.findings.length === 0 ? (
                <p className="empty-state">No material risk flags detected from current assumptions.</p>
              ) : (
                <div className="risk-list">
                  {result.findings.map((finding) => (
                    <article className="risk-item" key={finding.title}>
                      <div className="risk-item__header">
                        <strong>{finding.title}</strong>
                        <span className={severityClass(finding.severity)}>{finding.severity}</span>
                      </div>
                      <p>{finding.reason}</p>
                      <div className="risk-item__footer">
                        <span>Potential impact {formatEok(finding.impactEok)}</span>
                        <span>{finding.mitigation}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </article>

            <article className="panel-surface">
              <div className="panel-surface__header">
                <span className="control-label">Estimate Basis</span>
                <h3>Why the quote looks like this</h3>
              </div>
              <div className="detail-list">
                {result.basis.map((point) => (
                  <div className="detail-list__row" key={point.title}>
                    <strong>{point.title}</strong>
                    <span>{point.detail}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel-surface">
              <div className="panel-surface__header">
                <span className="control-label">LCOE</span>
                <h3>Fuel cell vs other generation options</h3>
              </div>
              <div className="metric-list metric-list--compact">
                <div className="metric-row">
                  <span>Annualized CAPEX</span>
                  <strong>{formatEok(result.lcoe.annualizedCapexEok)}</strong>
                </div>
                <div className="metric-row">
                  <span>Annual fixed cost</span>
                  <strong>{formatEok(result.lcoe.annualFixedCostEok)}</strong>
                </div>
                <div className="metric-row">
                  <span>Annual fuel cost</span>
                  <strong>{formatEok(result.lcoe.annualFuelCostEok)}</strong>
                </div>
              </div>
              <div className="bar-list">
                {lcoeRows.map((row) => (
                  <div className="bar-row" key={row.label}>
                    <div className="bar-row__label">
                      <strong>{row.label}</strong>
                      <span>
                        {row.lcoeKrwPerKwh.toFixed(1)} KRW/kWh
                        {row.label === "Fuel-cell EPC"
                          ? " / current estimate"
                          : ` / ${formatPercent(row.deltaPct)} vs fuel cell`}
                      </span>
                    </div>
                    <div className="bar-track">
                      <div
                        className={
                          row.label === "Fuel-cell EPC"
                            ? "bar-fill bar-fill--primary"
                            : "bar-fill"
                        }
                        style={{ width: `${(row.lcoeKrwPerKwh / lcoeMax) * 100}%` }}
                      />
                    </div>
                    <small>{row.note}</small>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel-surface">
              <div className="panel-surface__header">
                <span className="control-label">Map Context</span>
                <h3>Location-based site review frame</h3>
              </div>
              <div className="map-frame">
                <iframe
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapEmbedSrc(result.mapQuery)}
                  title="Site location preview"
                />
              </div>
              <div className="tag-row">
                <span className="tag">{input.siteName}</span>
                <span className="tag">{input.siteAddress}</span>
                <span className="tag">
                  {input.latitude.toFixed(4)}, {input.longitude.toFixed(4)}
                </span>
              </div>
            </article>

            <article className="panel-surface">
              <div className="panel-surface__header">
                <span className="control-label">Virtual Layout</span>
                <h3>Indicative plant arrangement</h3>
              </div>
              <LayoutCanvas layout={result.layout} />
              <div className="detail-list">
                <div className="detail-list__row">
                  <strong>Estimated land use</strong>
                  <span>{result.layout.estimatedLandM2.toLocaleString("en-US")} m²</span>
                </div>
                {result.layout.notes.map((note, index) => (
                  <div className="detail-list__row" key={`layout-note-${index}`}>
                    <strong>Layout note {index + 1}</strong>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <article className="panel-surface">
            <div className="panel-surface__header">
              <span className="control-label">Breakdown</span>
              <h3>Reference, drawing, and site-derived cost items</h3>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Kind</th>
                    <th>Category</th>
                    <th>Base</th>
                    <th>Escalated</th>
                    <th>Basis</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {result.costItems.concat(result.siteItems).map((item) => (
                    <tr key={item.code}>
                      <td>{item.name}</td>
                      <td>{item.kind}</td>
                      <td>{item.category}</td>
                      <td>{formatEok(item.amountEok)}</td>
                      <td>{formatEok(item.adjustedAmountEok)}</td>
                      <td>{item.basis ?? "-"}</td>
                      <td>{item.note ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
