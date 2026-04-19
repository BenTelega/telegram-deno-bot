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

## Структура (Fresh 2.x)

- `main.ts` — точка входа Fresh
- `client.ts` — клиентский вход (CSS импорты)
- `vite.config.ts` — конфиг Vite + Tailwind
- `routes/` — страницы и API (/, /health, /webhook)
- `bot.ts` — логика Telegram бота
- `public/assets/` — статические файлы (CSS)

## Тесты

Тестов нет.

## Деплой

GitHub Actions автоматически деплоит на push в main через `docker compose up -d --build`.

## Workflow внедрения фич

1. Перед внедрением — задать наводящие вопросы
2. Сохранить план в `.md` файле (отдельный файл)
3. После согласия — внедрение по плану
4. Тестирование: `docker compose down && docker compose up -d --build`
5. Проверка, правки
6. Когда утверждено — поставить галочки в плане, закоммитить