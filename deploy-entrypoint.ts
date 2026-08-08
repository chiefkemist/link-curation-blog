import freshServer from "./_fresh/server.js";

Deno.serve(async (request) => {
  const response = await freshServer.fetch(request);
  console.log(
    `${request.method} ${new URL(request.url).pathname} ${response.status}`,
  );
  return response;
});
