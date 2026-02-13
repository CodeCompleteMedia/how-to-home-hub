import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { prisma } from "@/lib/prisma";

const CATEGORY_ICONS: Record<string, string> = {
  HVAC: "🌡️",
  Plumbing: "🔧",
  Kitchen: "🍳",
  Laundry: "👕",
  Electrical: "⚡",
  Exterior: "🏠",
  "Water Treatment": "💧",
};

export default async function HomePage() {
  const categories = await prisma.applianceCategory.findMany({
    orderBy: { name: "asc" },
  });
  const guides = await prisma.guide.findMany({
    where: { published: true },
    orderBy: { viewCount: "desc" },
    take: 4,
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark py-20 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Your Home, <span className="text-accent">Simplified</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Everything you need to manage, maintain, and care for your home
            — all in one place. Find appliance manuals, schedule maintenance,
            and connect with trusted service professionals.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="rounded-lg bg-accent px-8 py-3 text-base font-semibold text-gray-900 shadow-lg hover:bg-accent-dark transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/guides"
              className="rounded-lg border-2 border-white/30 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Browse Guides
            </Link>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <AdBanner slot="home-top" format="horizontal" />
      </div>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold">
          Everything for Your Home
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
          Whether you&apos;re a new homeowner or a seasoned pro, Home Hub
          gives you the tools to stay on top of it all.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon="📋"
            title="Appliance Manager"
            description="Enter your model numbers and instantly access manuals, guides, and warranty information for all your appliances."
          />
          <FeatureCard
            icon="🔔"
            title="Smart Maintenance Alerts"
            description="Never miss a maintenance task. Get automatic reminders when it's time to service your appliances and home systems."
          />
          <FeatureCard
            icon="🔍"
            title="Find Service Pros"
            description="Search our directory of verified plumbers, electricians, HVAC technicians, and more in your area."
          />
          <FeatureCard
            icon="📖"
            title="Expert Guides"
            description="Free access to detailed how-to guides covering every aspect of home maintenance and repair."
          />
          <FeatureCard
            icon="📅"
            title="Seasonal Checklists"
            description="Stay ahead with season-by-season maintenance checklists tailored to your home's specific needs."
          />
          <FeatureCard
            icon="💰"
            title="Save Money"
            description="Preventive maintenance saves thousands in emergency repairs. Our tools help you stay proactive."
          />
        </div>
      </section>

      {/* Categories */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-3xl font-bold">
            Browse by Category
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted">
            Explore maintenance guides and tips organized by home system.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/guides?category=${cat.name}`}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center transition-all hover:border-primary hover:shadow-md"
              >
                <span className="text-3xl">
                  {CATEGORY_ICONS[cat.name] || "🏠"}
                </span>
                <span className="font-semibold">{cat.name}</span>
                <span className="text-xs text-muted line-clamp-2">
                  {cat.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <AdBanner slot="home-mid" format="horizontal" />
      </div>

      {/* Popular Guides */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Popular Guides</h2>
          <Link
            href="/guides"
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.slug}`}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
            >
              <span
                className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                  guide.difficulty === "beginner"
                    ? "bg-green-100 text-green-700"
                    : guide.difficulty === "intermediate"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {guide.difficulty}
              </span>
              <h3 className="mt-3 font-semibold group-hover:text-primary">
                {guide.title}
              </h3>
              <p className="mt-2 text-sm text-muted line-clamp-3">
                {guide.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Take Control of Your Home?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Sign up for free and start tracking your appliances, scheduling
            maintenance, and accessing personalized guides.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-lg bg-accent px-8 py-3 text-base font-semibold text-gray-900 shadow-lg hover:bg-accent-dark transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <span className="text-3xl">{icon}</span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}
