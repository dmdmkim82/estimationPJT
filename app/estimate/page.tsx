import { EstimateStudio } from "@/components/estimate-studio";
import { REFERENCE_TEMPLATE } from "@/lib/estimator";

const copy = {
  estimateStudio: "\uACAC\uC801 \uC2A4\uD29C\uB514\uC624",
  title1: "\uAE30\uC900 \uD504\uB85C\uC81D\uD2B8\uC5D0\uC11C \uC2DC\uC791\uD574",
  title2: "\uD544\uC694\uD55C \uD56D\uBAA9\uB9CC \uAC80\uD1A0\uD569\uB2C8\uB2E4.",
  description:
    "\uC6CC\uD06C\uBD81, \uBB3C\uAC00\uC0C1\uC2B9, \uD604\uC7A5\uC870\uAC74, \uB9AC\uC2A4\uD06C\uB97C \uC21C\uC11C\uB300\uB85C \uD655\uC778\uD569\uB2C8\uB2E4.",
  refProject: "\uAE30\uC900 \uD504\uB85C\uC81D\uD2B8",
  reviewAxis: "\uAC80\uD1A0 \uCD95",
  reviewAxisDesc: "\uAE08\uC561, \uB9AC\uC2A4\uD06C, LCOE, \uBC30\uCE58",
  screenTone: "\uD654\uBA74 \uD1A4",
};

export default function EstimatePage() {
  return (
    <main className="page-shell page-shell--studio">
      <section className="studio-hero studio-hero--mix">
        <div className="studio-hero__copy">
          <span className="section-label">
            {copy.estimateStudio}
            <small>Estimate Studio</small>
          </span>
          <h1 className="section-title">
            <span className="title-ko">
              {copy.title1}
              <br />
              {copy.title2}
            </span>
            <small className="title-en">Reference first, review what matters.</small>
          </h1>
          <p className="section-text">
            <span className="copy-ko">{copy.description}</span>
            <small className="copy-en">
              Workbook import, escalation, site scope, and risk in one flow.
            </small>
          </p>
        </div>
        <div className="studio-hero__stats">
          <article className="studio-stat">
            <span>{copy.refProject}</span>
            <strong>
              {REFERENCE_TEMPLATE.referenceCapacityMw}MW / {REFERENCE_TEMPLATE.referenceYear}
            </strong>
          </article>
          <article className="studio-stat">
            <span>{copy.reviewAxis}</span>
            <strong>{copy.reviewAxisDesc}</strong>
          </article>
          <article className="studio-stat">
            <span>{copy.screenTone}</span>
            <strong>Apple clarity x EPC depth</strong>
          </article>
        </div>
      </section>
      <EstimateStudio />
    </main>
  );
}
