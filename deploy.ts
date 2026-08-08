import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

// Nitro resolves generated public assets from the output directory at runtime.
Deno.chdir(join(projectRoot, ".output"));

await import("./.output/server/index.ts");
