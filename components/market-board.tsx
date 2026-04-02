import { getMarketBoardItems } from "@/lib/market-board";

const copy = {
  title: "\uAC74\uC124\uBE44 \uC804\uAD11\uD310",
  subtitle: "\uC0AC\uB0B4 \uC790\uB8CC \uC785\uB825 \uBCF4\uB4DC",
  note: "\uB9E4\uC77C 1\uD68C \uC790\uB3D9 \uAC31\uC2E0",
  note2: "\uB0B4\uBD80\uB9DD \uC804\uC6A9",
  live: "\uB0B4\uBD80 \uBC18\uC601",
  fallback: "\uC790\uB8CC \uB300\uAE30",
  source: "\uCD9C\uCC98",
};

function buildSparklinePath(points: number[]) {
  if (points.length < 2) return "";

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  return points
    .map((value, index) => {
      const x = points.length === 1 ? 0 : (index / (points.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export async function MarketBoard() {
  const items = await getMarketBoardItems();

  return (
    <section aria-label={copy.title} className="market-board">
      <div className="market-board__inner">
        <div className="market-board__meta">
          <div>
            <span className="market-board__eyebrow">
              {copy.title}
              <small>{copy.subtitle}</small>
            </span>
          </div>
          <div className="market-board__chips">
            <span className="market-board__chip">{copy.note}</span>
            <span className="market-board__chip market-board__chip--ghost">{copy.note2}</span>
          </div>
        </div>

        <div className="market-board__grid">
          {items.map((item) => {
            const sparklinePath = buildSparklinePath(item.points);

            return (
              <article className="market-card" key={item.id}>
                <div className="market-card__top">
                  <div>
                    <span className="market-card__label">{item.title}</span>
                    <strong className="market-card__subtitle">{item.subtitle}</strong>
                  </div>
                  <span
                    className={`market-card__status ${
                      item.live ? "market-card__status--live" : "market-card__status--fallback"
                    }`}
                  >
                    {item.live ? copy.live : copy.fallback}
                  </span>
                </div>

                <div className="market-card__price">
                  <strong>{item.value}</strong>
                  <span>{item.unit}</span>
                </div>

                <div className="market-card__compare-grid">
                  <div className="market-compare">
                    <span>{item.monthLabel}</span>
                    <strong
                      className={`market-compare__value market-compare__value--${item.monthDirection}`}
                    >
                      {item.monthText}
                    </strong>
                  </div>
                  <div className="market-compare">
                    <span>{item.yearLabel}</span>
                    <strong
                      className={`market-compare__value market-compare__value--${item.yearDirection}`}
                    >
                      {item.yearText}
                    </strong>
                  </div>
                </div>

                <div aria-hidden="true" className="market-card__sparkline">
                  <svg preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path className="market-card__sparkline-track" d="M 0 50 L 100 50" />
                    {sparklinePath ? (
                      <path className="market-card__sparkline-line" d={sparklinePath} />
                    ) : null}
                  </svg>
                </div>

                <div className="market-card__footer">
                  <span>{`${item.cadence} / ${item.updatedAt}`}</span>
                  <div className="market-card__links">
                    <span className="market-card__source">
                      {copy.source}
                      <small>{item.sourceLabel}</small>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
