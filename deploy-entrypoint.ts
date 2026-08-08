import freshServer from "./_fresh/server.js";

Deno.serve({ port: 8000 }, freshServer.fetch);
