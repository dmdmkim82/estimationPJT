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

const copy = {
  input: "B2B \uC785\uB825",
  siteQuick: "\uBD80\uC9C0 \uAE30\uBC18 \uBE60\uB978 \uC81C\uC548",
  siteQuickDesc:
    "\uC8FC\uC18C\uC640 \uBA74\uC801\uB9CC \uB123\uC73C\uBA74 1\uCC28 \uC81C\uC548 \uAE08\uC561\uC744 \uACC4\uC0B0\uD569\uB2C8\uB2E4.",
  googleCoords: "\uCE21\uC815 \uC88C\uD45C\uB97C \uBD99\uC5EC\uB123\uC2B5\uB2C8\uB2E4.",
  cadastralCoords:
    "\uC9C0\uC801\uB3C4 \uACBD\uACC4 \uC88C\uD45C\uB97C \uBD99\uC5EC\uB123\uC2B5\uB2C8\uB2E4.",
  manualDims: "\uAC00\uB85C x \uC138\uB85C\uB9CC\uC73C\uB85C \uACC4\uC0B0\uD569\uB2C8\uB2E4.",
  hint: "Google Maps \uB610\uB294 \uC9C0\uC801\uB3C4 \uC88C\uD45C\uB97C \uADF8\uB300\uB85C \uBD99\uC5EC\uB123\uC73C\uC138\uC694.",
  calcProposal: "\uC81C\uC548 \uACC4\uC0B0",
  calcFallback:
    "\uC88C\uD45C\uAC00 \uC5C6\uC73C\uBA74 \uAC00\uB85C x \uC138\uB85C \uAE30\uC900\uC73C\uB85C \uACC4\uC0B0\uD569\uB2C8\uB2E4.",
  emptyTitle:
    "\uBD80\uC9C0 \uC815\uBCF4\uB97C \uB123\uACE0 \uBC14\uB85C 1\uCC28 \uC81C\uC548\uC744 \uACC4\uC0B0\uD558\uC138\uC694.",
  emptyDesc:
    "\uC601\uC5C5 \uCD08\uAE30 \uB2E8\uACC4\uC5D0\uC11C \uBA74\uC801, \uAD8C\uC7A5 \uC6A9\uB7C9, \uC608\uBE44 EPC \uAE08\uC561\uC744 \uBE60\uB974\uAC8C \uD655\uC778\uD569\uB2C8\uB2E4.",
  grossSitePrefix: "\uCD1D \uBD80\uC9C0",
  basis: "\uAE30\uC900\uC73C\uB85C",
  stdProposal: "\uD45C\uC900 9.9MW \uC81C\uC548\uC744 \uAD8C\uC7A5\uD569\uB2C8\uB2E4.",
  scaleProposal: "\uADDC\uBAA8\uB97C \uAD8C\uC7A5\uD569\uB2C8\uB2E4.",
  grossArea: "\uCD1D \uBA74\uC801",
  usableArea: "\uC720\uD6A8 \uBA74\uC801",
  risk: "\uB9AC\uC2A4\uD06C",
  quickSales: "\uCD08\uAE30 \uC601\uC5C5 \uAC80\uD1A0\uC6A9 \uAE08\uC561",
  areaSizing: "\uBA74\uC801\uACFC \uC6A9\uB7C9 \uD310\uB2E8",
  salesMemo: "\uC601\uC5C5 \uBA54\uBAA8",
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
            <span className="control-label">{copy.input}</span>
            <h2>{copy.siteQuick}</h2>
            <p>{copy.siteQuickDesc}</p>
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
              <span>{copy.googleCoords}</span>
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
              <span>{copy.cadastralCoords}</span>
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
              <span>{copy.manualDims}</span>
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
                placeholder={
                  "37.402100,127.108300\n37.402100,127.109100\n37.401500,127.109100\n37.401500,127.108300"
                }
                value={form.boundaryText}
                onChange={(event) => setField("boundaryText", event.target.value)}
              />
              <small className="field-hint">{copy.hint}</small>
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
              {copy.calcProposal}
            </button>
            <p>{copy.calcFallback}</p>
          </div>
        </div>
      </aside>

      <section className="estimate-results">
        {!result ? (
          <article className="panel-surface b2b-empty">
            <span className="control-label">Quick Proposal</span>
            <h3>{copy.emptyTitle}</h3>
            <p>{copy.emptyDesc}</p>
          </article>
        ) : (
          <>
            <div className="result-main">
              <div className="result-main__copy">
                <span className="control-label">Lead Proposal</span>
                <h2>{formatEok(result.estimate.grandTotal)}</h2>
                <p>
                  {copy.grossSitePrefix} {result.areaSqm.toLocaleString("en-US")} m2 {copy.basis}{" "}
                  <strong>{result.recommendedCapacityMw.toFixed(1)}MW</strong>{" "}
                  {result.isStandardProposal
                    ? copy.stdProposal
                    : copy.scaleProposal}
                </p>
              </div>
              <div className="result-main__meta">
                <div>
                  <span>{copy.grossArea}</span>
                  <strong>{result.areaSqm.toLocaleString("en-US")} m2</strong>
                </div>
                <div>
                  <span>{copy.usableArea}</span>
                  <strong>{result.usableAreaSqm.toLocaleString("en-US")} m2</strong>
                </div>
                <div>
                  <span>{copy.risk}</span>
                  <strong>{result.estimate.riskGrade}</strong>
                </div>
              </div>
            </div>

            <div className="summary-grid summary-grid--wide">
              <article className="summary-card">
                <span className="summary-card__label">Gross site area</span>
                <strong>{result.areaSqm.toLocaleString("en-US")} m2</strong>
                <span className="summary-card__sub">
                  {result.areaPyeong.toLocaleString("en-US")} pyeong
                </span>
              </article>
              <article className="summary-card">
                <span className="summary-card__label">Usable site area</span>
                <strong>{result.usableAreaSqm.toLocaleString("en-US")} m2</strong>
                <span className="summary-card__sub">
                  {formatPercent(form.landUseFactorPct)} utilization factor applied
                </span>
              </article>
              <article className="summary-card">
                <span className="summary-card__label">Recommended capacity</span>
                <strong>{result.recommendedCapacityMw.toFixed(1)} MW</strong>
                <span className="summary-card__sub">
                  {result.isStandardProposal
                    ? "Standard proposal cap at 9.9MW"
                    : "Area-based recommendation"}
                </span>
              </article>
              <article className="summary-card">
                <span className="summary-card__label">Preliminary EPC quote</span>
                <strong>{formatEok(result.estimate.grandTotal)}</strong>
                <span className="summary-card__sub">{copy.quickSales}</span>
              </article>
            </div>

            <div className="comparison-grid">
              <article className="panel-surface">
                <div className="panel-surface__header">
                  <span className="control-label">Proposal Basis</span>
                  <h3>{copy.areaSizing}</h3>
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
                  <h3>{copy.salesMemo}</h3>
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
