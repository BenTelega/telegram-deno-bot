// bot.ts
import { Bot } from "grammy";

const BOT_TOKEN = Deno.env.get("BOT_TOKEN")!;
export const bot = new Bot(BOT_TOKEN);

await bot.init();

bot.command("start", (ctx) => {
  ctx.reply(`Привет, ${ctx.from?.first_name}! Это вебхук-бот на Deno.`);
});

bot.on("message", (ctx) => {
  console.log("Получено сообщение:", ctx.message.text);
  ctx.reply(`Вы сказали: ${ctx.message.text}`);
});