import { diContainer } from "@fastify/awilix";
import { FastifyInstance } from "fastify";
import {
  todoIdParamSchema,
  todoPayloadSchema,
  todoChangeStatusSchema,
} from "@schemas/todo.js";
import { TodoPayload } from "@models/todo.js";
import { TodoController } from "@controllers/todo.js";

export interface TodoRoutes {
  initRoutes(app: FastifyInstance): void;
}

export class DefaultTodoRoutes implements TodoRoutes {
  private readonly controller: TodoController;

  constructor() {
    this.controller = diContainer.resolve("todoController");
  }

  initRoutes(app: FastifyInstance) {
    // Fetches all available todos
    app.get("/api/todos", (_, reply) => {
      this.controller.getAllTodos(reply);
    });

    // Fetches one todo by a given id after validating the query parameter
    app.get<{ Params: { id: string } }>(
      "/api/todos/:id",
      {
        schema: {
          params: todoIdParamSchema,
        },
      },
      (request, reply) => {
        this.controller.getOneTodo(request, reply);
      },
    );

    // Inserts a todo after validating the request body
    app.post<{ Body: TodoPayload }>(
      "/api/todos",
      {
        schema: {
          body: todoPayloadSchema,
        },
      },
      (request, reply) => {
        this.controller.insertTodo(request, reply);
      },
    );

    // Deletes an existing todo after validating the query parameter
    app.delete<{ Params: { id: string } }>(
      "/api/todos/:id",
      {
        schema: {
          params: todoIdParamSchema,
        },
      },
      (request, reply) => {
        this.controller.deleteTodo(request, reply);
      },
    );

    // Change an existing todo status after validating the query parameter and request body
    app.patch<{ Params: { id: string }; Body: { status: string } }>(
      "/api/todos/:id",
      {
        schema: {
          params: todoIdParamSchema,
          body: todoChangeStatusSchema,
        },
      },
      (request, reply) => {
        this.controller.changeTodoStatus(request, reply);
      },
    );
  }
}
