# Link Curation Blog

Fresh 2 application for rendering the Markdown posts collected from the Ubuntu TechHive Discord channel.

## Structure

- routes/ contains the Fresh index and individual post routes.
- lib/posts.ts parses frontmatter, renders the supported Markdown subset, and expands source-link shortcodes.
- posts/ contains the 1,141 imported Markdown posts with Discord provenance.
- assets/styles.css contains the site stylesheet loaded by the Fresh Vite client entrypoint.

## Local development

Install dependencies and build:

    deno install
    deno task build

Start the production server:

    deno task start

Start Vite development mode:

    deno task dev

Fresh 2 uses Vite for development and production builds. The build output is written to _fresh/ and the deployment workflow packages that server plus the posts and static assets.
