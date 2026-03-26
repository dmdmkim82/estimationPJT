"use client";

import { useState } from "react";
import { buildB2BLeadProposal, type B2BLeadInput } from "@/lib/b2b-proposal";
import { formatEok, formatPercent } from "@/lib/estimator";

const DEFAULT_FORM: B2BLeadInput = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  siteAddress: "",
  areaSource: "google",
  boundaryText: "",
  widthM: 0,
  depthM: 0,
  landUseFactorPct: 70,
  preferredStartYear: 2027,
};

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function B2BLeadPage() {
  const [form, setForm] = useState<B2BLeadInput>(DEFAULT_FORM);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof buildB2BLeadProposal> | null>(
    null,
  );

  const setField = <K extends keyof B2BLeadInput,>(key: K, value: B2BLeadInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleCalculate = () => {
    if (!form.boundaryText.trim() && !(form.widthM > 0 && form.depthM > 0)) {
      setError("Boundary coordinates or width/depth values are required.");
      return;
    }

    if (!form.siteAddress.trim()) {
      setError("Site address is required.");
      return;
    }

    setError(null);
    setResult(buildB2BLeadProposal(form));
  };

  const leadSummary = result
    ? [
        `Company: ${form.companyName || "-"}`,
        `Contact: ${form.contactName || "-"} / ${form.email || "-"} / ${form.phone || "-"}`,
        `Site: ${form.siteAddress}`,
        `Gross area: ${result.areaSqm.toLocaleString("en-US")} m2 (${result.areaPyeong.toLocaleString("en-US")} pyeong)`,
        `Usable area: ${result.usableAreaSqm.toLocaleString("en-US")} m2`,
        `Recommended capacity: ${result.recommendedCapacityMw.toFixed(1)} MW`,
        `Preliminary EPC quote: ${formatEok(result.estimate.grandTotal)}`,
        `Risk grade: ${result.estimate.riskGrade}`,
      ].join("\n")
    : "";

  return (
    <div className="b2b-layout">
      <aside className="estimate-panel b2b-panel">
        <div className="control-group">
          <div className="control-header">
            <span className="control-label">B2B Lead Intake</span>
            <h2>Site-based quick proposal</h2>
            <p>
              Enter parcel information, click the quote-request button, and the page
              will turn site area into a recommended fuel-cell capacity and
              preliminary EPC budget.
            </p>
          </div>

          <div className="segmented">
            <button
              className={
                form.areaSource === "google"
                  ? "segmented__button segmented__button--active"
                  : "segmented__button"
              }
              type="button"
              onClick={() => setField("areaSource", "google")}
            >
              <strong>Google Maps</strong>
              <span>Paste perimeter coordinates measured from Google Maps.</span>
            </button>
            <button
              className={
                form.areaSource === "cadastral"
                  ? "segmented__button segmented__button--active"
                  : "segmented__button"
              }
              type="button"
              onClick={() => setField("areaSource", "cadastral")}
            >
              <strong>Government cadastral</strong>
              <span>Paste parcel boundary coordinates exported or copied from cadastral review.</span>
            </button>
            <button
              className={
                form.areaSource === "manual"
                  ? "segmented__button segmented__button--active"
                  : "segmented__button"
              }
              type="button"
              onClick={() => setField("areaSource", "manual")}
            >
              <strong>Manual dimensions</strong>
              <span>Use width and depth if a polygon is not available yet.</span>
            </button>
          </div>
        </div>

        <div className="control-group">
          <div className="field-grid field-grid--two">
            <label className="field">
              <span>Company</span>
              <input
                type="text"
                value={form.companyName}
                onChange={(event) => setField("companyName", event.target.value)}
              />
            </label>
            <label className="field">
              <span>Contact name</span>
              <input
                type="text"
                value={form.contactName}
                onChange={(event) => setField("contactName", event.target.value)}
              />
            </label>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
              />
            </label>
            <label className="field">
              <span>Phone</span>
              <input
                type="text"
                value={form.phone}
                onChange={(event) => setField("phone", event.target.value)}
              />
            </label>
            <label className="field field--full">
              <span>Site address</span>
              <input
                type="text"
                value={form.siteAddress}
                onChange={(event) => setField("siteAddress", event.target.value)}
              />
            </label>
            <label className="field field--full">
              <span>Boundary coordinates (lat,lng per line)</span>
              <textarea
                className="field__textarea"
                placeholder={"37.402100,127.108300\n37.402100,127.109100\n37.401500,127.109100\n37.401500,127.108300"}
                value={form.boundaryText}
                onChange={(event) => setField("boundaryText", event.target.value)}
              />
              <small className="field-hint">
                Paste coordinates from Google Maps measurement or a cadastral review tool.
              </small>
            </label>
            <label className="field">
              <span>Width (m)</span>
              <input
                type="number"
                min="0"
                step="1"
                value={form.widthM}
                onChange={(event) =>
                  setField("widthM", clampNumber(Number(event.target.value), 0, 10000))
                }
              />
            </label>
            <label className="field">
              <span>Depth (m)</span>
              <input
                type="number"
                min="0"
                step="1"
                value={form.depthM}
                onChange={(event) =>
                  setField("depthM", clampNumber(Number(event.target.value), 0, 10000))
                }
              />
            </label>
            <label className="field">
              <span>Usable land factor (%)</span>
              <input
                type="number"
                min="30"
                max="95"
                step="1"
                value={form.landUseFactorPct}
                onChange={(event) =>
                  setField(
                    "landUseFactorPct",
                    clampNumber(Number(event.target.value), 30, 95),
                  )
                }
              />
            </label>
            <label className="field">
              <span>Preferred start year</span>
              <input
                type="number"
                min="2025"
                max="2040"
                step="1"
                value={form.preferredStartYear}
                onChange={(event) =>
                  setField(
                    "preferredStartYear",
                    clampNumber(Number(event.target.value), 2025, 2040),
                  )
                }
              />
            </label>
          </div>

          {error ? <p className="feedback feedback--error">{error}</p> : null}

          <div className="proposal-actions">
            <button className="button button--primary" type="button" onClick={handleCalculate}>
              견적 요청 계산
            </button>
            <p>
              Boundary polygon is preferred. If coordinates are missing, the page falls
              back to width x depth area.
            </p>
          </div>
        </div>
      </aside>

      <section className="estimate-results">
        {!result ? (
          <article className="panel-surface b2b-empty">
            <span className="control-label">Quick Proposal</span>
            <h3>Enter site information and calculate a prospect-ready proposal.</h3>
            <p>
              This page is optimized for B2B outreach. It turns parcel input into area,
              usable land, recommended capacity, and a preliminary EPC quote without
              going through the full studio workflow.
            </p>
          </article>
        ) : (
          <>
            <div className="result-main">
              <div className="result-main__copy">
                <span className="control-label">Lead Proposal</span>
                <h2>{formatEok(result.estimate.grandTotal)}</h2>
                <p>
                  Based on {result.areaSqm.toLocaleString("en-US")} m² of gross site area,
                  the page recommends{" "}
                  <strong>{result.recommendedCapacityMw.toFixed(1)}MW</strong>{" "}
                  {result.isStandardProposal
                    ? "as the standard commercial 9.9MW proposal."
                    : "for this prospect site."}
                </p>
              </div>
              <div className="result-main__meta">
                <div>
                  <span>Gross area</span>
                  <strong>{result.areaSqm.toLocaleString("en-US")} m²</strong>
                </div>
                <div>
                  <span>Usable area</span>
                  <strong>{result.usableAreaSqm.toLocaleString("en-US")} m²</strong>
                </div>
                <div>
                  <span>Risk grade</span>
                  <strong>{result.estimate.riskGrade}</strong>
                </div>
              </div>
            </div>

            <div className="summary-grid summary-grid--wide">
              <article className="summary-card">
                <span className="summary-card__label">Gross site area</span>
                <strong>{result.areaSqm.toLocaleString("en-US")} m²</strong>
                <span className="summary-card__sub">
                  {result.areaPyeong.toLocaleString("en-US")} pyeong
                </span>
              </article>
              <article className="summary-card">
                <span className="summary-card__label">Usable site area</span>
                <strong>{result.usableAreaSqm.toLocaleString("en-US")} m²</strong>
                <span className="summary-card__sub">
                  {formatPercent(form.landUseFactorPct)} utilization factor applied
                </span>
              </article>
              <article className="summary-card">
                <span className="summary-card__label">Recommended capacity</span>
                <strong>{result.recommendedCapacityMw.toFixed(1)} MW</strong>
                <span className="summary-card__sub">
                  {result.isStandardProposal ? "Standard proposal cap at 9.9MW" : "Area-based recommendation"}
                </span>
              </article>
              <article className="summary-card">
                <span className="summary-card__label">Preliminary EPC quote</span>
                <strong>{formatEok(result.estimate.grandTotal)}</strong>
                <span className="summary-card__sub">
                  Reference-driven quick proposal for initial B2B outreach
                </span>
              </article>
            </div>

            <div className="comparison-grid">
              <article className="panel-surface">
                <div className="panel-surface__header">
                  <span className="control-label">Proposal Basis</span>
                  <h3>Area and sizing notes</h3>
                </div>
                <div className="detail-list">
                  {result.notes.map((note, index) => (
                    <div className="detail-list__row" key={`note-${index}`}>
                      <strong>Note {index + 1}</strong>
                      <span>{note}</span>
                    </div>
                  ))}
                  <div className="detail-list__row">
                    <strong>Boundary points</strong>
                    <span>{result.boundaryPoints.length} point(s) detected from polygon input</span>
                  </div>
                </div>
              </article>

              <article className="panel-surface">
                <div className="panel-surface__header">
                  <span className="control-label">Request Summary</span>
                  <h3>Sales-ready intake memo</h3>
                </div>
                <textarea className="summary-textarea" readOnly value={leadSummary} />
              </article>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
