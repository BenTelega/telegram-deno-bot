// middleware.ts
import { Context } from "https://deno.land/x/grammy@v1.23.1/mod.ts";
import { getUserByTelegramId, createUser, updateUser, User } from "./db.ts";

export interface SessionData {
  user: User | null;
  isNewUser: boolean;
}

// Middleware для регистрации и авторизации пользователей
export async function authMiddleware(ctx: Context, next: () => Promise<void>) {
  if (!ctx.from) {
    console.log("⚠️ Нет информации о пользователе");
    return await next();
  }

  const telegramId = ctx.from.id;
  const username = ctx.from.username;
  const firstName = ctx.from.first_name;
  const lastName = ctx.from.last_name;

  // Проверяем существует ли пользователь
  let user = getUserByTelegramId(telegramId);
  let isNewUser = false;

  if (!user) {
    // Регистрируем нового пользователя
    try {
      user = createUser(telegramId, username, firstName, lastName);
      isNewUser = true;
      console.log(`✅ Новый пользователь зарегистрирован: ${firstName} (${telegramId})`);
    } catch (error) {
      console.error(`❌ Ошибка регистрации пользователя ${telegramId}:`, error);
    }
  } else {
    // Обновляем информацию о пользователе если изменилась
    const needsUpdate = 
      user.username !== username ||
      user.first_name !== firstName ||
      user.last_name !== lastName;

    if (needsUpdate) {
      user = updateUser(telegramId, { username, firstName, lastName }) || user;
      console.log(`🔄 Данные пользователя обновлены: ${firstName} (${telegramId})`);
    }
  }

  // Добавляем информацию о пользователе в контекст
  (ctx as any).session = {
    user,
    isNewUser
  };

  if (isNewUser) {
    await ctx.reply(
      `🎉 Добро пожаловать, ${firstName}! Вы успешно зарегистрированы в системе.`
    );
  }

  await next();
}

// Middleware для проверки авторизации (только для зарегистрированных)
export async function requireAuth(ctx: Context, next: () => Promise<void>) {
  const session = (ctx as any).session as SessionData | undefined;

  if (!session?.user) {
    await ctx.reply("⛔ Доступ запрещен. Пожалуйста, сначала зарегистрируйтесь.");
    return;
  }

  await next();
}

// Middleware для логирования действий пользователей
export async function loggingMiddleware(ctx: Context, next: () => Promise<void>) {
  const user = (ctx as any).session?.user;
  const userId = user?.telegram_id || ctx.from?.id || "unknown";
  const message = ctx.message?.text || "no text";

  console.log(`📝 [${new Date().toISOString()}] User ${userId}: ${message}`);

  await next();
}

// Композитный middleware для использования в боте
export function setupMiddleware() {
  return [authMiddleware, loggingMiddleware];
}
