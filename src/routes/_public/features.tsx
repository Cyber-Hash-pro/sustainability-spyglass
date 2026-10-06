import { createFileRoute } from "@tanstack/react-router";
import { Building2, ShieldCheck, Layers, Sparkles, Activity, Factory, FileText, Database } from "lucide-react";

export const Route = createFileRoute("/_public/features")({
  head: () => ({
    meta: [
      { title: "Features | Verdant Ledger" },
      { name: "description", content: "Explore the features that make Verdant Ledger the most rigorous carbon accounting platform for enterprises." },
    ],
  }),
  component: Features,
});

const features = [
  {
    icon: Building2,
    name: "Multi-entity Architecture",
    description: "Manage complex organizational structures. Define facilities, departments, and strict reporting boundaries with complete tenant isolation.",
  },
  {
    icon: ShieldCheck,
    name: "Role-Based Access Control",
    description: "Enforce strict permissions at the database level. Separate views and capabilities for Super Admins, Org Admins, ESG Managers, Data Contributors, and Auditors.",
  },
  {
    icon: Layers,
    name: "Versioned Emission Factors",
    description: "Never lose the context of a calculation. We use versioned emission factors (like the UK DEFRA reference set) ensuring historical reports remain accurate.",
  },
  {
    icon: Activity,
    name: "Comprehensive Activity Tracking",
    description: "Track Scope 1, 2, and 3 emissions. Record fuel, electricity, travel, waste, and freight data mapped directly to the originating facility.",
  },
  {
    icon: Database,
    name: "Immutable Audit Trail",
    description: "Every change to data, boundaries, or factors is logged automatically. Give your auditors read-only access to a fully traceable history.",
  },
  {
    icon: Sparkles,
    name: "AI-Assisted Insights",
    description: "Leverage AI to surface reduction opportunities and identify anomalies. AI commentary is always explicitly labeled and never overwrites calculated facts.",
  },
];

function Features() {
  return (
    <div className="flex-1 bg-sidebar text-sidebar-foreground py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-sidebar-primary mb-4">Platform Capabilities</h2>
          <h1 className="text-4xl font-display md:text-5xl mb-6">Built for precision and auditability</h1>
          <p className="text-lg text-sidebar-foreground/70">
            Verdant Ledger combines enterprise-grade data structures with intuitive workflows to solve the hardest problems in carbon accounting.
          </p>
        </div>

        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-sidebar-accent border border-sidebar-border">
                <feature.icon className="h-6 w-6 text-sidebar-primary" />
              </div>
              <h3 className="text-xl font-semibold leading-7 text-sidebar-foreground">{feature.name}</h3>
              <p className="mt-2 flex-auto text-base leading-7 text-sidebar-foreground/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
