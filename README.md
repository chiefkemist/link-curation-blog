# Link Curation Blog

This is the minimal starting point for turning community-shared links into a researched, reviewable Markdown blog.

## Contents

- `index.tsx` — a dependency-free Deno Deploy entrypoint that serves the starter page.
- `posts/` — numbered, source-grounded Markdown posts imported from Discord. Each post keeps Discord provenance in frontmatter and embeds its original URL with `{{< source-link url="..." label="Read the original source" >}}`.
- `.github/workflows/deploy.yml` — validates the entrypoint and deploys it through the current Deno Deploy v2 API.

## Deploying

The repository is connected to the Deno Deploy app with the slug `link-curation-blog`.

Add a GitHub Actions repository secret named `DENO_DEPLOY_TOKEN` containing an organization-scoped Deno Deploy v2 token. Pushes to `main` then run formatting and type checks before submitting the source to Deno Deploy.

The workflow sends the token only to the deployment request. No credential is stored in the repository or in the application source.

## Local check

With Deno installed:

```sh
deno fmt --check index.tsx
deno check index.tsx
```
