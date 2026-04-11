import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const navItems = [
  { label: 'Platform', to: '/' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'Translator', to: '/translator' },
  { label: 'Demo', to: '/text-to-sign' },
];

function BrandMark() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
      <span className="material-symbols-outlined material-filled text-2xl">sign_language</span>
    </span>
  );
}

export function BrandLogo({ compact = false }) {
  return (
    <Link className="flex items-center gap-3 font-headline text-lg font-bold text-ink" to="/">
      <BrandMark />
      {!compact && <span>Sign Bridge</span>}
    </Link>
  );
}

export function MarketingNav({ active = 'Platform' }) {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-outline/70 bg-background/82 backdrop-blur-xl">
      <nav aria-label="Main navigation" className="section-container flex h-20 items-center justify-between gap-4">
        <BrandLogo />
        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const content = (
              <span
                className={
                  item.label === active
                    ? 'rounded-lg bg-surface-soft px-4 py-2 text-sm font-semibold text-ink'
                    : 'rounded-lg px-4 py-2 text-sm font-semibold text-muted transition hover:bg-surface-soft hover:text-ink'
                }
              >
                {item.label}
              </span>
            );

            return item.href ? (
              <a href={item.href} key={item.label}>
                {content}
              </a>
            ) : (
              <Link key={item.label} to={item.to}>
                {content}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button to="/login" variant="ghost">
            Sign in
          </Button>
          <Button className="hidden sm:inline-flex" to="/signup" variant="primary">
            Get started
          </Button>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-outline/70 bg-background/86">
      <div className="section-container flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-sm space-y-3">
          <BrandLogo />
          <p className="text-sm leading-6 text-muted">
            AI sign language tools for more accessible conversations.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted">
          <Link className="hover:text-primary" to="/">
            Privacy
          </Link>
          <Link className="hover:text-primary" to="/">
            Terms
          </Link>
          <Link className="hover:text-primary" to="/">
            Security
          </Link>
          <Link className="hover:text-primary" to="/">
            Accessibility
          </Link>
        </nav>
        <p className="text-sm text-subtle">2026 Sign Bridge</p>
      </div>
    </footer>
  );
}
