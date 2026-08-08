# Link Curation Blog

TanStack Start application for rendering the Markdown links curated by the
Ubuntu TechHive community.

## Stack

- TanStack Start and TanStack Router provide full-document React SSR and routing.
- Nitro produces the production server consumed by Deno Deploy.
- `marked` renders Markdown and `sanitize-html` sanitizes the generated HTML.
- `scripts/generate-posts.mjs` compiles the Markdown corpus into one generated
  JSON asset before the application build.

## Development

```sh
npm install
npm run generate
npm run dev
```

## Production verification

```sh
npm run generate
npm run build
npm start
```

The generated production server listens on port 3000 by default. GitHub Actions
checks both the home page and a rendered post before and after deploying to Deno
Deploy.
