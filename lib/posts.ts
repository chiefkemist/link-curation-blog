export interface Post {
  slug: string;
  title: string;
  status: string;
  reviewStatus: string;
  tags: string[];
  sourceUrl: string;
  sourceSharedAt: string;
  sourceAuthor: string;
  body: string;
}

type Frontmatter = Record<string, string | string[]>;

function parseValue(value: string): string | string[] {
  if (value.startsWith('"') && value.endsWith('"')) {
    return JSON.parse(value) as string;
  }

  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  return value;
}

function parsePost(text: string, slug: string): Post {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Missing frontmatter in " + slug);
  }

  const frontmatter: Frontmatter = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    frontmatter[key] = parseValue(line.slice(separator + 1).trim());
  }

  return {
    slug,
    title: String(frontmatter.title ?? slug),
    status: String(frontmatter.status ?? "published"),
    reviewStatus: String(frontmatter.review_status ?? "reviewed"),
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    sourceUrl: String(frontmatter.source_url ?? ""),
    sourceSharedAt: String(frontmatter.source_shared_at ?? ""),
    sourceAuthor: String(frontmatter.source_author ?? ""),
    body: match[2].trim(),
  };
}

export async function loadPosts(): Promise<Post[]> {
  const posts: Post[] = [];

  for await (const entry of Deno.readDir("posts")) {
    if (!entry.isFile || !entry.name.endsWith(".md")) continue;
    const slug = entry.name.slice(0, -3);
    const text = await Deno.readTextFile("posts/" + entry.name);
    posts.push(parsePost(text, slug));
  }

  return posts.sort((a, b) => b.sourceSharedAt.localeCompare(a.sourceSharedAt));
}

export function findPost(posts: Post[], slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderSourceLink(line: string): string | undefined {
  const match = line.match(
    /^\{\{< source-link url="([^"]+)" label="([^"]+)" >\}\}$/,
  );
  if (!match || !/^https?:\/\//.test(match[1])) return undefined;
  return '<p><a href="' + escapeHtml(match[1]) +
    '" rel="noreferrer" target="_blank">' +
    escapeHtml(match[2]) + "</a></p>";
}

export function renderMarkdown(markdown: string): string {
  const html: string[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html.push("<p>" + paragraph.map(escapeHtml).join("<br />") + "</p>");
    paragraph = [];
  };

  for (const line of markdown.split("\n")) {
    const sourceLink = renderSourceLink(line.trim());
    if (sourceLink) {
      flushParagraph();
      html.push(sourceLink);
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      const level = heading[1].length;
      html.push(
        "<h" + level + ">" + escapeHtml(heading[2]) + "</h" + level + ">",
      );
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return html.join("\n");
}
