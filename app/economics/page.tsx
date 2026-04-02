import { EconomicsStudio } from "@/components/economics-studio";
import { MarketBoard } from "@/components/market-board";

export default function EconomicsPage() {
  return (
    <main className="page-shell page-shell--studio page-shell--economics">
      <MarketBoard />

      <section className="studio-hero studio-hero--mix">
        <div className="studio-hero__copy">
          <span className="section-label">{"\uACBD\uC81C\uC131"}</span>
          <h1 className="section-title">
            <span className="title-ko">{"\uD22C\uC790\uC9C0\uD45C \uAC80\uD1A0"}</span>
          </h1>
        </div>
      </section>

      <EconomicsStudio />
    </main>
  );
}
