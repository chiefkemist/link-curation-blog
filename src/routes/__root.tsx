import {
  HeadContent,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Link Curation Blog · Ubuntu TechHive" },
      {
        name: "description",
        content: "Useful links curated by the Ubuntu TechHive community.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="corporate">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-base-200 text-base-content antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
