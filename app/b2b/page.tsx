import { B2BLeadPage } from "@/components/b2b-lead-page";

export default function B2BPage() {
  return (
    <main className="page-shell page-shell--studio">
      <section className="studio-hero studio-hero--mix">
        <div className="studio-hero__copy">
          <span className="section-label">
            B2B 영업 제안
            <small>B2B Quick Proposal</small>
          </span>
          <h1 className="section-title">
            <span className="title-ko">
              부지를 넣으면
              <br />
              제안이 바로 나옵니다.
            </span>
            <small className="title-en">Site in, proposal out.</small>
          </h1>
          <p className="section-text">
            <span className="copy-ko">
              접속자가 부지 정보만 넣어도 면적, 적정 용량, 연료전지 EPC 개산금액을
              즉시 확인할 수 있는 영업형 인입 페이지입니다.
            </span>
            <small className="copy-en">
              A lead-generation page for prospects who want an immediate view of site
              area, recommended plant size, and a preliminary fuel-cell EPC budget.
            </small>
          </p>
        </div>
        <div className="studio-hero__stats">
          <article className="studio-stat">
            <span>입력 / Input</span>
            <strong>Address, parcel boundary, or simple site dimensions</strong>
          </article>
          <article className="studio-stat">
            <span>기본 제안 / Default proposal</span>
            <strong>Commercial 9.9MW when land size supports it</strong>
          </article>
          <article className="studio-stat">
            <span>출력 / Output</span>
            <strong>Area, recommended MW, EPC quote, intake summary</strong>
          </article>
        </div>
      </section>

      <B2BLeadPage />
    </main>
  );
}
