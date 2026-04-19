import { App, fsRoutes, staticFiles, trailingSlashes } from "fresh";
import { bot } from "./bot.ts";

const app = new App()
  .use(staticFiles())
  .use(trailingSlashes("never"));

await fsRoutes(app, {
  dir: "./",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

app.post("/webhook", async (req) => {
  try {
    const update = await req.json();
    console.log("Update received:", update);
    await bot.handleUpdate(update);
    return new Response("OK");
  } catch (err) {
    console.error("Error handling update:", err);
    return new Response("Error", { status: 500 });
  }
});

if (import.meta.main) {
  await app.listen();
}