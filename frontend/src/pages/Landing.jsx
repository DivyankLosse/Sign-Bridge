import React from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { MarketingNav, SiteFooter } from '../components/ui/PageChrome';

const features = [
  {
    icon: 'hand_gesture',
    title: 'Real-time sign recognition',
    description: 'Camera-based gesture recognition converts signed input into readable text with a stable workflow.',
  },
  {
    icon: 'animation',
    title: 'Text to sign animation',
    description: 'Typed phrases become clear sign-language playback for fast practice, teaching, and everyday exchange.',
  },
  {
    icon: 'settings_voice',
    title: 'Speech to sign support',
    description: 'Speech input is prepared for sign-friendly structure so conversations stay useful across modalities.',
  },
];

const trustItems = ['React + Vite', 'FastAPI', 'Computer Vision', 'Accessible UX'];

function HeroOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[30rem]" aria-label="Sign Bridge communication network visual">
      <div className="orbital-ring h-[58%] w-[58%]" />
      <div className="orbital-ring h-[78%] w-[78%]" />
      <div className="orbital-ring h-full w-full" />

      <Card className="absolute left-1/2 top-1/2 z-10 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center p-6 text-center sm:h-48 sm:w-48">
        <span className="material-symbols-outlined material-filled mb-3 text-4xl text-primary">sign_language</span>
        <span className="text-3xl font-bold text-ink">20k+</span>
        <span className="mt-1 text-sm text-muted">translations</span>
      </Card>

      <div className="orbit-node landing-float right-6 top-12 h-16 w-16 overflow-hidden rounded-full">
        <img
          alt="Person signing in a video call"
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=160&q=80"
        />
      </div>
      <div className="orbit-node landing-float bottom-16 left-8 h-14 w-14 rounded-lg text-secondary">
        <span className="material-symbols-outlined material-filled text-3xl">translate</span>
      </div>
      <div className="orbit-node landing-float bottom-8 right-20 h-12 w-12 rounded-lg text-primary">
        <span className="material-symbols-outlined material-filled text-2xl">hearing</span>
      </div>
      <div className="orbit-node landing-float left-8 top-24 h-12 w-12 rounded-full text-accent">
        <span className="material-symbols-outlined material-filled text-2xl">voice_chat</span>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="app-shell soft-grid">
      <MarketingNav />

      <main>
        <section className="section-container grid min-h-screen items-center gap-12 pb-20 pt-32 lg:grid-cols-[1fr_30rem]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-lg border border-outline bg-surface/80 px-4 py-2 text-sm font-semibold text-primary">
              <span className="material-symbols-outlined material-filled text-base">auto_awesome</span>
              Real-time ASL-to-voice beta
            </div>

            <div className="space-y-6">
              <h1 className="text-balance font-headline text-5xl font-bold leading-none text-ink md:text-7xl">
                Bridge communication gaps with clearer AI.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted md:text-xl">
                Sign Bridge helps hearing and deaf communities move between sign, text, and speech through a focused translation workspace.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" to="/signup">
                Start translating
              </Button>
              <Button size="lg" to="/text-to-sign" variant="secondary">
                Watch demo
                <span className="material-symbols-outlined ml-2 text-xl">play_circle</span>
              </Button>
            </div>
          </div>

          <div>
            <HeroOrbit />
          </div>
        </section>

        <section className="border-y border-outline/70 bg-background/55">
          <div className="section-container grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => (
              <div className="flex items-center gap-3 rounded-lg border border-outline bg-surface/55 px-4 py-3 text-sm font-semibold text-muted" key={item}>
                <span className="h-2 w-2 rounded-full bg-secondary" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="section-container py-24" id="solutions">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <h2 className="text-balance font-headline text-4xl font-bold text-ink md:text-5xl">
              One system for every communication mode.
            </h2>
            <p className="text-lg leading-8 text-muted">
              The interface now uses one grid, one rhythm, and one reusable component language across marketing and auth flows.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card className="p-6" key={feature.title}>
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <span className="material-symbols-outlined material-filled text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-ink">{feature.title}</h3>
                <p className="mt-4 leading-7 text-muted">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="section-container pb-24">
          <Card className="grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
            <div className="space-y-4">
              <h2 className="text-balance text-3xl font-bold text-ink md:text-5xl">
                Start a more accessible conversation.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-muted">
                Create a workspace, test the translator, and bring the same design language into the full product.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Button size="lg" to="/signup">
                Create account
              </Button>
              <Button href="mailto:enterprise@signbridge.com" size="lg" variant="secondary">
                Contact team
              </Button>
            </div>
          </Card>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
