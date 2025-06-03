// libs/mysql.ts
import mysql from "mysql2/promise";

declare global {
  // Esto extiende el objeto global para TypeScript
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

export async function connectDB() {
  if (global._mysqlPool) {
    return global._mysqlPool;
  }

  global._mysqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return global._mysqlPool;
}
