FROM denoland/deno:alpine-2.7.11

WORKDIR /app

# Копируем конфигурацию и кэшируем зависимости
COPY deno.json ./
RUN deno cache main.ts

# Копируем исходный код
COPY . .

# Финальное кэширование после копирования всех файлов
RUN deno cache main.ts

EXPOSE 3000

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "main.ts"]

