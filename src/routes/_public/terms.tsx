import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Verdant Ledger" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="flex-1 bg-sidebar text-sidebar-foreground py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-4xl font-display mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert prose-lg max-w-none text-sidebar-foreground/80">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl mt-8 mb-4 text-sidebar-foreground">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the Verdant Ledger platform, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-2xl mt-8 mb-4 text-sidebar-foreground">2. Use of Service</h2>
          <p className="mb-4">
            You are responsible for maintaining the confidentiality of your account credentials. You agree not to misuse the platform or attempt to gain unauthorized access to data outside of your organizational boundary.
          </p>

          <h2 className="text-2xl mt-8 mb-4 text-sidebar-foreground">3. Data Ownership</h2>
          <p className="mb-4">
            You retain all rights to the data you input into Verdant Ledger. We claim no ownership over your corporate activity data or calculated emission results.
          </p>

          <h2 className="text-2xl mt-8 mb-4 text-sidebar-foreground">4. Accuracy of Information</h2>
          <p className="mb-4">
            While Verdant Ledger provides calculations based on standard emission factors, you are ultimately responsible for the accuracy of the activity data entered into the system.
          </p>
        </div>
      </div>
    </div>
  );
}
