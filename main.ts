// main.ts
import handler from "./bot.ts";

const PORT = Number(Deno.env.get("PORT")) || 3000;
const HOST = "0.0.0.0";

console.log(`🤖 Bot server running on http://${HOST}:${PORT}`);

Deno.serve({ port: PORT, hostname: HOST }, handler.fetch);

Deno.addSignalListener("SIGINT", () => {
  console.log("\n🛑 Получен SIGINT, завершаем работу...");
  Deno.exit(0);
});

Deno.addSignalListener("SIGTERM", () => {
  console.log("\n🛑 Получен SIGTERM, завершаем работу...");
  Deno.exit(0);
});