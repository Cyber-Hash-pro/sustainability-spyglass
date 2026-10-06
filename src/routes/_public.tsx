import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", to: "/features" },
    { label: "Solutions", to: "/solutions" },
    { label: "How it works", to: "/how-it-works" },
    { label: "Pricing", to: "/pricing" },
    { label: "About", to: "/about" },
  ];

  return (
    <div className="min-h-screen bg-sidebar text-sidebar-foreground flex flex-col selection:bg-sidebar-primary/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-sidebar-border bg-sidebar/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-sidebar-primary font-display text-sidebar-primary-foreground">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="font-display text-lg tracking-tight">Verdant Ledger</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-sidebar-foreground/80">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="hover:text-sidebar-foreground transition-colors" activeProps={{ className: "text-sidebar-foreground font-semibold" }}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="ghost" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
              <Link to="/auth" search={{ mode: "register" }}>Get started</Link>
            </Button>
          </div>
          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-sidebar-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 top-16 bg-sidebar border-b border-sidebar-border p-6 overflow-y-auto">
          <nav className="flex flex-col gap-4 text-lg font-medium">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-sidebar-primary">
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-sidebar-border my-4" />
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="py-2">Sign in</Link>
            <Link to="/auth" search={{ mode: "register" }} onClick={() => setMobileMenuOpen(false)} className="py-2 text-sidebar-primary">Get started</Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-sidebar-border bg-sidebar-accent/30 py-12 lg:py-16 mt-auto">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-6 xl:col-span-1">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-sidebar-primary font-display text-sidebar-primary-foreground">
                  <Leaf className="h-5 w-5" />
                </div>
                <span className="font-display text-lg tracking-tight">Verdant Ledger</span>
              </div>
              <p className="text-sm leading-6 text-sidebar-foreground/70 max-w-xs">
                The carbon ledger your board can actually audit. Traceable, multi-tenant carbon accounting with AI-assisted reduction insight.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-sidebar-foreground">Product</h3>
                  <ul className="mt-6 space-y-4">
                    <li><Link to="/features" className="text-sm leading-6 text-sidebar-foreground/70 hover:text-sidebar-foreground">Features</Link></li>
                    <li><Link to="/solutions" className="text-sm leading-6 text-sidebar-foreground/70 hover:text-sidebar-foreground">Solutions</Link></li>
                    <li><Link to="/pricing" className="text-sm leading-6 text-sidebar-foreground/70 hover:text-sidebar-foreground">Pricing</Link></li>
                    <li><Link to="/how-it-works" className="text-sm leading-6 text-sidebar-foreground/70 hover:text-sidebar-foreground">How it works</Link></li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-sidebar-foreground">Company</h3>
                  <ul className="mt-6 space-y-4">
                    <li><Link to="/about" className="text-sm leading-6 text-sidebar-foreground/70 hover:text-sidebar-foreground">About us</Link></li>
                    <li><Link to="/contact" className="text-sm leading-6 text-sidebar-foreground/70 hover:text-sidebar-foreground">Contact</Link></li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-sidebar-foreground">Resources</h3>
                  <ul className="mt-6 space-y-4">
                    <li><Link to="/faq" className="text-sm leading-6 text-sidebar-foreground/70 hover:text-sidebar-foreground">FAQ</Link></li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-sidebar-foreground">Legal</h3>
                  <ul className="mt-6 space-y-4">
                    <li><Link to="/privacy" className="text-sm leading-6 text-sidebar-foreground/70 hover:text-sidebar-foreground">Privacy Policy</Link></li>
                    <li><Link to="/terms" className="text-sm leading-6 text-sidebar-foreground/70 hover:text-sidebar-foreground">Terms of Service</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-sidebar-border pt-8 sm:mt-20 lg:mt-24">
            <p className="text-xs leading-5 text-sidebar-foreground/50">&copy; {new Date().getFullYear()} Verdant Ledger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
