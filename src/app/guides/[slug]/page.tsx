import Link from "next/link";
import { notFound } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import { prisma } from "@/lib/prisma";

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const guide = await prisma.guide.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!guide) {
    notFound();
  }

  // Increment view count
  await prisma.guide.update({
    where: { id: guide.id },
    data: { viewCount: { increment: 1 } },
  });

  // Simple markdown-to-HTML conversion for content
  const htmlContent = simpleMarkdownToHtml(guide.content);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-muted">
        <Link href="/guides" className="hover:text-primary">
          Guides
        </Link>
        {guide.category && (
          <>
            {" / "}
            <Link
              href={`/guides?category=${guide.category.name}`}
              className="hover:text-primary"
            >
              {guide.category.name}
            </Link>
          </>
        )}
        {" / "}
        <span className="text-foreground">{guide.title}</span>
      </nav>

      <article>
        <div className="flex items-center gap-3">
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
          <span className="text-sm text-muted">
            {guide.viewCount.toLocaleString()} views
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold">{guide.title}</h1>
        <p className="mt-3 text-lg text-muted">{guide.summary}</p>

        {/* Ad */}
        <div className="my-6">
          <AdBanner slot="guide-article" format="horizontal" />
        </div>

        {/* Guide content */}
        <div
          className="prose prose-slate max-w-none mt-8
            [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
            [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3
            [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mt-4 [&_h3]:mb-2
            [&_p]:my-3 [&_p]:leading-7
            [&_ul]:my-3 [&_ul]:pl-6 [&_ul]:list-disc
            [&_ol]:my-3 [&_ol]:pl-6 [&_ol]:list-decimal
            [&_li]:my-1
            [&_strong]:font-semibold
            [&_table]:w-full [&_table]:my-4 [&_table]:border-collapse
            [&_th]:border [&_th]:border-border [&_th]:bg-primary-light/30 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold
            [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm
          "
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Tags */}
        {guide.tags && (
          <div className="mt-8 flex flex-wrap gap-2">
            {guide.tags.split(",").map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary-light/50 px-3 py-1 text-sm text-primary"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Bottom ad */}
      <div className="mt-8">
        <AdBanner slot="guide-bottom" format="horizontal" />
      </div>

      {/* Back link */}
      <div className="mt-8">
        <Link
          href="/guides"
          className="text-sm font-medium text-primary hover:text-primary-dark"
        >
          &larr; Back to all guides
        </Link>
      </div>
    </div>
  );
}

function simpleMarkdownToHtml(md: string): string {
  let html = md;

  // Escape HTML entities (but preserve our own tags)
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Tables
  html = html.replace(
    /^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/gm,
    (_match, header: string, _separator: string, body: string) => {
      const headerCells = header
        .split("|")
        .filter((c: string) => c.trim())
        .map((c: string) => `<th>${c.trim()}</th>`)
        .join("");
      const rows = body
        .trim()
        .split("\n")
        .map((row: string) => {
          const cells = row
            .split("|")
            .filter((c: string) => c.trim())
            .map((c: string) => `<td>${c.trim()}</td>`)
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");
      return `<table><thead><tr>${headerCells}</tr></thead><tbody>${rows}</tbody></table>`;
    }
  );

  // Unordered lists
  html = html.replace(/^- \[[ x]\] (.+)$/gm, "<li>$1</li>");
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.+<\/li>\n?)+)/g, "<ul>$1</ul>");

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Paragraphs (lines that aren't already wrapped in tags)
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<table")
      ) {
        return trimmed;
      }
      return `<p>${trimmed}</p>`;
    })
    .join("\n");

  return html;
}
