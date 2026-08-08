const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Link Curation Blog</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: system-ui, sans-serif;
        line-height: 1.5;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #101820;
        color: #f5f7fa;
      }

      main {
        max-width: 42rem;
        padding: 3rem 1.5rem;
      }

      h1 {
        margin-bottom: 0.5rem;
        font-size: clamp(2rem, 6vw, 4rem);
        line-height: 1.05;
      }

      p {
        color: #c9d3dc;
        font-size: 1.1rem;
      }

      .status {
        display: inline-block;
        margin-top: 1rem;
        padding: 0.4rem 0.7rem;
        border: 1px solid #4fd1c5;
        border-radius: 999px;
        color: #8ff5eb;
        font-size: 0.9rem;
      }
    </style>
  </head>
  <body>
    <main>
      <span class="status">Starter deployment</span>
      <h1>Link Curation Blog</h1>
      <p>
        A searchable home for useful links, with each source turned into a
        concise, reviewable Markdown post.
      </p>
    </main>
  </body>
</html>`;

Deno.serve(() =>
  new Response(page, {
    headers: { "content-type": "text/html; charset=utf-8" },
  })
);
