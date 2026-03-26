import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/">
          SOFC Estimate
        </Link>
        <nav className="site-header__nav" aria-label="Primary">
          <Link href="/#overview">Overview</Link>
          <Link href="/#workflow">Workflow</Link>
          <Link href="/estimate">Studio</Link>
        </nav>
        <Link className="site-header__cta" href="/estimate">
          Open Studio
        </Link>
      </div>
    </header>
  );
}
