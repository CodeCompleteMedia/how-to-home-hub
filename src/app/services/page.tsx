import AdBanner from "@/components/AdBanner";
import { prisma } from "@/lib/prisma";

const TRADE_LABELS: Record<string, string> = {
  plumber: "Plumber",
  electrician: "Electrician",
  hvac_tech: "HVAC Technician",
  general_contractor: "General Contractor",
  roofer: "Roofer",
  painter: "Painter",
  landscaper: "Landscaper",
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <span className="text-accent" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(full)}
      {hasHalf ? "½" : ""}
      {"☆".repeat(5 - full - (hasHalf ? 1 : 0))}
    </span>
  );
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ trade?: string; zip?: string }>;
}) {
  const { trade, zip } = await searchParams;

  const providers = await prisma.serviceProvider.findMany({
    where: {
      ...(trade ? { trade } : {}),
      ...(zip ? { zipCode: zip } : {}),
    },
    include: { category: true },
    orderBy: [{ verified: "desc" }, { rating: "desc" }],
  });

  const trades = await prisma.serviceProvider.findMany({
    select: { trade: true },
    distinct: ["trade"],
    orderBy: { trade: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Find Service Professionals</h1>
      <p className="mt-2 text-muted">
        Connect with verified, trusted home service providers in your area.
      </p>

      {/* Search/Filter */}
      <form className="mt-6 flex flex-wrap gap-3" method="GET">
        <select
          name="trade"
          defaultValue={trade || ""}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">All Trades</option>
          {trades.map((t) => (
            <option key={t.trade} value={t.trade}>
              {TRADE_LABELS[t.trade] || t.trade}
            </option>
          ))}
        </select>
        <input
          name="zip"
          type="text"
          defaultValue={zip || ""}
          placeholder="ZIP Code"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm w-28 focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          Search
        </button>
      </form>

      {/* Ad */}
      <div className="my-6">
        <AdBanner slot="services-top" format="horizontal" />
      </div>

      {/* Provider List */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold">{provider.name}</h2>
                <p className="text-sm text-muted">
                  {TRADE_LABELS[provider.trade] || provider.trade}
                </p>
              </div>
              {provider.verified && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  Verified
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <StarRating rating={provider.rating} />
              <span className="text-muted">
                ({provider.reviewCount} reviews)
              </span>
            </div>

            {provider.description && (
              <p className="mt-3 text-sm text-muted line-clamp-3">
                {provider.description}
              </p>
            )}

            <div className="mt-4 space-y-1 text-sm">
              {provider.phone && (
                <p>
                  <span className="text-muted">Phone:</span>{" "}
                  <a
                    href={`tel:${provider.phone}`}
                    className="text-primary hover:underline"
                  >
                    {provider.phone}
                  </a>
                </p>
              )}
              {provider.email && (
                <p>
                  <span className="text-muted">Email:</span>{" "}
                  <a
                    href={`mailto:${provider.email}`}
                    className="text-primary hover:underline"
                  >
                    {provider.email}
                  </a>
                </p>
              )}
              {provider.city && (
                <p className="text-muted">
                  {provider.city}, {provider.state} {provider.zipCode}
                </p>
              )}
            </div>

            {provider.website && (
              <a
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-lg border border-primary px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary-light transition-colors"
              >
                Visit Website
              </a>
            )}
          </div>
        ))}
      </div>

      {providers.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-muted">
            No service providers found
            {trade ? ` for "${TRADE_LABELS[trade] || trade}"` : ""}
            {zip ? ` in ZIP ${zip}` : ""}.
          </p>
          <p className="mt-2 text-sm text-muted">
            Try broadening your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
