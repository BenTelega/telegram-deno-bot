# AGENTS.md

## Команды

- `deno task start` — запуск бота
- `deno task dev` — запуск с горячей перезагрузкой
- `deno task lint` — линтинг
- `deno task fmt` — форматирование
- `deno task check` — проверка типов

## Переменные окружения

- `BOT_TOKEN` — токен Telegram бота
- `WEBHOOK_URL` — публичный URL для webhook
- `PORT` — порт сервера (по умолчанию 3000)

## Структура

- `main.ts` — точка входа, HTTP-сервер
- `bot.ts` — логика бота, обработчики

## Тесты

Тестов нет.

## Деплой

GitHub Actions автоматически деплоит на push в main через `docker compose up -d --build`.