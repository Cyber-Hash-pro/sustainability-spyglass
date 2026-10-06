import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Verdant Ledger" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="flex-1 bg-sidebar text-sidebar-foreground py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-4xl font-display mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert prose-lg max-w-none text-sidebar-foreground/80">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl mt-8 mb-4 text-sidebar-foreground">1. Introduction</h2>
          <p className="mb-4">
            At Verdant Ledger, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information and corporate data.
          </p>

          <h2 className="text-2xl mt-8 mb-4 text-sidebar-foreground">2. Data We Collect</h2>
          <p className="mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Account information (name, email address)</li>
            <li>Organizational data (facility locations, operational metrics)</li>
            <li>Activity data (fuel consumption, electricity usage, etc.)</li>
          </ul>

          <h2 className="text-2xl mt-8 mb-4 text-sidebar-foreground">3. How We Protect Your Data</h2>
          <p className="mb-4">
            We implement strict security measures including Row Level Security (RLS) to ensure complete tenant isolation. Your organizational data is strictly separated from other organizations.
          </p>
          
          <h2 className="text-2xl mt-8 mb-4 text-sidebar-foreground">4. Contact Us</h2>
          <p className="mb-4">
            If you have questions about this policy, please contact us via our Contact page.
          </p>
        </div>
      </div>
    </div>
  );
}
