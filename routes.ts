// routes.ts
import { Hono } from "hono";
import { bot } from "./bot.ts";

const app = new Hono();

app.use("*", async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  await next();
});

app.get("/", async (c) => {
  const html = await Deno.readTextFile("index.html");
  return c.html(html);
});

app.get("/health", (c) => {
  return c.text("OK");
});

app.get("/assets/:path*", async (c) => {
  const path = c.req.param("path*");
  const file = await Deno.readTextFile(`assets/${path}`);
  const ext = path.split(".").pop();
  const contentType = ext === "css" ? "text/css" : ext === "js" ? "application/javascript" : "text/plain";
  return new Response(file, { headers: { "Content-Type": contentType } });
});

app.post("/webhook", async (c) => {
  try {
    const update = await c.req.json();
    console.log("Update received:", update);
    await bot.handleUpdate(update);
    return c.text("OK");
  } catch (err) {
    console.error("Error handling update:", err);
    return c.text("Error", { status: 500 });
  }
});

export default app;