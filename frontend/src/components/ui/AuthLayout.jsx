import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import { BrandLogo, SiteFooter } from './PageChrome';

export default function AuthLayout({
  badge,
  title,
  description,
  stat,
  children,
  footerLink,
}) {
  return (
    <div className="app-shell soft-grid flex min-h-screen flex-col">
      <header className="section-container z-20 flex h-20 items-center justify-between">
        <BrandLogo />
        <Link className="text-sm font-semibold text-muted transition hover:text-primary" to="/">
          Back to platform
        </Link>
      </header>

      <main className="section-container z-10 grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1fr_28rem]">
        <section className="max-w-2xl space-y-8">
          {badge && (
            <div className="inline-flex items-center gap-2 rounded-lg border border-outline bg-surface/70 px-4 py-2 text-sm font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {badge}
            </div>
          )}
          <div className="space-y-6">
            <h1 className="text-balance font-headline text-5xl font-bold leading-none text-ink md:text-6xl">
              {title}
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted">{description}</p>
          </div>
          {stat && (
            <div className="grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-3">
              {stat.map((item) => (
                <Card className="p-5" key={item.label}>
                  <div className="text-2xl font-bold text-ink">{item.value}</div>
                  <div className="mt-1 text-sm text-muted">{item.label}</div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="relative">
          <div aria-hidden="true" className="absolute inset-0 -z-10 hidden items-center justify-center lg:flex">
            <div className="orbital-ring h-96 w-96" />
            <div className="orbital-ring h-[30rem] w-[30rem]" />
            <div className="orbit-node landing-float left-4 top-20 h-12 w-12 rounded-full text-primary">
              <span className="material-symbols-outlined material-filled">translate</span>
            </div>
            <div className="orbit-node landing-float bottom-14 right-2 h-14 w-14 rounded-lg text-secondary">
              <span className="material-symbols-outlined material-filled">hearing</span>
            </div>
          </div>
          <Card className="p-6 sm:p-8">
            {children}
            {footerLink && (
              <p className="mt-8 text-center text-sm text-muted">
                {footerLink.copy}{' '}
                <Link className="font-semibold text-primary hover:text-accent" to={footerLink.to}>
                  {footerLink.label}
                </Link>
              </p>
            )}
          </Card>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
