// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import handler from "./bot.ts";

const PORT = Number(Deno.env.get("PORT")) || 3000;
const HOST = "0.0.0.0";

console.log(`🤖 Bot server running on http://${HOST}:${PORT}`);

// Запускаем HTTP-сервер
const server = serve(handler.fetch.bind(handler), { port: PORT, hostname: HOST });

// Graceful shutdown
for (const signal of ["SIGINT", "SIGTERM"]) {
  Deno.addSignalListener(signal, () => {
    console.log(`\n🛑 Получен сигнал ${signal}, завершаем работу...`);
    server.shutdown();
    Deno.exit(0);
  });
}
