"use client";

import { useState } from "react";
import {
  calculateEstimate,
  DEFAULT_INPUT,
  formatEok,
  PROJECT_OPTIONS,
  SITE_SURVEY_OPTIONS,
  type EstimateInput,
  type ProjectType,
} from "@/lib/estimator";

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function EstimateStudio() {
  const [input, setInput] = useState<EstimateInput>(DEFAULT_INPUT);
  const result = calculateEstimate(input);

  const setField = <K extends keyof EstimateInput,>(
    key: K,
    value: EstimateInput[K],
  ) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const setSiteSurvey = (id: string, quantity: number) => {
    setInput((current) => ({
      ...current,
      siteSurvey: {
        ...current.siteSurvey,
        [id]: Math.max(0, quantity),
      },
    }));
  };

  return (
    <div className="estimate-shell">
      <div className="estimate-layout">
        <aside className="estimate-panel estimate-panel--sticky">
          <div className="control-group">
            <div className="control-header">
              <span className="control-label">Configuration</span>
              <h2>Estimate Studio</h2>
              <p>
                Calibrated against the PJT workbook baseline and wrapped in a
                cleaner, product-led UI.
              </p>
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
            <div className="field-grid">
              <label className="field">
                <span>Capacity (MW)</span>
                <input
                  type="number"
                  min="0.1"
                  max="200"
                  step="0.1"
                  value={input.capacityMw}
                  onChange={(event) =>
                    setField(
                      "capacityMw",
                      clampNumber(Number(event.target.value), 0.1, 200),
                    )
                  }
                />
              </label>

              <label className="field">
                <span>Base year</span>
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
                  max="2040"
                  step="1"
                  value={input.startYear}
                  onChange={(event) =>
                    setField(
                      "startYear",
                      clampNumber(Number(event.target.value), 2024, 2040),
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
                  max="5"
                  step="0.1"
                  value={input.warrantyRate}
                  onChange={(event) =>
                    setField(
                      "warrantyRate",
                      clampNumber(Number(event.target.value), 0, 5),
                    )
                  }
                />
              </label>
            </div>
          </div>

          <div className="control-group">
            <div className="control-header control-header--compact">
              <span className="control-label">Field Scope</span>
              <h3>Optional site additions</h3>
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
        </aside>

        <section className="estimate-results">
          <div className="result-main">
            <div className="result-main__copy">
              <span className="control-label">Total Quote</span>
              <h2>{formatEok(result.grandTotal)}</h2>
              <p>
                Built from a 9.9MW PJT workbook reference and scaled to{" "}
                {input.capacityMw.toFixed(1)}MW with category-specific escalation.
              </p>
            </div>
            <div className="result-main__meta">
              <div>
                <span>Risk Grade</span>
                <strong>{result.riskGrade}</strong>
              </div>
              <div>
                <span>Reference Baseline</span>
                <strong>{formatEok(result.referenceTotalEok)}</strong>
              </div>
              <div>
                <span>Scaled Baseline</span>
                <strong>{formatEok(result.scaledReferenceTotalEok)}</strong>
              </div>
            </div>
          </div>

          <div className="summary-grid">
            <article className="summary-card">
              <span className="summary-card__label">Cost subtotal</span>
              <strong>{formatEok(result.costSubtotal)}</strong>
              <span className="summary-card__sub">
                Service + procurement + construction
              </span>
            </article>
            <article className="summary-card">
              <span className="summary-card__label">Site additions</span>
              <strong>{formatEok(result.siteSubtotal)}</strong>
              <span className="summary-card__sub">
                Optional field and utility scope
              </span>
            </article>
            <article className="summary-card">
              <span className="summary-card__label">Construction quote</span>
              <strong>{formatEok(result.constructionQuote)}</strong>
              <span className="summary-card__sub">
                Margin applied before warranty
              </span>
            </article>
            <article className="summary-card">
              <span className="summary-card__label">Warranty</span>
              <strong>{formatEok(result.warranty)}</strong>
              <span className="summary-card__sub">
                {input.warrantyRate.toFixed(1)}% of construction quote
              </span>
            </article>
          </div>

          <div className="insight-grid">
            <article className="panel-surface">
              <div className="panel-surface__header">
                <span className="control-label">Category Split</span>
                <h3>Escalated core cost</h3>
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
                <span className="control-label">Scenarios</span>
                <h3>Risk envelope</h3>
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
                <span className="control-label">Bidding Lens</span>
                <h3>Margin strategies</h3>
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

          <article className="panel-surface">
            <div className="panel-surface__header">
              <span className="control-label">Breakdown</span>
              <h3>Reference-driven cost items</h3>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Base</th>
                    <th>Escalated</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {result.costItems.concat(result.siteItems).map((item) => (
                    <tr key={item.code}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{formatEok(item.amountEok)}</td>
                      <td>{formatEok(item.adjustedAmountEok)}</td>
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
