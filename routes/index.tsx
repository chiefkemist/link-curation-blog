import { loadPosts } from "../lib/posts.ts";

export default async function Home() {
  const posts = await loadPosts();

  return (
    <main class="shell">
      <header class="masthead">
        <p class="eyebrow">Ubuntu TechHive</p>
        <h1>Link Curation Blog</h1>
        <p class="lede">
          A searchable home for useful links, with every source preserved as a
          reviewable Markdown post.
        </p>
      </header>

      <ul class="post-list">
        {posts.map((post) => (
          <li class="post-card">
            <h2>
              <a href={"/posts/" + post.slug}>{post.title}</a>
            </h2>
            <p class="post-meta">
              {post.sourceSharedAt.slice(0, 10)} · {post.reviewStatus}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
