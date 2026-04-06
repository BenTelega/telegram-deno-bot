// bot.ts
import { Bot } from "https://deno.land/x/grammy@v1.23.1/mod.ts";

const BOT_TOKEN = Deno.env.get("BOT_TOKEN")!;
const bot = new Bot(BOT_TOKEN);

await bot.init(); // ← await на верхнем уровне, но после проверки токена

bot.command("start", (ctx) => {
  ctx.reply(`Привет, ${ctx.from?.first_name}! Это вебхук-бот на Deno.`);
});

bot.on("message", (ctx) => {
  console.log("Получено сообщение:", ctx.message.text);
  ctx.reply(`Вы сказали: ${ctx.message.text}`);
});

export default {
  async fetch(request: Request): Promise<Response> {
    console.log("Method:", request.method);
    console.log("URL:", request.url);

    if (request.method === "POST" && new URL(request.url).pathname === "/webhook") {
      console.log("✅ Webhook route matched");
      try {
        const update = await request.json();
        console.log("Update received:", update);
        await bot.handleUpdate(update);
        return new Response("OK");
      } catch (err) {
        console.error("Error handling update:", err);
        return new Response("Error", { status: 500 });
      }
    }

    console.log("Default route hit");
    return new Response("Hello from Telegram Bot!");
  },
};
