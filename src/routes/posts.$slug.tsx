import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { findPost, renderMarkdown } from "../lib/posts";

const fetchPost = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    const post = findPost(slug);
    if (!post) throw notFound();
    return { ...post, html: renderMarkdown(post.body) };
  });

export const Route = createFileRoute("/posts/$slug")({
  loader: ({ params }) => fetchPost({ data: params.slug }),
  component: PostPage,
  notFoundComponent: () => (
    <main className="hero min-h-screen bg-base-200 px-4">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <p className="text-7xl font-black text-primary/20">404</p>
          <h1 className="mt-2 text-3xl font-black">Post not found</h1>
          <p className="mt-3 text-base-content/60">
            This link may have moved or is no longer in the collection.
          </p>
          <a className="btn btn-primary mt-6 rounded-full" href="/">
            Return to the library
          </a>
        </div>
      </div>
    </main>
  ),
});

function PostPage() {
  const post = Route.useLoaderData();
  const status = post.reviewStatus.replaceAll("-", " ");

  return (
    <div className="min-h-screen">
      <header className="border-b border-base-300 bg-base-100/90 backdrop-blur">
        <div className="navbar mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex-1 gap-3">
            <a
              href="/"
              className="grid size-10 place-items-center rounded-xl bg-primary font-black text-primary-content shadow-sm"
              aria-label="Ubuntu TechHive link library"
            >
              UH
            </a>
            <div>
              <a href="/" className="text-lg font-bold tracking-tight">
                Link Curation
              </a>
              <p className="text-xs text-base-content/60">Ubuntu TechHive</p>
            </div>
          </div>
          <a className="btn btn-ghost btn-sm rounded-full" href="/">
            <span aria-hidden="true">←</span>
            <span className="hidden sm:inline">All posts</span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="breadcrumbs mb-6 text-sm text-base-content/60">
          <ul>
            <li><a href="/">Library</a></li>
            <li className="max-w-64 truncate">{post.title}</li>
          </ul>
        </div>

        <article className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-xl shadow-base-content/5">
          <header className="border-b border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 px-6 py-10 sm:px-10 sm:py-14">
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge badge-primary badge-outline capitalize">
                {status}
              </span>
              <span className="text-sm text-base-content/55">
                {post.sourceSharedAt.slice(0, 10)}
              </span>
            </div>
            <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-base-content/65">
              <span className="flex items-center gap-2">
                <span className="avatar placeholder">
                  <span className="size-8 rounded-full bg-primary text-xs font-bold text-primary-content">
                    {post.sourceAuthor.slice(0, 2).toUpperCase() || "UH"}
                  </span>
                </span>
                Shared by {post.sourceAuthor || "Ubuntu TechHive"}
              </span>
              {post.sourceUrl && (
                <a
                  className="btn btn-primary btn-sm rounded-full"
                  href={post.sourceUrl}
                  rel="noopener noreferrer"
                >
                  Open original source
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </header>

          <div className="px-6 py-8 sm:px-10 sm:py-12">
            {post.reviewStatus === "needs-review" && (
              <div role="alert" className="alert alert-warning mb-8 items-start shadow-sm">
                <svg
                  aria-hidden="true"
                  className="size-6 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 9v4m0 4h.01" />
                  <path d="M10.3 3.7 2.4 17.3A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.7L13.7 3.7a2 2 0 0 0-3.4 0Z" />
                </svg>
                <div>
                  <h2 className="font-bold">Awaiting source review</h2>
                  <p className="text-sm opacity-80">
                    This entry preserves a community link preview and has not
                    yet completed editorial review.
                  </p>
                </div>
              </div>
            )}

            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>
        </article>

        <div className="mt-8 flex justify-center">
          <a className="btn btn-outline rounded-full" href="/">
            <span aria-hidden="true">←</span>
            Back to all curated links
          </a>
        </div>
      </main>
    </div>
  );
}
