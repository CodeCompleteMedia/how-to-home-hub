import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/guides"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Maintenance Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/maintenance"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Schedule Tracker
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/seasonal-maintenance-checklist"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Seasonal Checklist
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Services
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Find Professionals
                </Link>
              </li>
              <li>
                <Link
                  href="/services?trade=plumber"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Plumbers
                </Link>
              </li>
              <li>
                <Link
                  href="/services?trade=electrician"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Electricians
                </Link>
              </li>
              <li>
                <Link
                  href="/services?trade=hvac_tech"
                  className="text-sm text-muted hover:text-foreground"
                >
                  HVAC Technicians
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Account
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/signup"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/signin"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              About
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm text-muted">
                  How to Home Hub
                </span>
              </li>
              <li>
                <span className="text-sm text-muted">
                  Your complete home management companion
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} How to Home Hub. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
