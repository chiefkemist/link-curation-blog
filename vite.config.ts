import { defineConfig, type Plugin } from "vite";
import { fresh } from "@fresh/plugin-vite";

export default defineConfig({
  plugins: [markdownRaw(), fresh()],
});

function markdownRaw(): Plugin {
  return {
    name: "blog:markdown-raw",
    enforce: "pre",
    async load(id) {
      const [path] = id.split("?", 1);
      if (!path.endsWith(".md")) {
        return null;
      }

      const markdown = await Deno.readTextFile(path);
      return `export default ${JSON.stringify(markdown)};`;
    },
  };
}
