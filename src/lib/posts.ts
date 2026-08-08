import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import generatedPosts from "../generated-posts.json";

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
  if (!match) throw new Error(`Missing frontmatter in ${slug}`);

  const frontmatter: Frontmatter = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    frontmatter[line.slice(0, separator).trim()] = parseValue(
      line.slice(separator + 1).trim(),
    );
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

const posts = generatedPosts
  .map(({ slug, markdown }) => parsePost(markdown, slug))
  .sort((a, b) => b.sourceSharedAt.localeCompare(a.sourceSharedAt));

export function loadPosts(): Post[] {
  return posts;
}

export function findPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function renderMarkdown(markdown: string): string {
  const withSourceLinks = markdown.replace(
    /^\{\{< source-link url="(https?:\/\/[^"\s]+)" label="([^"]+)" >\}\}$/gm,
    "[$2]($1)",
  );

  return sanitizeHtml(String(marked.parse(withSourceLinks)), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),
    },
  });
}
