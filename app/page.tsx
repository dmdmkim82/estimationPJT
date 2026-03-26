import Link from "next/link";
import {
  calculateEstimate,
  DEFAULT_INPUT,
  formatEok,
  REFERENCE_TEMPLATE,
} from "@/lib/estimator";

const preview = calculateEstimate(DEFAULT_INPUT);

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero" id="overview">
        <div className="hero__content">
          <span className="hero__eyebrow">Next.js Product Experience</span>
          <h1 className="hero__title">
            Rebuilt for a cleaner,
            <br />
            more cinematic estimate flow.
          </h1>
          <p className="hero__copy">
            Your SOFC EPC project now has a product-style homepage and a dedicated
            estimate studio. The math is anchored to the PJT workbook baseline,
            but the presentation is much closer to a modern launch page.
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/estimate">
              Launch Studio
            </Link>
            <a className="button button--secondary" href="#workflow">
              See Workflow
            </a>
          </div>
        </div>

        <div className="hero__device">
          <div className="hero-card">
            <span className="hero-card__label">Reference Workbook</span>
            <h2>{REFERENCE_TEMPLATE.name}</h2>
            <p>
              {REFERENCE_TEMPLATE.referenceCapacityMw}MW baseline,{" "}
              {REFERENCE_TEMPLATE.referenceYear} pricing year, calibrated to the
              outdoor single-floor template.
            </p>
            <div className="stat-grid">
              <div className="stat-card">
                <span>Baseline</span>
                <strong>{formatEok(REFERENCE_TEMPLATE.referenceTotalEok)}</strong>
              </div>
              <div className="stat-card">
                <span>Preview quote</span>
                <strong>{formatEok(preview.grandTotal)}</strong>
              </div>
              <div className="stat-card">
                <span>Risk band</span>
                <strong>{preview.riskGrade}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--grid" id="workflow">
        <div className="section-copy">
          <span className="section-label">Workflow</span>
          <h2 className="section-title">Built like a launch page, not a spreadsheet.</h2>
          <p className="section-text">
            The experience is split into a narrative home and a focused estimate
            studio so the project feels intentional, legible, and presentation-ready.
          </p>
        </div>
        <div className="marketing-grid">
          <article className="marketing-card">
            <span className="marketing-card__index">01</span>
            <h3>Workbook-calibrated</h3>
            <p>
              The pricing baseline starts from the PJT workbook instead of a blind
              UI-only estimate.
            </p>
          </article>
          <article className="marketing-card">
            <span className="marketing-card__index">02</span>
            <h3>Scenario-aware</h3>
            <p>
              Inflation shock, delay, FX exposure, and bidding posture stay visible
              in the same frame.
            </p>
          </article>
          <article className="marketing-card">
            <span className="marketing-card__index">03</span>
            <h3>Boardroom ready</h3>
            <p>
              Cleaner typography, stronger hierarchy, and fewer dashboard tropes make
              the output easier to present.
            </p>
          </article>
        </div>
      </section>

      <section className="feature-band">
        <div className="feature-band__copy">
          <span className="section-label">What Changed</span>
          <h2 className="section-title">From a single HTML file to a structured app.</h2>
          <p className="section-text">
            The new project uses the Next.js app router, a reusable estimator library,
            and a product-oriented shell so you can keep evolving the tool instead of
            patching one monolithic page.
          </p>
        </div>
        <div className="feature-band__visual">
          <div className="visual-panel">
            <div className="visual-panel__row">
              <span>Home</span>
              <strong>Apple-like narrative layout</strong>
            </div>
            <div className="visual-panel__row">
              <span>Studio</span>
              <strong>Interactive quote workspace</strong>
            </div>
            <div className="visual-panel__row">
              <span>Logic</span>
              <strong>Reference workbook based pricing</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cta">
        <div className="cta-card">
          <span className="section-label">Estimate Studio</span>
          <h2 className="section-title">Use the dedicated workspace.</h2>
          <p className="section-text">
            Move from product story to live pricing without leaving the project.
          </p>
          <Link className="button button--primary" href="/estimate">
            Open Estimate Studio
          </Link>
        </div>
      </section>
    </main>
  );
}
