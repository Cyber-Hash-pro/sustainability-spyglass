import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_public/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing | Verdant Ledger" },
      { name: "description", content: "Enterprise-grade carbon accounting without the enterprise pricing complexity." },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <div className="flex-1 bg-sidebar text-sidebar-foreground py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-display md:text-5xl mb-6">Simple, transparent pricing</h1>
          <p className="text-lg text-sidebar-foreground/70 mb-16">
            Every plan includes unlimited users and our core role-based access control system.
          </p>
        </div>

        <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
          {/* Professional Plan */}
          <div className="rounded-3xl p-8 ring-1 ring-sidebar-border xl:p-10">
            <h3 className="text-lg font-semibold leading-8 text-sidebar-foreground">Professional</h3>
            <p className="mt-4 text-sm leading-6 text-sidebar-foreground/70">For growing organizations tracking up to 5 facilities.</p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-sidebar-foreground">Talk to sales</span>
            </p>
            <Button asChild className="mt-6 w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <ul className="mt-8 space-y-3 text-sm leading-6 text-sidebar-foreground/70">
              {['Up to 5 facilities', 'Unlimited users', 'Role-based access control', 'Scope 1 & 2 emissions', 'Basic reporting', 'Email support'].map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-sidebar-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-3xl p-8 ring-2 ring-sidebar-primary bg-sidebar-accent/10 xl:p-10">
            <div className="flex items-center justify-between gap-x-4">
              <h3 className="text-lg font-semibold leading-8 text-sidebar-foreground">Enterprise</h3>
              <p className="rounded-full bg-sidebar-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-sidebar-primary">Most popular</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-sidebar-foreground/70">For large organizations requiring full Scope 3 and custom integrations.</p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-sidebar-foreground">Custom</span>
            </p>
            <Button asChild className="mt-6 w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
              <Link to="/contact">Contact Sales</Link>
            </Button>
            <ul className="mt-8 space-y-3 text-sm leading-6 text-sidebar-foreground/70">
              {['Unlimited facilities', 'Full Scope 1, 2, & 3 tracking', 'AI-assisted reduction insights', 'Immutable audit trails', 'Custom emission factors', 'Dedicated success manager'].map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-sidebar-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
