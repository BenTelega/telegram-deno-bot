// main.ts
import app from "./routes.ts";
import { bot } from "./bot.ts";

const PORT = Number(Deno.env.get("PORT")) || 3000;
const HOST = "0.0.0.0";
const WEBHOOK_URL = Deno.env.get("WEBHOOK_URL") || "";

if (WEBHOOK_URL) {
  try {
    await bot.api.setWebhook(WEBHOOK_URL + "/webhook");
    console.log(`Webhook set to: ${WEBHOOK_URL}/webhook`);
  } catch (e) {
    console.error("Failed to set webhook:", e);
  }
}

console.log(`🤖 Bot server running on http://${HOST}:${PORT}`);

Deno.serve({ port: PORT, hostname: HOST }, app.fetch);

Deno.addSignalListener("SIGINT", () => {
  console.log("\n🛑 Получен SIGINT, завершаем работу...");
  Deno.exit(0);
});

Deno.addSignalListener("SIGTERM", () => {
  console.log("\n🛑 Получен SIGTERM, завершаем работу...");
  Deno.exit(0);
});