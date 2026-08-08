import freshServer from "./_fresh/server.js";

Deno.serve({ port: 8000 }, async (request) => {
  const response = await freshServer.fetch(request);
  console.log(
    `${request.method} ${new URL(request.url).pathname} ${response.status}`,
  );
  return response;
});
