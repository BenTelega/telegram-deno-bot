# Telegram Webhook Bot на Deno

Telegram бот, написанный на **Deno** с использованием фреймворка **grammY**. Бот работает через webhook и поддерживает запуск в Docker-контейнере.

## 📋 Возможности

- Обработка команды `/start`
- Эхо-ответы на все текстовые сообщения
- Работа через webhook (HTTP-сервер)
- Поддержка Docker и docker-compose
- Health check для мониторинга состояния

## 🚀 Быстрый старт

### Требования

- [Deno](https://deno.land/) v1.40+ ИЛИ
- [Docker](https://www.docker.com/) и [Docker Compose](https://docs.docker.com/compose/)

### Запуск без Docker

1. Установите переменные окружения:
```bash
export BOT_TOKEN="ваш_токен_бота"
export WEBHOOK_URL="https://ваш-домен.ru"
export PORT=3000
```

2. Запустите бота:
```bash
deno task start
```

Или напрямую:
```bash
deno run --allow-net --allow-env --allow-read main.ts
```

### Запуск через Docker Compose

1. Создайте файл `.env` с вашими переменными:
```env
BOT_TOKEN=ваш_токен_бота
WEBHOOK_URL=https://ваш-домен.ru
```

2. Запустите контейнер:
```bash
docker-compose up -d
```

3. Проверьте логи:
```bash
docker-compose logs -f deno-bot
```

## ⚙️ Настройка

### Переменные окружения

| Переменная | Описание | Пример |
|------------|----------|--------|
| `BOT_TOKEN` | Токен вашего Telegram бота (получить у [@BotFather](https://t.me/BotFather)) | `123456789:ABCdefGHIjklMNOpqrsTUVwxyz` |
| `WEBHOOK_URL` | Публичный URL вашего сервера для webhook | `https://tgbot.example.ru` |
| `PORT` | Порт HTTP-сервера (по умолчанию 3000) | `3000` |

### Настройка Webhook

После запуска бота необходимо зарегистрировать webhook в Telegram:

```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -d "url=<WEBHOOK_URL>/webhook"
```

Или через браузер откройте:
```
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=<WEBHOOK_URL>/webhook
```

## 📁 Структура проекта

```
.
├── main.ts           # Точка входа, HTTP-сервер
├── bot.ts            # Логика бота, обработчики команд
├── deno.json         # Конфигурация Deno, задачи
├── Dockerfile        # Образ Docker
├── docker-compose.yml # Оркестрация Docker
├── .gitignore        # Игнорируемые файлы Git
└── README.md         # Документация
```

## 🔧 Разработка

### Локальный запуск с горячей перезагрузкой

```bash
deno run --watch --allow-net --allow-env --allow-read main.ts
```

### Проверка кода

```bash
deno fmt --check
deno lint
```

## 🐳 Docker

### Сборка образа вручную

```bash
docker build -t telegram-deno-bot .
```

### Запуск контейнера

```bash
docker run -d \
  -p 3000:3000 \
  -e BOT_TOKEN=ваш_токен \
  -e WEBHOOK_URL=https://ваш-домен.ru \
  --name telegram-bot \
  telegram-deno-bot
```

## 📝 Команды бота

- `/start` — Приветственное сообщение

## 🔍 Мониторинг

### Проверка статуса webhook

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

### Health check

Контейнер имеет встроенный health check, который проверяет доступность сервера:

```bash
docker inspect --format='{{.State.Health.Status}}' <container_id>
```

## 🛠️ Технологии

- **[Deno](https://deno.land/)** — Современная среда выполнения JavaScript/TypeScript
- **[grammY](https://grammy.dev/)** — Фреймворк для создания Telegram ботов
- **[Docker](https://www.docker.com/)** — Контейнеризация приложения

## 📄 Лицензия

MIT

## 🤝 Вклад в проект

Pull requests приветствуются! Для основных изменений сначала создайте issue для обсуждения.

## 📞 Контакты

Если у вас возникли вопросы или проблемы, создайте issue в этом репозитории.
