// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import handler from "./bot.ts"; // ← твой хендлер из bot.ts

const PORT = Number(Deno.env.get("PORT")) || 3000;
const HOST = "0.0.0.0"; // Важно: слушаем все интерфейсы для Docker

console.log(`🤖 Bot server running on http://${HOST}:${PORT}`);

// Запускаем HTTP-сервер и передаём ему твой fetch-хендлер
serve(handler.fetch.bind(handler), { port: PORT, hostname: HOST });
