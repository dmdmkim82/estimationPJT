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
    <main className="page-shell page-shell--landing">
      <section className="hero hero--mix" id="overview">
        <div className="hero__content">
          <span className="hero__eyebrow">
            산업형 견적 플랫폼
            <small>Industrial Estimate Platform</small>
          </span>
          <h1 className="hero__title">
            <span className="title-ko">
              연료전지 EPC 견적을
              <br />
              제품처럼 제안하고
              <br />
              플랜트처럼 검토합니다.
            </span>
            <small className="title-en">
              Fuel-cell EPC, staged like a product launch and reviewed like a
              plant project.
            </small>
          </h1>
          <p className="hero__copy">
            <span className="copy-ko">
              레퍼런스 PJT, 현장검토, 도면변경, 리스크, LCOE를 한 화면에서
              이어주는 프리미엄 EPC 워크스페이스입니다.
            </span>
            <small className="copy-en">
              A premium shell for workbook-driven estimating, site-review adders,
              drawing deltas, risk framing, and LCOE comparison.
            </small>
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/estimate">
              <span className="button__stack">
                <strong>스튜디오 실행</strong>
                <small>Launch Studio</small>
              </span>
            </Link>
            <Link className="button button--secondary" href="/b2b">
              <span className="button__stack">
                <strong>B2B 제안 페이지</strong>
                <small>Open B2B Page</small>
              </span>
            </Link>
            <a className="button button--secondary" href="#workflow">
              <span className="button__stack">
                <strong>의사결정 흐름</strong>
                <small>Decision Flow</small>
              </span>
            </a>
          </div>
          <div className="hero-specs">
            <article className="hero-spec">
              <span>기준 PJT DB</span>
              <strong>Workbook imports + reusable PJT memory</strong>
            </article>
            <article className="hero-spec">
              <span>검토 화면</span>
              <strong>Cost, risk, LCOE, layout in one frame</strong>
            </article>
            <article className="hero-spec">
              <span>물가상승 반영</span>
              <strong>Category-based year shift from bid basis to NTP</strong>
            </article>
          </div>
        </div>

        <div className="hero__device">
          <div className="hero-card hero-card--mix">
            <div className="hero-card__top">
              <span className="hero-card__label">실시간 개산 프레임</span>
              <span className="hero-card__chip">2025 -&gt; 2027</span>
            </div>
            <h2>{REFERENCE_TEMPLATE.name}</h2>
            <p>
              {REFERENCE_TEMPLATE.referenceCapacityMw}MW 기준안을{" "}
              {REFERENCE_TEMPLATE.referenceYear}년 단가 기준으로 잡고, 업로드한 PJT와
              프로젝트별 물가상승을 바로 덧입힐 수 있습니다.
            </p>
            <div className="stat-grid">
              <div className="stat-card">
                <span>기준 금액 / Baseline</span>
                <strong>{formatEok(REFERENCE_TEMPLATE.referenceTotalEok)}</strong>
              </div>
              <div className="stat-card">
                <span>개산 견적 / Preview quote</span>
                <strong>{formatEok(preview.grandTotal)}</strong>
              </div>
              <div className="stat-card">
                <span>리스크 등급 / Risk band</span>
                <strong>{preview.riskGrade}</strong>
              </div>
            </div>
            <div className="signal-list">
              <div className="signal-row">
                <span>기준 레이어</span>
                <strong>Workbook, site review, drawing delta</strong>
              </div>
              <div className="signal-row">
                <span>상업 검토</span>
                <strong>Escalation, margin posture, warranty</strong>
              </div>
              <div className="signal-row">
                <span>제안 결과</span>
                <strong>Risk note, LCOE, virtual layout</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--grid" id="workflow">
        <div className="section-copy">
          <span className="section-label">
            견적 흐름
            <small>Workflow</small>
          </span>
          <h2 className="section-title">
            <span className="title-ko">브랜드 톤은 고급스럽게, 검토 방식은 산업형으로.</span>
            <small className="title-en">
              A narrative shell with industrial review surfaces.
            </small>
          </h2>
          <p className="section-text">
            <span className="copy-ko">
              차분한 제품형 여백과 계층을 쓰되, 솔루션 타일과 어두운 인프라 밴드로
              EPC 검토의 무게를 유지했습니다.
            </span>
            <small className="copy-en">
              Apple-like spacing and hierarchy, balanced with darker infrastructure
              bands for plant delivery and EPC review.
            </small>
          </p>
        </div>
        <div className="marketing-grid">
          <article className="marketing-card">
            <span className="marketing-card__index">01</span>
            <h3>기준 프로젝트 메모리</h3>
            <p>
              레퍼런스 PJT를 반복 계산용 기억자산으로 축적합니다.
            </p>
          </article>
          <article className="marketing-card">
            <span className="marketing-card__index">02</span>
            <h3>현장 조건 가시화</h3>
            <p>
              부지정리, 옹벽, 유틸리티, 송전선 범위를 견적과 함께 드러냅니다.
            </p>
          </article>
          <article className="marketing-card">
            <span className="marketing-card__index">03</span>
            <h3>의사결정용 출력</h3>
            <p>
              리스크, LCOE, 가상 배치까지 묶어 숫자의 설명력을 높입니다.
            </p>
          </article>
        </div>
      </section>

      <section className="section section--grid section--solutions">
        <div className="section-copy">
          <span className="section-label">
            플랫폼 구조
            <small>Platform Surfaces</small>
          </span>
          <h2 className="section-title">
            <span className="title-ko">겉은 프리미엄 제안서처럼, 내부는 엔지니어링 규율로.</span>
            <small className="title-en">
              Premium storytelling up front, engineering discipline underneath.
            </small>
          </h2>
          <p className="section-text">
            <span className="copy-ko">
              바깥은 런치 페이지처럼 절제하고, 안쪽은 에너지 인프라 문법을 넣어
              견적 도구의 신뢰감을 지켰습니다.
            </span>
            <small className="copy-en">
              Minimal product-launch calm outside, heavier energy-infrastructure cues
              inside.
            </small>
          </p>
        </div>
        <div className="solution-grid">
          <article className="solution-card">
            <span className="solution-card__eyebrow">기준 PJT 적재 / Reference Ingestion</span>
            <h3>엑셀 기준안을 올리고 다음 프로젝트의 출발점으로 삼습니다.</h3>
            <p>Turn itemized Excel references into the basis for scaling, escalation, and comparison.</p>
          </article>
          <article className="solution-card">
            <span className="solution-card__eyebrow">현장·도면 검토 / Industrial Review</span>
            <h3>현장과 도면 변경 영향을 숫자 뒤로 숨기지 않습니다.</h3>
            <p>Grid tie, civil prep, and drawing deltas stay in the same decision surface as EPC price.</p>
          </article>
          <article className="solution-card">
            <span className="solution-card__eyebrow">제안 결과 / Executive Output</span>
            <h3>견적, 리스크, LCOE, 배치를 하나의 프레임으로 묶습니다.</h3>
            <p>The number stays attached to its assumptions, tradeoffs, and downstream operating view.</p>
          </article>
        </div>
      </section>

      <section className="feature-band">
        <div className="feature-band__copy">
          <span className="section-label">
            시각 방향
            <small>Visual Direction</small>
          </span>
          <h2 className="section-title">
            <span className="title-ko">제품형 긴장감 위에 산업형 신뢰를 올렸습니다.</span>
            <small className="title-en">
              Minimal product drama, industrial EPC credibility.
            </small>
          </h2>
          <p className="section-text">
            <span className="copy-ko">
              랜딩은 프리미엄 제품처럼 보이되, 어두운 밴드와 운영형 언어로
              에너지 인프라 브랜드의 무게를 유지합니다.
            </span>
            <small className="copy-en">
              A premium launch-page shell, pulled back toward an
              energy-infrastructure brand.
            </small>
          </p>
        </div>
        <div className="feature-band__visual">
          <div className="visual-panel">
            <div className="visual-panel__row">
              <span>메인 / Home</span>
              <strong>Monumental type, calm spacing, polished panels</strong>
            </div>
            <div className="visual-panel__row">
              <span>스튜디오 / Studio</span>
              <strong>Dark review band with lighter analytical workspace</strong>
            </div>
            <div className="visual-panel__row">
              <span>로직 / Logic</span>
              <strong>Reference DB, escalation, risk, LCOE, layout</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cta">
        <div className="cta-card">
          <span className="section-label">
            견적 스튜디오
            <small>Estimate Studio</small>
          </span>
          <h2 className="section-title">
            <span className="title-ko">차분한 제안 페이지에서 실제 입찰 검토로 이동합니다.</span>
            <small className="title-en">
              Move from launch-page calm to bid-room rigor.
            </small>
          </h2>
          <p className="section-text">
            <span className="copy-ko">
              같은 제품 프레임 안에서 스토리텔링에서 실제 EPC 검토로 넘어갑니다.
            </span>
            <small className="copy-en">
              Shift from narrative positioning to actual EPC review in the same
              product frame.
            </small>
          </p>
          <div className="hero__actions hero__actions--center">
            <Link className="button button--primary" href="/estimate">
              <span className="button__stack">
                <strong>견적 스튜디오</strong>
                <small>Open Estimate Studio</small>
              </span>
            </Link>
            <Link className="button button--secondary button--secondary-light" href="/b2b">
              <span className="button__stack">
                <strong>B2B 영업 제안</strong>
                <small>Open B2B Quick Proposal</small>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
