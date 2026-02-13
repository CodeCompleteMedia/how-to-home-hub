import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { prisma } from "@/lib/prisma";

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const guides = await prisma.guide.findMany({
    where: {
      published: true,
      ...(category
        ? { category: { name: category } }
        : {}),
    },
    include: { category: true },
    orderBy: { viewCount: "desc" },
  });

  const categories = await prisma.applianceCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Home Maintenance Guides</h1>
      <p className="mt-2 text-muted">
        Free expert guides to help you maintain and care for every part of
        your home.
      </p>

      {/* Category filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/guides"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !category
              ? "bg-primary text-white"
              : "bg-card border border-border text-muted hover:text-foreground"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/guides?category=${cat.name}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === cat.name
                ? "bg-primary text-white"
                : "bg-card border border-border text-muted hover:text-foreground"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Ad */}
      <div className="my-6">
        <AdBanner slot="guides-top" format="horizontal" />
      </div>

      {/* Guide list */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.id}
            href={`/guides/${guide.slug}`}
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
          >
            <div className="flex items-center gap-2">
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
              {guide.category && (
                <span className="text-xs text-muted">
                  {guide.category.name}
                </span>
              )}
            </div>
            <h2 className="mt-3 text-lg font-semibold group-hover:text-primary">
              {guide.title}
            </h2>
            <p className="mt-2 text-sm text-muted line-clamp-3">
              {guide.summary}
            </p>
            {guide.tags && (
              <div className="mt-3 flex flex-wrap gap-1">
                {guide.tags.split(",").slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-primary-light/50 px-2 py-0.5 text-xs text-primary"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      {guides.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-muted">
            No guides found{category ? ` for "${category}"` : ""}.
          </p>
          <Link
            href="/guides"
            className="mt-4 inline-block text-sm font-medium text-primary"
          >
            View all guides
          </Link>
        </div>
      )}
    </div>
  );
}
