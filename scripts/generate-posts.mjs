import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const postsDirectory = resolve(root, "posts");
const output = resolve(root, "src/generated-posts.json");
const filenames = (await readdir(postsDirectory))
  .filter((filename) => filename.endsWith(".md"))
  .sort();

const posts = await Promise.all(
  filenames.map(async (filename) => ({
    slug: basename(filename, ".md"),
    markdown: await readFile(resolve(postsDirectory, filename), "utf8"),
  })),
);

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(posts)}\n`);
console.log(`Generated ${posts.length} posts in ${output}`);
