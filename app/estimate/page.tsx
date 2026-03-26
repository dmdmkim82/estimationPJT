import { EstimateStudio } from "@/components/estimate-studio";
import { REFERENCE_TEMPLATE } from "@/lib/estimator";

export default function EstimatePage() {
  return (
    <main className="page-shell page-shell--studio">
      <section className="studio-hero studio-hero--mix">
        <div className="studio-hero__copy">
          <span className="section-label">
            견적 스튜디오
            <small>Estimate Studio</small>
          </span>
          <h1 className="section-title">
            <span className="title-ko">
              프리미엄 제안 화면 위에
              <br />
              플랜트급 검토를 올렸습니다.
            </span>
            <small className="title-en">
              Premium shell, plant-grade review.
            </small>
          </h1>
          <p className="section-text">
            <span className="copy-ko">
              {REFERENCE_TEMPLATE.name}에서 시작해 워크북 업로드, 물가상승,
              현장검토, 도면변경, 리스크, LCOE까지 어두운 산업형 리뷰 화면 안에서
              이어집니다.
            </span>
            <small className="copy-en">
              Start from {REFERENCE_TEMPLATE.name}, then move through workbook import,
              escalation, site review, drawing deltas, risk framing, and LCOE.
            </small>
          </p>
        </div>
        <div className="studio-hero__stats">
          <article className="studio-stat">
            <span>기준안 / Reference Baseline</span>
            <strong>
              {REFERENCE_TEMPLATE.referenceCapacityMw}MW / {REFERENCE_TEMPLATE.referenceYear}
            </strong>
          </article>
          <article className="studio-stat">
            <span>검토 축 / Review Axes</span>
            <strong>Cost, risk, LCOE, layout</strong>
          </article>
          <article className="studio-stat">
            <span>톤 앤 매너 / Visual Blend</span>
            <strong>Apple clarity x EPC depth</strong>
          </article>
        </div>
      </section>
      <EstimateStudio />
    </main>
  );
}
