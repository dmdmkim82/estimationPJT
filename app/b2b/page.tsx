import { B2BLeadPage } from "@/components/b2b-lead-page";

export default function B2BPage() {
  return (
    <main className="page-shell page-shell--studio page-shell--b2b">
      <section className="studio-hero studio-hero--mix">
        <div className="studio-hero__copy">
          <span className="section-label">B2B {"\uC81C\uC548"}</span>
          <h1 className="section-title">
            <span className="title-ko">{"\uC601\uC5C5 \uCD08\uC548 \uC791\uC131"}</span>
          </h1>
        </div>
      </section>

      <B2BLeadPage />
    </main>
  );
}
