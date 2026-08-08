import { CSS } from "@deno/gfm";
import { findPost, loadPosts, renderMarkdown } from "../../lib/posts.ts";

export default async function PostPage(
  context: { params: { slug: string } },
) {
  const post = findPost(await loadPosts(), context.params.slug);
  if (!post) {
    return (
      <main class="shell">
        <h1>Post not found</h1>
        <p>
          <a href="/">Return to the index</a>
        </p>
      </main>
    );
  }

  return (
    <main class="shell">
      <p>
        <a href="/">← All posts</a>
      </p>
      <article class="post-body">
        <p class="eyebrow">Ubuntu TechHive · {post.reviewStatus}</p>
        <h1>{post.title}</h1>
        <p class="post-meta">
          Shared {post.sourceSharedAt.slice(0, 10)} by {post.sourceAuthor}
        </p>
        {post.reviewStatus === "needs-review" && (
          <p class="review-note">
            This post preserves a Discord link preview and is awaiting source
            review.
          </p>
        )}
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div
          class="markdown-body"
          data-color-mode="light"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
        />
      </article>
    </main>
  );
}
