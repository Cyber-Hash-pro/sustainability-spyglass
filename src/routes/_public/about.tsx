import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/about")({
  head: () => ({
    meta: [
      { title: "About Us | Verdant Ledger" },
      { name: "description", content: "Learn why we built Verdant Ledger to bring traceable, transparent carbon accounting to corporate boards." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="flex-1 bg-sidebar text-sidebar-foreground py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-display md:text-6xl mb-8">About Verdant Ledger</h1>
        
        <div className="prose prose-invert prose-lg max-w-none text-sidebar-foreground/80">
          <p className="lead text-xl text-sidebar-foreground mb-8">
            Verdant Ledger was built on a simple premise: carbon accounting should be as rigorous, traceable, and auditable as financial accounting.
          </p>

          <h2 className="text-2xl mt-12 mb-4 font-semibold text-sidebar-foreground">The Problem</h2>
          <p className="mb-6">
            For years, corporate sustainability teams have relied on fragile spreadsheets, disconnected systems, and opaque black-box calculations. When an auditor or board member asks, "Where did this emissions number come from?", the answer is often buried in a complicated chain of manual entries and unversioned emission factors.
          </p>

          <h2 className="text-2xl mt-12 mb-4 font-semibold text-sidebar-foreground">Our Mission</h2>
          <p className="mb-6">
            We are building the infrastructure for the next generation of corporate responsibility. Our mission is to provide organizations with a ledger that enforces strict tenant isolation, role-based access control, and an immutable audit trail for every single tonne of CO₂e recorded.
          </p>
          <p className="mb-6">
            We believe that AI has a powerful role to play in sustainability—but never at the expense of facts. That's why Verdant Ledger keeps AI-assisted insights strictly separated from calculated carbon facts. What gets measured, traced, and audited gets reduced.
          </p>

          <h2 className="text-2xl mt-12 mb-4 font-semibold text-sidebar-foreground">The Team</h2>
          <p className="mb-6">
            We are a team of software engineers, sustainability experts, and data scientists who have experienced the pain of enterprise carbon reporting firsthand. We built Verdant Ledger to be the tool we wished we had.
          </p>
        </div>
      </div>
    </div>
  );
}
