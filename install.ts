// Load environment variables
import "./src/config/env";

import DatabaseConstructor, { Database } from "better-sqlite3";

let db: Database | undefined;

try {
  // Connect to db
  const dbPath = process.env.DATABASE_INSTALL_PATH;
  if (!dbPath) {
    throw new Error("Failed to create db: Missing DATABASE in .env");
  }
  db = new DatabaseConstructor(dbPath);

  // Create table item
  db.exec("drop table if exists item;");

  db.exec(`CREATE TABLE todo(
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        status TEXT NOT NULL CHECK( status IN ('NOT_STARTED','IN_PROGRESS','COMPLETED'))
        );`);

  console.log("DB initialized at:", dbPath);
} catch (e) {
  console.error("---ERROR---");
  console.error(e instanceof Error ? e.message : e);
} finally {
  if (db) db.close();
}
