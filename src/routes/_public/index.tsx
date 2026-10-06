import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, ShieldCheck, Sparkles, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_public/")({
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
    <div className="flex-1 bg-sidebar text-sidebar-foreground">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:pt-32 lg:pb-32">
        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-sidebar-primary mb-8 bg-sidebar-primary/10 px-4 py-2 rounded-full border border-sidebar-primary/20">
            GHG Protocol · Scope 1 / 2 / 3
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.1] md:text-7xl font-display tracking-tight text-sidebar-foreground">
            The carbon ledger your board can actually audit.
          </h1>
          <p className="mt-8 max-w-2xl text-xl text-sidebar-foreground/70 leading-relaxed">
            Every tonne traced back to a facility, an activity record and a versioned emission
            factor. AI surfaces where to cut — it never rewrites the numbers.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
            <Button asChild size="lg" className="h-14 px-8 text-lg bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 w-full sm:w-auto rounded-full">
              <Link to="/auth" search={{ mode: "register" }}>
                Set up your organization <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg border-sidebar-border hover:bg-sidebar-accent w-full sm:w-auto rounded-full">
              <Link to="/how-it-works">See how it works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust / Social Proof */}
      <section className="border-y border-sidebar-border bg-sidebar-accent/30 py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm font-medium text-sidebar-foreground/50 mb-8 uppercase tracking-widest">Trusted by organizations serious about compliance</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
            {/* Placeholder logos for visual structure */}
            <div className="text-2xl font-display font-bold">Acme Corp</div>
            <div className="text-2xl font-display font-bold">Globex</div>
            <div className="text-2xl font-display font-bold">Soylent</div>
            <div className="text-2xl font-display font-bold">Initech</div>
            <div className="text-2xl font-display font-bold">Umbrella</div>
          </div>
        </div>
      </section>

      {/* Core Values / Small Features */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-display md:text-5xl text-sidebar-foreground">Why choose Verdant Ledger?</h2>
          <p className="mt-4 text-lg text-sidebar-foreground/70 max-w-2xl mx-auto">We rebuilt carbon accounting from the ground up, prioritizing data integrity over flashy estimates.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Building2, t: "Multi-entity", d: "Organizations, facilities and reporting boundaries with strict tenant isolation." },
            { icon: ShieldCheck, t: "Role-based", d: "Admins, ESG managers, contributors and auditors — enforced in the database." },
            { icon: Layers, t: "Traceable", d: "Versioned emission factors and an immutable audit trail on every change." },
            { icon: Sparkles, t: "AI-assisted", d: "Insights and recommendations kept separate from calculated facts." },
          ].map(({ icon: I, t, d }) => (
            <div key={t} className="rounded-2xl border border-sidebar-border bg-sidebar-accent/20 p-8 hover:bg-sidebar-accent/40 transition-colors">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sidebar-primary/20 text-sidebar-primary">
                <I className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t}</h3>
              <p className="text-sidebar-foreground/70 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Deep Dive Section 1 */}
      <section className="border-t border-sidebar-border bg-sidebar-accent/10 py-24 lg:py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-16">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h2 className="text-3xl font-display md:text-5xl text-sidebar-foreground mb-6">Uncompromising Data Traceability</h2>
            <p className="text-lg text-sidebar-foreground/70 mb-8 leading-relaxed">
              When an auditor asks for the source of a number, you shouldn't have to hunt through a spreadsheet. Verdant Ledger maintains an immutable audit trail of every data entry, tied permanently to the exact version of the emission factor used at that moment in time.
            </p>
            <ul className="space-y-4 mb-10">
              {['Version-controlled DEFRA datasets', 'Immutable event logging', 'Read-only auditor access'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sidebar-foreground/80">
                  <div className="h-2 w-2 rounded-full bg-sidebar-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="border-sidebar-primary text-sidebar-primary hover:bg-sidebar-primary hover:text-sidebar-primary-foreground">
              <Link to="/features">Explore all features</Link>
            </Button>
          </div>
          <div className="lg:w-1/2">
            <div className="relative rounded-2xl border border-sidebar-border bg-sidebar shadow-2xl overflow-hidden aspect-video">
              <div className="absolute inset-0 bg-gradient-to-br from-sidebar-primary/20 to-transparent opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Layers className="h-32 w-32 text-sidebar-primary/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive Section 2 */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-16 lg:flex-row-reverse">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h2 className="text-3xl font-display md:text-5xl text-sidebar-foreground mb-6">Designed for Complex Organizations</h2>
            <p className="text-lg text-sidebar-foreground/70 mb-8 leading-relaxed">
              Real companies aren't just one single entity. Map your entire corporate structure—from the holding company down to individual manufacturing plants and retail locations. Assign strict data entry roles so facility managers only see their own boundaries.
            </p>
            <Button asChild variant="outline" className="border-sidebar-primary text-sidebar-primary hover:bg-sidebar-primary hover:text-sidebar-primary-foreground">
              <Link to="/solutions">See solutions by role</Link>
            </Button>
          </div>
          <div className="lg:w-1/2">
            <div className="relative rounded-2xl border border-sidebar-border bg-sidebar shadow-2xl overflow-hidden aspect-[4/3]">
              <div className="absolute inset-0 bg-gradient-to-tr from-sidebar-primary/20 to-transparent opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="h-32 w-32 text-sidebar-primary/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-sidebar-border bg-sidebar-primary/5 py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-display md:text-5xl text-sidebar-foreground mb-6">Ready to bring order to your carbon data?</h2>
          <p className="text-xl text-sidebar-foreground/70 mb-10 max-w-2xl mx-auto">
            Join the organizations using Verdant Ledger to prepare for mandatory reporting and true sustainability.
          </p>
          <Button asChild size="lg" className="h-14 px-10 text-lg bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 rounded-full">
            <Link to="/auth" search={{ mode: "register" }}>Get started today</Link>
          </Button>
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
