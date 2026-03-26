import Link from "next/link";

const copy = {
  brand: "\uC5F0\uB8CC\uC804\uC9C0 EPC",
  overview: "\uAC1C\uC694",
  workflow: "\uD750\uB984",
  b2b: "B2B \uC81C\uC548",
  studio: "\uC2A4\uD29C\uB514\uC624",
  openStudio: "\uC2A4\uD29C\uB514\uC624 \uC5F4\uAE30",
};

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/">
          <span>{copy.brand}</span>
          <em>Estimate OS</em>
        </Link>
        <nav className="site-header__nav" aria-label="Primary">
          <Link className="site-header__nav-item" href="/#overview">
            <span>{copy.overview}</span>
            <small>Overview</small>
          </Link>
          <Link className="site-header__nav-item" href="/#workflow">
            <span>{copy.workflow}</span>
            <small>Workflow</small>
          </Link>
          <Link className="site-header__nav-item" href="/b2b">
            <span>{copy.b2b}</span>
            <small>B2B</small>
          </Link>
          <Link className="site-header__nav-item" href="/estimate">
            <span>{copy.studio}</span>
            <small>Studio</small>
          </Link>
        </nav>
        <Link className="site-header__cta" href="/estimate">
          <span className="button__stack">
            <strong>{copy.openStudio}</strong>
            <small>Open Studio</small>
          </span>
        </Link>
      </div>
    </header>
  );
}
