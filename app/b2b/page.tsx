import { B2BLeadPage } from "@/components/b2b-lead-page";

const copy = {
  title: "B2B \uC601\uC5C5 \uC81C\uC548",
  hero1: "\uBD80\uC9C0\uB9CC \uC785\uB825\uD558\uBA74",
  hero2: "1\uCC28 \uC81C\uC548\uC774 \uBC14\uB85C \uB098\uC635\uB2C8\uB2E4.",
  description:
    "\uC8FC\uC18C\uC640 \uBA74\uC801 \uC815\uBCF4\uB85C \uAD8C\uC7A5 \uC6A9\uB7C9\uACFC \uC608\uBE44 EPC \uAE08\uC561\uC744 \uACC4\uC0B0\uD569\uB2C8\uB2E4.",
  input: "\uC785\uB825",
  inputDesc: "\uC8FC\uC18C, \uACBD\uACC4 \uC88C\uD45C, \uAC00\uB85C\uC640 \uC138\uB85C",
  defaultProposal: "\uAE30\uBCF8 \uC81C\uC548",
  defaultProposalDesc:
    "\uC870\uAC74\uC774 \uB9DE\uC73C\uBA74 9.9MW \uAE30\uC900\uC73C\uB85C \uC81C\uC548",
  output: "\uCD9C\uB825",
  outputDesc: "\uBA74\uC801, \uAD8C\uC7A5 MW, EPC \uAE08\uC561, \uC694\uC57D \uBA54\uBAA8",
};

export default function B2BPage() {
  return (
    <main className="page-shell page-shell--studio">
      <section className="studio-hero studio-hero--mix">
        <div className="studio-hero__copy">
          <span className="section-label">
            {copy.title}
            <small>B2B Quick Proposal</small>
          </span>
          <h1 className="section-title">
            <span className="title-ko">
              {copy.hero1}
              <br />
              {copy.hero2}
            </span>
            <small className="title-en">Site in, proposal out.</small>
          </h1>
          <p className="section-text">
            <span className="copy-ko">{copy.description}</span>
            <small className="copy-en">
              Turn parcel input into area, capacity, and a preliminary EPC quote.
            </small>
          </p>
        </div>
        <div className="studio-hero__stats">
          <article className="studio-stat">
            <span>{copy.input}</span>
            <strong>{copy.inputDesc}</strong>
          </article>
          <article className="studio-stat">
            <span>{copy.defaultProposal}</span>
            <strong>{copy.defaultProposalDesc}</strong>
          </article>
          <article className="studio-stat">
            <span>{copy.output}</span>
            <strong>{copy.outputDesc}</strong>
          </article>
        </div>
      </section>

      <B2BLeadPage />
    </main>
  );
}
