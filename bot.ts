// bot.ts
import { Bot } from "https://deno.land/x/grammy@v1.23.1/mod.ts";

interface BotConfig {
  token: string;
  webhookUrl: string;
}

const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
const WEBHOOK_URL = Deno.env.get("WEBHOOK_URL");

if (!BOT_TOKEN) {
  throw new Error("❌ BOT_TOKEN не установлен в переменных окружения");
}
if (!WEBHOOK_URL) {
  throw new Error("❌ WEBHOOK_URL не установлен в переменных окружения");
}

const config: BotConfig = {
  token: BOT_TOKEN,
  webhookUrl: WEBHOOK_URL,
};

const bot = new Bot(config.token);

// Middleware для логирования
bot.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`⏱ [${ms}ms] Обработан апдейт от ${ctx.from?.id} (${ctx.from?.first_name})`);
});

bot.command("start", (ctx) => {
  ctx.reply(`Привет, ${ctx.from?.first_name}! Это вебхук-бот на Deno.`);
});

bot.command("help", (ctx) => {
  ctx.reply(`
🤖 Доступные команды:
/start - Запустить бота
/help - Показать эту справку
/echo <текст> - Эхо-сообщение
  `);
});

bot.command("echo", async (ctx) => {
  const text = ctx.message?.text?.split(" ").slice(1).join(" ");
  if (!text) {
    ctx.reply("Пожалуйста, укажите текст после команды /echo");
    return;
  }
  ctx.reply(text);
});

// Обработка текстовых сообщений с валидацией
bot.on("message:text", (ctx) => {
  const text = ctx.message.text;
  if (!text) {
    console.log("Получено сообщение без текста");
    return;
  }
  console.log("Получено сообщение:", text);
  ctx.reply(`Вы сказали: ${text}`);
});

// Обработка других типов сообщений
bot.on("message", (ctx) => {
  if (!ctx.message.text) {
    console.log("Получено нетекстовое сообщение:", ctx.message);
    ctx.reply("Я пока умею обрабатывать только текстовые сообщения!");
  }
});

// УБРАТЬ: await bot.api.setWebhook(`${WEBHOOK_URL}/webhook`);

export default {
  async fetch(request: Request): Promise<Response> {
    console.log("Method:", request.method);
    console.log("URL:", request.url);

    // Health check endpoint
    if (request.method === "GET" && new URL(request.url).pathname === "/health") {
      return new Response(
        JSON.stringify({ status: "ok", timestamp: Date.now() }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

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
