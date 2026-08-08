import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { loadPosts } from "../lib/posts";

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

function Home() {
  const posts = Route.useLoaderData();

  return (
    <main className="shell">
      <header className="masthead">
        <p className="eyebrow">Ubuntu TechHive</p>
        <h1>Link Curation Blog</h1>
        <p className="lede">
          A searchable home for useful links, with every source preserved as a
          reviewable Markdown post.
        </p>
      </header>

      <ul className="post-list">
        {posts.map((post) => (
          <li className="post-card" key={post.slug}>
            <h2>
              <a href={`/posts/${post.slug}`}>{post.title}</a>
            </h2>
            <p className="post-meta">
              {post.sourceSharedAt.slice(0, 10)} · {post.reviewStatus}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
