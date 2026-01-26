import "@config/env.js"; // Load environment variables
import { diContainer } from "@fastify/awilix"; // DI
import * as awilix from "awilix"; // DI
import Fastify from "fastify";
import cors from "@fastify/cors";
import connectToSQLiteDb from "@config/db.js";
import { DefaultTodoRoutes } from "@routes/todo.js";
import { DefaultTodoController } from "@controllers/todo.js";
import { DefaultTodoService } from "@services/todo.js";
import { SQLiteTodoRepository } from "@repositories/todo.js";

// Bootstraps Fastify, registers DI, mounts routes.
export default async function build() {
  // Instantiate and configure the framework
  const app = Fastify({
    logger: true,
  });

  // Configure CORS origin
  app.register(cors, {
    origin: process.env.CORS_ORIGINS ?? "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    exposedHeaders: ["Location"],
  });

  // DI setup
  diContainer.register({
    db: awilix
      .asFunction(connectToSQLiteDb)
      .singleton()
      .disposer((db) => db.close()),
    todoController: awilix.asClass(DefaultTodoController).singleton(),
    todoService: awilix.asClass(DefaultTodoService).singleton(),
    todoRepo: awilix.asClass(SQLiteTodoRepository).singleton(),
  });

  // Mount routes
  const todoRoutes = new DefaultTodoRoutes();

  todoRoutes.initRoutes(app);

  return app;
}
