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
- `routes.ts` — роуты Hono (/, /health, /webhook, /assets/*)
- `bot.ts` — логика бота, обработчики
- `index.html` — статический HTML
- `assets/` — статические файлы (CSS, JS)

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