FROM denoland/deno:alpine-2.7.11

WORKDIR /app

# Копируем весь проект
COPY . .

# Кэшируем зависимости с необходимыми разрешениями
RUN deno cache --allow-net --allow-env --allow-read main.ts

EXPOSE 3000

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "main.ts"]

