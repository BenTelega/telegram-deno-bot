FROM denoland/deno:alpine-2.7.11

WORKDIR /app

# Копируем весь проект
COPY . .

EXPOSE 3000

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--allow-import", "main.ts"]

