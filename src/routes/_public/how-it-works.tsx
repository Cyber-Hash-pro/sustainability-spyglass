import { createFileRoute } from "@tanstack/react-router";
import { Building2, Users, FileSpreadsheet, LineChart } from "lucide-react";

export const Route = createFileRoute("/_public/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it Works | Verdant Ledger" },
      { name: "description", content: "Learn the step-by-step process of implementing Verdant Ledger in your organization." },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  {
    step: "01",
    name: "Define your boundary",
    icon: Building2,
    description: "Start by mapping out your physical organization. Add your headquarters, manufacturing plants, and regional offices. Decide exactly which facilities fall within your reporting boundary.",
  },
  {
    step: "02",
    name: "Invite your team",
    icon: Users,
    description: "Carbon accounting requires collaboration. Invite ESG managers to oversee strategy, Data Contributors to enter utility bills, and Auditors to review the final numbers.",
  },
  {
    step: "03",
    name: "Record activity data",
    icon: FileSpreadsheet,
    description: "Log your fuel consumption, electricity usage, business travel, and waste. Every record is tied to a specific facility and period, ensuring complete traceability.",
  },
  {
    step: "04",
    name: "Analyze and reduce",
    icon: LineChart,
    description: "Watch as activity data is automatically converted into CO₂e using versioned emission factors. Use AI-assisted insights to identify anomalies and plan reduction initiatives.",
  }
];

function HowItWorks() {
  return (
    <div className="flex-1 bg-sidebar text-sidebar-foreground py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-20">
          <h1 className="text-4xl font-display md:text-5xl mb-6">From raw data to board-ready reports</h1>
          <p className="text-lg text-sidebar-foreground/70">
            A clear, traceable workflow designed to bring order to the chaos of enterprise carbon accounting.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-sidebar-border hidden md:block" />
          
          <div className="space-y-16">
            {steps.map((step) => (
              <div key={step.step} className="relative flex flex-col md:flex-row gap-8 md:gap-16">
                <div className="hidden md:flex flex-col items-center z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-sidebar bg-sidebar-accent text-sidebar-foreground font-mono text-xl font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1 rounded-2xl border border-sidebar-border bg-sidebar-accent/10 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground font-mono text-sm font-bold">
                      {step.step}
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-foreground">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-semibold">{step.name}</h3>
                  </div>
                  <p className="text-sidebar-foreground/70 text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
