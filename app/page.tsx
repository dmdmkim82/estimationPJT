import Link from "next/link";
import {
  calculateEstimate,
  DEFAULT_INPUT,
  formatEok,
  REFERENCE_TEMPLATE,
} from "@/lib/estimator";

const preview = calculateEstimate(DEFAULT_INPUT);

const copy = {
  eyebrow: "\uC0B0\uC5C5\uD615 \uACAC\uC801 \uD50C\uB7AB\uD3FC",
  title1: "\uC5F0\uB8CC\uC804\uC9C0 EPC \uACAC\uC801\uC744",
  title2: "\uB354 \uC9E7\uACE0 \uC120\uBA85\uD558\uAC8C",
  title3: "\uC815\uB9AC\uD569\uB2C8\uB2E4.",
  heroCopy:
    "\uAE30\uC900 \uD504\uB85C\uC81D\uD2B8, \uBB3C\uAC00\uC0C1\uC2B9, \uD604\uC7A5\uC870\uAC74, \uB9AC\uC2A4\uD06C\uB97C \uD55C \uD654\uBA74\uC5D0\uC11C \uBE60\uB974\uAC8C \uD655\uC778\uD569\uB2C8\uB2E4.",
  launchStudio: "\uC2A4\uD29C\uB514\uC624 \uC2DC\uC791",
  b2b: "B2B \uC81C\uC548",
  viewFlow: "\uD750\uB984 \uBCF4\uAE30",
  refPjt: "\uAE30\uC900 PJT",
  reviewItems: "\uAC80\uD1A0 \uD56D\uBAA9",
  yearAdjust: "\uC5F0\uB3C4 \uBCF4\uC815",
  refPjtDesc:
    "\uC6CC\uD06C\uBD81 \uAE30\uC900 \uD504\uB85C\uC81D\uD2B8\uB97C \uBC14\uB85C \uBD88\uB7EC\uC635\uB2C8\uB2E4.",
  reviewItemsDesc:
    "\uAE08\uC561, \uB9AC\uC2A4\uD06C, LCOE, \uBC30\uCE58\uAE4C\uC9C0 \uD568\uAED8 \uBD05\uB2C8\uB2E4.",
  yearAdjustDesc:
    "\uAE30\uC900\uC5F0\uB3C4\uC5D0\uC11C \uCC29\uACF5\uC5F0\uB3C4\uAE4C\uC9C0 \uC790\uB3D9 \uBC18\uC601\uD569\uB2C8\uB2E4.",
  refProject: "\uAE30\uC900 \uD504\uB85C\uC81D\uD2B8",
  refProjectDesc:
    "9.9MW \uAE30\uC900 \uD504\uB85C\uC81D\uD2B8\uB97C \uBD88\uB7EC\uC640 \uBAA9\uD45C \uC6A9\uB7C9\uACFC \uCC29\uACF5\uC5F0\uB3C4\uB85C \uBC14\uB85C \uD658\uC0B0\uD569\uB2C8\uB2E4.",
  baseAmount: "\uAE30\uC900 \uAE08\uC561",
  previewQuote: "\uBBF8\uB9AC\uBCF4\uAE30 \uACAC\uC801",
  riskGrade: "\uB9AC\uC2A4\uD06C \uB4F1\uAE09",
  input: "\uC785\uB825",
  adjust: "\uC870\uC815",
  output: "\uCD9C\uB825",
  reviewFlow: "\uAC80\uD1A0 \uD750\uB984",
  reviewFlowTitle: "\uC124\uBA85\uC740 \uC904\uC774\uACE0 \uD310\uB2E8\uC740 \uBE60\uB974\uAC8C.",
  reviewFlowDesc:
    "\uC81C\uD488\uD615 \uD654\uBA74\uC774\uC9C0\uB9CC \uC22B\uC790\uC640 \uADFC\uAC70\uB294 \uBC14\uB85C \uC77D\uD788\uAC8C \uC815\uB9AC\uD588\uC2B5\uB2C8\uB2E4.",
  refProjectCardDesc:
    "\uAE30\uC874 PJT\uB97C \uAE30\uC900\uC810\uC73C\uB85C \uC7A1\uC2B5\uB2C8\uB2E4.",
  siteReflect: "\uD604\uC7A5 \uBC18\uC601",
  siteReflectDesc:
    "\uC720\uD2F8\uB9AC\uD2F0, \uD1A0\uBAA9, \uB3C4\uBA74 \uCC28\uC774\uB97C \uB354\uD569\uB2C8\uB2E4.",
  resultSummary: "\uACB0\uACFC \uC694\uC57D",
  resultSummaryDesc:
    "\uACAC\uC801\uACFC \uB9AC\uC2A4\uD06C\uB97C \uD55C \uBC88\uC5D0 \uC815\uB9AC\uD569\uB2C8\uB2E4.",
  platform: "\uD50C\uB7AB\uD3FC \uAD6C\uC131",
  platformTitle:
    "\uC601\uC5C5 \uD654\uBA74\uACFC \uAC80\uD1A0 \uD654\uBA74\uC744 \uBD84\uB9AC\uD588\uC2B5\uB2C8\uB2E4.",
  platformDesc:
    "\uCC98\uC74C\uC5D4 \uAC04\uACB0\uD558\uAC8C, \uC0C1\uC138 \uAC80\uD1A0\uB294 \uC2A4\uD29C\uB514\uC624\uC5D0\uC11C \uC774\uC5B4\uC9D1\uB2C8\uB2E4.",
  excelRef: "Excel \uAE30\uC900\uAC12\uC744 \uBD88\uB7EC\uC640 \uBC14\uB85C \uD658\uC0B0\uD569\uB2C8\uB2E4.",
  capacityYearDesc:
    "\uC6A9\uB7C9\uACFC \uC5F0\uB3C4 \uCC28\uC774\uB97C \uBE60\uB974\uAC8C \uBC18\uC601\uD569\uB2C8\uB2E4.",
  siteReview: "\uD604\uC7A5 \uAC80\uD1A0",
  siteReviewDesc:
    "\uD604\uC7A5 \uC870\uAC74\uACFC \uB3C4\uBA74 \uCC28\uC774\uB97C \uC22B\uC790\uB85C \uBC18\uC601\uD569\uB2C8\uB2E4.",
  siteReviewDesc2:
    "\uD1A0\uBAA9, \uACC4\uD1B5, \uAE30\uACC4, \uC81C\uC5B4 \uAC00\uC0B0\uC744 \uB530\uB85C \uBD05\uB2C8\uB2E4.",
  resultOrganize: "\uACB0\uACFC \uC815\uB9AC",
  resultOrganizeDesc:
    "\uACAC\uC801, \uB9AC\uC2A4\uD06C, LCOE\uB97C \uD55C \uD654\uBA74\uC5D0 \uB461\uB2C8\uB2E4.",
  resultOrganizeDesc2:
    "\uC124\uBA85\uBCF4\uB2E4 \uD310\uB2E8\uC5D0 \uC9D1\uC911\uD560 \uC218 \uC788\uAC8C \uAD6C\uC131\uD588\uC2B5\uB2C8\uB2E4.",
  visualDirection: "\uC2DC\uAC01 \uBC29\uD5A5",
  visualTitle: "\uAC00\uBCBC\uC6B4 \uCCAB \uD654\uBA74, \uB2E8\uB2E8\uD55C \uAC80\uD1A0 \uD654\uBA74.",
  visualDesc:
    "\uCCAB \uD654\uBA74\uC740 \uAC04\uACB0\uD558\uAC8C, \uC2A4\uD29C\uB514\uC624\uB294 \uAC80\uD1A0 \uC911\uC2EC\uC73C\uB85C \uC815\uB9AC\uD588\uC2B5\uB2C8\uB2E4.",
  main: "\uBA54\uC778",
  mainDesc: "\uC9E7\uC740 \uC18C\uAC1C\uC640 \uBE60\uB978 \uC9C4\uC785",
  studio: "\uC2A4\uD29C\uB514\uC624",
  studioDesc: "\uC785\uB825, \uACB0\uACFC, \uBE44\uAD50\uB97C \uD55C \uD654\uBA74\uC5D0 \uBC30\uCE58",
  logic: "\uB85C\uC9C1",
  logicDesc: "\uAE30\uC900 PJT, \uBB3C\uAC00\uC0C1\uC2B9, \uB9AC\uC2A4\uD06C, LCOE",
  estimateStudio: "\uACAC\uC801 \uC2A4\uD29C\uB514\uC624",
  ctaTitle: "\uBC14\uB85C \uACC4\uC0B0\uC744 \uC2DC\uC791\uD558\uC138\uC694.",
  ctaDesc:
    "\uBCF5\uC7A1\uD55C \uC124\uBA85 \uB300\uC2E0 \uD544\uC694\uD55C \uC785\uB825\uBD80\uD130 \uBC1B\uC2B5\uB2C8\uB2E4.",
  quickB2b: "B2B \uBE60\uB978 \uC81C\uC548",
  inputSummary: "\uAE30\uC900 PJT, \uC6A9\uB7C9, \uC5F0\uB3C4, \uD604\uC7A5\uC870\uAC74",
  adjustSummary: "\uBB3C\uAC00\uC0C1\uC2B9, \uB9C8\uC9C4, \uB3C4\uBA74 \uCC28\uC774",
  outputSummary: "\uACAC\uC801, \uB9AC\uC2A4\uD06C, LCOE, \uBC30\uCE58",
};

export default function HomePage() {
  return (
    <main className="page-shell page-shell--landing">
      <section className="hero hero--mix" id="overview">
        <div className="hero__content">
          <span className="hero__eyebrow">
            {copy.eyebrow}
            <small>Industrial Estimate Platform</small>
          </span>
          <h1 className="hero__title">
            <span className="title-ko">
              {copy.title1}
              <br />
              {copy.title2}
              <br />
              {copy.title3}
            </span>
            <small className="title-en">Shorter copy, clearer review.</small>
          </h1>
          <p className="hero__copy">
            <span className="copy-ko">{copy.heroCopy}</span>
            <small className="copy-en">
              Reference project, escalation, site scope, and risk in one frame.
            </small>
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/estimate">
              <span className="button__stack">
                <strong>{copy.launchStudio}</strong>
                <small>Launch Studio</small>
              </span>
            </Link>
            <Link className="button button--secondary" href="/b2b">
              <span className="button__stack">
                <strong>{copy.b2b}</strong>
                <small>Open B2B Page</small>
              </span>
            </Link>
            <a className="button button--secondary" href="#workflow">
              <span className="button__stack">
                <strong>{copy.viewFlow}</strong>
                <small>Decision Flow</small>
              </span>
            </a>
          </div>
          <div className="hero-specs">
            <article className="hero-spec">
              <span>{copy.refPjt}</span>
              <strong>{copy.refPjtDesc}</strong>
            </article>
            <article className="hero-spec">
              <span>{copy.reviewItems}</span>
              <strong>{copy.reviewItemsDesc}</strong>
            </article>
            <article className="hero-spec">
              <span>{copy.yearAdjust}</span>
              <strong>{copy.yearAdjustDesc}</strong>
            </article>
          </div>
        </div>

        <div className="hero__device">
          <div className="hero-card hero-card--mix">
            <div className="hero-card__top">
              <span className="hero-card__label">{copy.refProject}</span>
              <span className="hero-card__chip">2025 -&gt; 2027</span>
            </div>
            <h2>{REFERENCE_TEMPLATE.name}</h2>
            <p>{copy.refProjectDesc}</p>
            <div className="stat-grid">
              <div className="stat-card">
                <span>{copy.baseAmount}</span>
                <strong>{formatEok(REFERENCE_TEMPLATE.referenceTotalEok)}</strong>
              </div>
              <div className="stat-card">
                <span>{copy.previewQuote}</span>
                <strong>{formatEok(preview.grandTotal)}</strong>
              </div>
              <div className="stat-card">
                <span>{copy.riskGrade}</span>
                <strong>{preview.riskGrade}</strong>
              </div>
            </div>
            <div className="signal-list">
              <div className="signal-row">
                <span>{copy.input}</span>
                <strong>{copy.inputSummary}</strong>
              </div>
              <div className="signal-row">
                <span>{copy.adjust}</span>
                <strong>{copy.adjustSummary}</strong>
              </div>
              <div className="signal-row">
                <span>{copy.output}</span>
                <strong>{copy.outputSummary}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--grid" id="workflow">
        <div className="section-copy">
          <span className="section-label">
            {copy.reviewFlow}
            <small>Workflow</small>
          </span>
          <h2 className="section-title">
            <span className="title-ko">{copy.reviewFlowTitle}</span>
            <small className="title-en">A cleaner shell with faster review.</small>
          </h2>
          <p className="section-text">
            <span className="copy-ko">{copy.reviewFlowDesc}</span>
            <small className="copy-en">
              Product-style layout, but still tuned for EPC review.
            </small>
          </p>
        </div>
        <div className="marketing-grid">
          <article className="marketing-card">
            <span className="marketing-card__index">01</span>
            <h3>{copy.refProject}</h3>
            <p>{copy.refProjectCardDesc}</p>
          </article>
          <article className="marketing-card">
            <span className="marketing-card__index">02</span>
            <h3>{copy.siteReflect}</h3>
            <p>{copy.siteReflectDesc}</p>
          </article>
          <article className="marketing-card">
            <span className="marketing-card__index">03</span>
            <h3>{copy.resultSummary}</h3>
            <p>{copy.resultSummaryDesc}</p>
          </article>
        </div>
      </section>

      <section className="section section--grid section--solutions">
        <div className="section-copy">
          <span className="section-label">
            {copy.platform}
            <small>Platform Surfaces</small>
          </span>
          <h2 className="section-title">
            <span className="title-ko">{copy.platformTitle}</span>
            <small className="title-en">Two surfaces, one workflow.</small>
          </h2>
          <p className="section-text">
            <span className="copy-ko">{copy.platformDesc}</span>
            <small className="copy-en">
              Short on the surface, detailed when you need it.
            </small>
          </p>
        </div>
        <div className="solution-grid">
          <article className="solution-card">
            <span className="solution-card__eyebrow">{copy.refProject}</span>
            <h3>{copy.excelRef}</h3>
            <p>{copy.capacityYearDesc}</p>
          </article>
          <article className="solution-card">
            <span className="solution-card__eyebrow">{copy.siteReview}</span>
            <h3>{copy.siteReviewDesc}</h3>
            <p>{copy.siteReviewDesc2}</p>
          </article>
          <article className="solution-card">
            <span className="solution-card__eyebrow">{copy.resultOrganize}</span>
            <h3>{copy.resultOrganizeDesc}</h3>
            <p>{copy.resultOrganizeDesc2}</p>
          </article>
        </div>
      </section>

      <section className="feature-band">
        <div className="feature-band__copy">
          <span className="section-label">
            {copy.visualDirection}
            <small>Visual Direction</small>
          </span>
          <h2 className="section-title">
            <span className="title-ko">{copy.visualTitle}</span>
            <small className="title-en">Minimal outside, rigorous inside.</small>
          </h2>
          <p className="section-text">
            <span className="copy-ko">{copy.visualDesc}</span>
            <small className="copy-en">
              Product calm up front, EPC depth in the studio.
            </small>
          </p>
        </div>
        <div className="feature-band__visual">
          <div className="visual-panel">
            <div className="visual-panel__row">
              <span>{copy.main}</span>
              <strong>{copy.mainDesc}</strong>
            </div>
            <div className="visual-panel__row">
              <span>{copy.studio}</span>
              <strong>{copy.studioDesc}</strong>
            </div>
            <div className="visual-panel__row">
              <span>{copy.logic}</span>
              <strong>{copy.logicDesc}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cta">
        <div className="cta-card">
          <span className="section-label">
            {copy.estimateStudio}
            <small>Estimate Studio</small>
          </span>
          <h2 className="section-title">
            <span className="title-ko">{copy.ctaTitle}</span>
            <small className="title-en">Open the studio and review the number.</small>
          </h2>
          <p className="section-text">
            <span className="copy-ko">{copy.ctaDesc}</span>
            <small className="copy-en">
              Start with the inputs, not a wall of text.
            </small>
          </p>
          <div className="hero__actions hero__actions--center">
            <Link className="button button--primary" href="/estimate">
              <span className="button__stack">
                <strong>{copy.estimateStudio}</strong>
                <small>Open Estimate Studio</small>
              </span>
            </Link>
            <Link className="button button--secondary button--secondary-light" href="/b2b">
              <span className="button__stack">
                <strong>{copy.quickB2b}</strong>
                <small>Open B2B Quick Proposal</small>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
