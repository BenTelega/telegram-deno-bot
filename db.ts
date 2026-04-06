// db.ts
import { DB } from "https://deno.land/x/sqlite@v3.9.0/mod.ts";

const DB_PATH = "./data/users.db";

// Создаем директорию для базы данных если не существует
try {
  await Deno.mkdir("./data", { recursive: true });
} catch (e) {
  // Директория уже существует
}

export const db = new DB(DB_PATH);

// Создаем таблицу пользователей если не существует
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER UNIQUE NOT NULL,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Создаем индекс для быстрого поиска по telegram_id
db.query(`
  CREATE INDEX IF NOT EXISTS idx_telegram_id ON users(telegram_id)
`);

export interface User {
  id: number;
  telegram_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
}

export function createUser(telegramId: number, username?: string, firstName?: string, lastName?: string): User {
  try {
    db.query(
      `INSERT INTO users (telegram_id, username, first_name, last_name) 
       VALUES (?, ?, ?, ?)`,
      [telegramId, username || null, firstName || null, lastName || null]
    );
    
    const user = getUserByTelegramId(telegramId);
    if (!user) {
      throw new Error("Failed to create user");
    }
    return user;
  } catch (e) {
    if (e instanceof Error && e.message.includes("UNIQUE constraint failed")) {
      throw new Error("User already exists");
    }
    throw e;
  }
}

export function getUserByTelegramId(telegramId: number): User | null {
  const rows = db.query<[number, number, string | null, string | null, string | null, string, string]>(
    "SELECT * FROM users WHERE telegram_id = ?",
    [telegramId]
  );
  
  if (rows.length === 0) {
    return null;
  }
  
  const row = rows[0];
  return {
    id: row[0],
    telegram_id: row[1],
    username: row[2],
    first_name: row[3],
    last_name: row[4],
    created_at: row[5],
    updated_at: row[6]
  };
}

export function updateUser(telegramId: number, updates: { username?: string; firstName?: string; lastName?: string }): User | null {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];
  
  if (updates.username !== undefined) {
    fields.push("username = ?");
    values.push(updates.username || null);
  }
  if (updates.firstName !== undefined) {
    fields.push("first_name = ?");
    values.push(updates.firstName || null);
  }
  if (updates.lastName !== undefined) {
    fields.push("last_name = ?");
    values.push(updates.lastName || null);
  }
  
  if (fields.length === 0) {
    return getUserByTelegramId(telegramId);
  }
  
  fields.push("updated_at = CURRENT_TIMESTAMP");
  values.push(telegramId);
  
  db.query(
    `UPDATE users SET ${fields.join(", ")} WHERE telegram_id = ?`,
    values
  );
  
  return getUserByTelegramId(telegramId);
}

export function getAllUsers(): User[] {
  const query = db.query<[number, number, string | null, string | null, string | null, string, string]>(
    "SELECT * FROM users ORDER BY created_at DESC"
  );
  
  const users: User[] = [];
  for (const row of query) {
    users.push({
      id: row[0],
      telegram_id: row[1],
      username: row[2],
      first_name: row[3],
      last_name: row[4],
      created_at: row[5],
      updated_at: row[6]
    });
  }
  
  return users;
}

// Закрытие соединения при завершении работы
Deno.addSignalListener("SIGINT", () => {
  db.close();
});

Deno.addSignalListener("SIGTERM", () => {
  db.close();
});
