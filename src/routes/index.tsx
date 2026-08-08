import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { loadPosts } from "../lib/posts";

const PAGE_SIZE = 24;

const fetchPosts = createServerFn({ method: "GET" }).handler(() => {
  return loadPosts().map(({ slug, title, sourceSharedAt, reviewStatus }) => ({
    slug,
    title,
    sourceSharedAt,
    reviewStatus,
  }));
});

export const Route = createFileRoute("/")({
  loader: () => fetchPosts(),
  component: Home,
});

function statusLabel(status: string) {
  return status.replaceAll("-", " ");
}

function statusClass(status: string) {
  if (status === "reviewed") return "badge-success";
  if (status === "needs-review") return "badge-warning";
  if (status === "duplicate") return "badge-neutral";
  return "badge-info";
}

function Home() {
  const posts = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = normalizedQuery
    ? posts.filter((post) =>
      `${post.title} ${post.reviewStatus}`.toLowerCase().includes(normalizedQuery)
    )
    : posts;
  const visiblePosts = filteredPosts.slice(0, limit);
  const reviewedCount = posts.filter((post) =>
    post.reviewStatus === "reviewed"
  ).length;

  return (
    <div className="min-h-screen">
      <header className="border-b border-base-300 bg-base-100/90 backdrop-blur">
        <div className="navbar mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex-1 gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-primary font-black text-primary-content shadow-sm">
              UH
            </div>
            <div>
              <a href="/" className="text-lg font-bold tracking-tight">
                Ubuntu TechHive
              </a>
              <p className="text-xs text-base-content/60">Community knowledge</p>
            </div>
          </div>
          <a
            className="btn btn-ghost btn-sm hidden sm:inline-flex"
            href="https://ubuntuhive.tech"
            rel="noreferrer"
          >
            Visit the TechHive
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <section className="hero overflow-hidden rounded-3xl border border-primary/15 bg-base-100 shadow-xl shadow-primary/5">
          <div className="hero-content w-full flex-col items-stretch gap-8 p-6 sm:p-10 lg:flex-row lg:items-center lg:p-14">
            <div className="max-w-3xl flex-1">
              <div className="badge badge-primary badge-outline mb-5 gap-2 py-3 font-semibold">
                <span className="size-2 rounded-full bg-primary" />
                Curated by the community
              </div>
              <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Useful links,
                <span className="block text-primary">worth keeping.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-base-content/70 sm:text-lg">
                Explore the tools, talks, articles, and ideas shared by Ubuntu
                TechHive members—all preserved as searchable Markdown posts.
              </p>

              <label className="input input-lg mt-8 w-full max-w-2xl rounded-2xl border-base-300 bg-base-200/70 shadow-inner focus-within:border-primary focus-within:outline-none">
                <svg
                  aria-hidden="true"
                  className="size-5 opacity-50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  aria-label="Search curated posts"
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setLimit(PAGE_SIZE);
                  }}
                  placeholder="Search by title or review status…"
                  className="grow"
                />
                {query && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs rounded-full"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </label>
            </div>

            <div className="stats stats-vertical shrink-0 border border-base-300 bg-base-200/60 shadow-sm sm:stats-horizontal lg:stats-vertical xl:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Curated posts</div>
                <div className="stat-value text-primary">{posts.length}</div>
                <div className="stat-desc">and growing</div>
              </div>
              <div className="stat">
                <div className="stat-title">Reviewed</div>
                <div className="stat-value text-secondary">{reviewedCount}</div>
                <div className="stat-desc">ready to explore</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14" aria-labelledby="library-heading">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Knowledge library
              </p>
              <h2 id="library-heading" className="mt-1 text-3xl font-black tracking-tight">
                {normalizedQuery ? "Search results" : "Recently shared"}
              </h2>
            </div>
            <p className="text-sm text-base-content/60">
              Showing {visiblePosts.length} of {filteredPosts.length}
            </p>
          </div>

          {visiblePosts.length > 0
            ? (
              <ul className="grid list-none gap-5 p-0 md:grid-cols-2 xl:grid-cols-3">
                {visiblePosts.map((post) => (
                  <li key={post.slug} className="h-full">
                    <article className="card relative h-full border border-base-300 bg-base-100 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                      <div className="card-body gap-4 p-6">
                        <div className="flex items-center justify-between gap-3">
                          <span className={`badge badge-sm capitalize ${statusClass(post.reviewStatus)}`}>
                            {statusLabel(post.reviewStatus)}
                          </span>
                          <time className="text-xs font-medium text-base-content/50">
                            {post.sourceSharedAt.slice(0, 10)}
                          </time>
                        </div>
                        <h3 className="card-title line-clamp-3 items-start text-lg leading-snug">
                          <a
                            href={`/posts/${post.slug}`}
                            className="after:absolute after:inset-0"
                          >
                            {post.title}
                          </a>
                        </h3>
                        <div className="card-actions mt-auto items-center justify-between pt-2 text-sm font-semibold text-primary">
                          <span>Read article</span>
                          <span className="grid size-8 place-items-center rounded-full bg-primary/10" aria-hidden="true">
                            →
                          </span>
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )
            : (
              <div className="hero min-h-72 rounded-3xl border border-dashed border-base-300 bg-base-100">
                <div className="hero-content text-center">
                  <div>
                    <div className="mb-4 text-5xl" aria-hidden="true">⌕</div>
                    <h3 className="text-2xl font-bold">No links found</h3>
                    <p className="mt-2 text-base-content/60">
                      Try another title or search for “reviewed”.
                    </p>
                    <button className="btn btn-primary mt-5" onClick={() => setQuery("")}>
                      Clear search
                    </button>
                  </div>
                </div>
              </div>
            )}

          {visiblePosts.length < filteredPosts.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                className="btn btn-primary btn-wide rounded-full shadow-md"
                onClick={() => setLimit((current) => current + PAGE_SIZE)}
              >
                Load more posts
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-base-300 bg-base-100">
        <div className="footer mx-auto max-w-7xl items-center px-6 py-8 text-base-content/60 sm:footer-horizontal">
          <aside>
            <p className="font-semibold text-base-content">Ubuntu TechHive Link Curation</p>
            <p>Community knowledge, preserved and searchable.</p>
          </aside>
          <nav className="grid-flow-col gap-4 sm:place-self-center sm:justify-self-end">
            <a className="link link-hover" href="https://ubuntuhive.tech">Ubuntu TechHive</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
