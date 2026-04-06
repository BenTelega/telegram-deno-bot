FROM denoland/deno:alpine-2.7.11

WORKDIR /app

# Копируем всё сразу (без кэширования зависимостей)
COPY . .

# Запускаем напрямую, без кэша
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--allow-import", "main.ts"]

