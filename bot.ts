// bot.ts
import { Bot } from "https://deno.land/x/grammy@v1.23.1/mod.ts";
import { authMiddleware, loggingMiddleware, requireAuth } from "./middleware.ts";

const BOT_TOKEN = Deno.env.get("BOT_TOKEN")!;
const bot = new Bot(BOT_TOKEN);

await bot.init(); // ← await на верхнем уровне, но после проверки токена

// Подключаем middleware
bot.use(authMiddleware);
bot.use(loggingMiddleware);

bot.command("start", (ctx) => {
  const session = (ctx as any).session;
  ctx.reply(`Привет, ${ctx.from?.first_name}! Это вебхук-бот на Deno с SQLite базой.`);
});

bot.command("profile", requireAuth, (ctx) => {
  const session = (ctx as any).session;
  const user = session.user;
  
  if (!user) {
    ctx.reply("❌ Пользователь не найден");
    return;
  }
  
  ctx.reply(
    `📋 Ваш профиль:\n` +
    `ID: ${user.id}\n` +
    `Telegram ID: ${user.telegram_id}\n` +
    `Имя: ${user.first_name || "не указано"}\n` +
    `Фамилия: ${user.last_name || "не указано"}\n` +
    `Username: @${user.username || "не указан"}\n` +
    `Зарегистрирован: ${user.created_at}`
  );
});

bot.command("me", requireAuth, (ctx) => {
  const session = (ctx as any).session;
  ctx.reply(`Вы вошли как ${session.user?.first_name}`);
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
