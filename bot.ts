// bot.ts
import { Bot, type Context } from "https://deno.land/x/grammy/mod.ts";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "https://deno.land/x/grammy_conversations/mod.ts";

type MyContext = ConversationFlavor<Context>;
type MyConversation = Conversation<MyContext>;

const BOT_TOKEN = Deno.env.get("BOT_TOKEN")!;
export const bot = new Bot<MyContext>(BOT_TOKEN);

bot.use(conversations());

async function setupProfile(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply("Привет! Как вас зовть?");
  const { message } = await conversation.waitFor("message:text");
  const name = message.text;
  await ctx.reply(`Приятно познакомиться, ${name}! Сколько вам лет?`);

  const { message: ageMsg } = await conversation.waitFor("message:text");
  const age = ageMsg.text;
  await ctx.reply(`Отлично, ${name}! Вам ${age} лет. До свидания!`);
}

bot.use(createConversation(setupProfile));

const keyboardMenu = {
  inline_keyboard: [
    [{ text: "📱 Открыть приложение", web_app: { url: "https://tgbot.benetelega.ru" }, style: "primary" }],
    [{ text: "📜 Правила", url: "https://t.me/BenTelegaCore", style: "success" }],
  ],
};

bot.command("start", async (ctx) => {
  console.log("START command triggered");
  console.log("ctx.from:", ctx.from);
  ctx.reply(`Привет, ${ctx.from?.first_name}! Это вебхук-бот на Deno.`, {
    reply_markup: keyboardMenu,
  });
});

await bot.init();

bot.command("profile", async (ctx) => {
  await ctx.conversation.enter("setupProfile");
});

const keyboardBack = {
  inline_keyboard: [
    [{ text: "📱 Открыть приложение", web_app: { url: "https://tgbot.benetelega.ru" }, style: "primary" }],
    [{ text: "📜 Правила", url: "https://t.me/BenTelegaCore", style: "success" }],
    [{ text: "« Назад", callback_data: "back", style: "danger" }],
  ],
};

bot.callbackQuery("menu", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("✦ МЕНЮ\n\nВыберите действие:", {
    reply_markup: keyboardBack,
  });
});

bot.callbackQuery("fav", async (ctx) => {
  await ctx.answerCallbackQuery("Избранное пусто");
});

bot.callbackQuery("settings", async (ctx) => {
  await ctx.answerCallbackQuery("Настройки → Открыть Web App");
});

bot.callbackQuery("back", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("Привет! Бот работает.", {
    reply_markup: keyboardMenu,
  });
});

bot.on("message:text", (ctx) => {
  console.log("Получено сообщение:", ctx.message.text);
  ctx.reply(`Вы сказали: ${ctx.message.text}`, {
    reply_markup: keyboardMenu,
  });
});