import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outputRoot = path.resolve(".output");
const publicRoot = path.join(outputRoot, "public");
const serverEntry = path.join(outputRoot, "server", "index.ts");
const files = await readdir(publicRoot, { recursive: true, withFileTypes: true });
const assets = {};

for (const file of files) {
  if (!file.isFile()) continue;

  const absolutePath = path.join(file.parentPath, file.name);
  const publicPath = `/${path.relative(publicRoot, absolutePath).replaceAll(path.sep, "/")}`;
  assets[publicPath] = (await readFile(absolutePath)).toString("base64");
}

const originalReader = `function readAsset(id) {
\tconst path = "." + decodeURIComponent(new URL(\`../public\${id}\`, "file://").pathname);
\treturn Deno.readFile(path);
}`;
const embeddedReader = `var embeddedPublicAssets = ${JSON.stringify(assets)};
function readAsset(id) {
\tconst content = embeddedPublicAssets[id];
\tif (!content) throw new Error(\`Missing embedded public asset: \${id}\`);
\treturn Uint8Array.from(atob(content), (character) => character.charCodeAt(0));
}`;
const serverSource = await readFile(serverEntry, "utf8");

if (!serverSource.includes(originalReader)) {
  throw new Error("Nitro public asset reader was not found in the generated server");
}

await writeFile(serverEntry, serverSource.replace(originalReader, embeddedReader));
console.log(`Embedded ${Object.keys(assets).length} public assets into ${serverEntry}`);
