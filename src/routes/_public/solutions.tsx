import { createFileRoute } from "@tanstack/react-router";
import { Users2, ShieldCheck, Factory, LineChart } from "lucide-react";

export const Route = createFileRoute("/_public/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions | Verdant Ledger" },
      { name: "description", content: "Tailored carbon accounting solutions for every role in your organization." },
    ],
  }),
  component: Solutions,
});

const roles = [
  {
    title: "For ESG Managers",
    icon: LineChart,
    description: "Streamline data collection and consolidate reporting. Say goodbye to spreadsheet errors and focus on strategy.",
    benefits: [
      "Automated carbon footprint calculations",
      "Scenario modeling for reduction targets",
      "Centralized dashboard for Scope 1, 2, and 3",
    ]
  },
  {
    title: "For Auditors",
    icon: ShieldCheck,
    description: "Gain complete confidence in the numbers. Our platform is built with traceability as a first-class citizen.",
    benefits: [
      "Immutable audit logs for every record",
      "Versioned emission factors",
      "Direct read-only access to source data",
    ]
  },
  {
    title: "For Data Contributors",
    icon: Users2,
    description: "Make data entry simple and error-free. Provide the right data at the right time without confusion.",
    benefits: [
      "Simple, focused data entry interfaces",
      "Clear facility assignments",
      "Historical data visibility",
    ]
  },
  {
    title: "For Facility Leads",
    icon: Factory,
    description: "Monitor and manage the environmental impact of your specific physical locations.",
    benefits: [
      "Facility-level reporting boundaries",
      "Compare performance across sites",
      "Local target tracking",
    ]
  }
];

function Solutions() {
  return (
    <div className="flex-1 bg-sidebar text-sidebar-foreground py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h1 className="text-4xl font-display md:text-5xl mb-6">Built for the whole team</h1>
          <p className="text-lg text-sidebar-foreground/70">
            Carbon accounting isn't a one-person job. Verdant Ledger provides specialized tools and strict access controls for everyone involved in your sustainability journey.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {roles.map((role) => (
            <div key={role.title} className="rounded-2xl border border-sidebar-border bg-sidebar-accent/20 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <role.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold">{role.title}</h3>
              </div>
              <p className="text-sidebar-foreground/80 mb-6">{role.description}</p>
              <ul className="space-y-3">
                {role.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-sidebar-foreground/70">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sidebar-primary shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
