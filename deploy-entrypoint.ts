import freshServer from "./_fresh/server.js";

Deno.serve((request: Request) => freshServer.fetch(request));
