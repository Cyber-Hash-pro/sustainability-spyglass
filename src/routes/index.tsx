import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, ShieldCheck, Sparkles, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Verdant Ledger — Corporate Carbon Footprint Intelligence" },
      {
        name: "description",
        content:
          "Measure Scope 1, 2 and 3 emissions across every facility, with traceable calculations and AI-assisted insight.",
      },
      { property: "og:title", content: "Verdant Ledger — Corporate Carbon Intelligence" },
      {
        property: "og:description",
        content: "Traceable, multi-tenant carbon accounting with AI-assisted reduction insight.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-sidebar text-sidebar-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex gap-2">
          <Button asChild variant="ghost" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
            <Link to="/auth" search={{ mode: "register" }}>Get started</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-sidebar-primary">
          GHG Protocol · Scope 1 / 2 / 3
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl leading-[1.05] md:text-7xl">
          The carbon ledger your board can actually audit.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-sidebar-foreground/70">
          Every tonne traced back to a facility, an activity record and a versioned emission
          factor. AI surfaces where to cut — it never rewrites the numbers.
        </p>
        <div className="mt-10 flex gap-3">
          <Button asChild size="lg" className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
            <Link to="/auth" search={{ mode: "register" }}>
              Set up your organization <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-24 grid gap-px overflow-hidden rounded-lg border border-sidebar-border bg-sidebar-border md:grid-cols-4">
          {[
            { icon: Building2, t: "Multi-entity", d: "Organizations, facilities and reporting boundaries with strict tenant isolation." },
            { icon: ShieldCheck, t: "Role-based", d: "Admins, ESG managers, contributors and auditors — enforced in the database." },
            { icon: Layers, t: "Traceable", d: "Versioned emission factors and an immutable audit trail on every change." },
            { icon: Sparkles, t: "AI-assisted", d: "Insights and recommendations kept separate from calculated facts." },
          ].map(({ icon: I, t, d }) => (
            <div key={t} className="bg-sidebar p-6">
              <I className="h-5 w-5 text-sidebar-primary" />
              <h3 className="mt-4 text-xl">{t}</h3>
              <p className="mt-2 text-sm text-sidebar-foreground/60">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import { Leaf } from "lucide-react";

function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="grid h-8 w-8 place-items-center rounded-md bg-sidebar-primary font-display text-sidebar-primary-foreground">
        <Leaf className="h-5 w-5" />
      </div>
      <span className="font-display text-lg">Verdant Ledger</span>
    </div>
  );
}
