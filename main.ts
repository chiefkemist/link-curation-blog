import { App, staticFiles } from "fresh";
import Home from "./routes/index.tsx";
import PostPage from "./routes/posts/[slug].tsx";

export const app = new App();

app.use(staticFiles());
app.get("/", async (ctx) => ctx.render(await Home()));
app.get("/posts/:slug", async (ctx) => {
  return ctx.render(await PostPage({ params: { slug: ctx.params.slug } }));
});
