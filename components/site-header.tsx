import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/">
          <span>연료전지 EPC</span>
          <em>Estimate OS</em>
        </Link>
        <nav className="site-header__nav" aria-label="Primary">
          <Link className="site-header__nav-item" href="/#overview">
            <span>소개</span>
            <small>Overview</small>
          </Link>
          <Link className="site-header__nav-item" href="/#workflow">
            <span>흐름</span>
            <small>Workflow</small>
          </Link>
          <Link className="site-header__nav-item" href="/b2b">
            <span>영업 제안</span>
            <small>B2B</small>
          </Link>
          <Link className="site-header__nav-item" href="/estimate">
            <span>스튜디오</span>
            <small>Studio</small>
          </Link>
        </nav>
        <Link className="site-header__cta" href="/estimate">
          <span className="button__stack">
            <strong>스튜디오 열기</strong>
            <small>Open Studio</small>
          </span>
        </Link>
      </div>
    </header>
  );
}
