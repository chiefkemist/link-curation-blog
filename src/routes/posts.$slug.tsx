import { notFound, createFileRoute } from "@tanstack/react-router";
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
    <main className="shell">
      <h1>Post not found</h1>
      <p><a href="/">Return to the index</a></p>
    </main>
  ),
});

function PostPage() {
  const post = Route.useLoaderData();

  return (
    <main className="shell">
      <p><a href="/">← All posts</a></p>
      <article className="post-body">
        <p className="eyebrow">Ubuntu TechHive · {post.reviewStatus}</p>
        <h1>{post.title}</h1>
        <p className="post-meta">
          Shared {post.sourceSharedAt.slice(0, 10)} by {post.sourceAuthor}
        </p>
        {post.reviewStatus === "needs-review" && (
          <p className="review-note">
            This post preserves a Discord link preview and is awaiting source
            review.
          </p>
        )}
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </main>
  );
}
