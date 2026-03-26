import { EstimateStudio } from "@/components/estimate-studio";
import { REFERENCE_TEMPLATE } from "@/lib/estimator";

export default function EstimatePage() {
  return (
    <main className="page-shell page-shell--studio">
      <section className="studio-hero">
        <div>
          <span className="section-label">Estimate Studio</span>
          <h1 className="section-title">
            Reference-driven pricing,
            <br />
            re-composed for a cleaner review flow.
          </h1>
          <p className="section-text">
            Baseline source: {REFERENCE_TEMPLATE.name},{" "}
            {REFERENCE_TEMPLATE.referenceCapacityMw}MW /{" "}
            {REFERENCE_TEMPLATE.referenceYear}.
          </p>
        </div>
      </section>
      <EstimateStudio />
    </main>
  );
}
