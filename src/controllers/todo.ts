import { diContainer } from "@fastify/awilix";
import { FastifyReply, FastifyRequest } from "fastify";
import { TodoPayload } from "@models/todo.js";
import { DomainError } from "@errors/domainError.js";
import { TodoService } from "@services/todo.js";

export interface TodoController {
  /** GET /api/todos → 200 */
  getAllTodos(reply: FastifyReply): void;
  /** GET /api/todos/:id → 200, 400 bad request, 500 internal server error */
  getOneTodo(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): void;
  /** POST /api/todos → 201, 400 bad request, 500 internal server error */
  insertTodo(
    request: FastifyRequest<{ Body: TodoPayload }>,
    reply: FastifyReply,
  ): void;
  /** DELETE /api/todos/:id → 204, 400 bad request, 500 internal server error */
  deleteTodo(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): void;
  /** PATCH /api/todos/:id → 204, 400 bad request, 500 internal server error */
  changeTodoStatus(
    request: FastifyRequest<{
      Params: { id: string };
      Body: { status: string };
    }>,
    reply: FastifyReply,
  ): void;
}

export class DefaultTodoController implements TodoController {
  private readonly service: TodoService;

  constructor() {
    this.service = diContainer.resolve("todoService");
  }

  getAllTodos(reply: FastifyReply) {
    try {
      const todos = this.service.getAllTodos();
      reply.send(todos);
    } catch (err) {
      console.error("Error retrieving todo data:", err);
      reply.code(500).send({ ok: false });
    }
  }

  getOneTodo(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      const todo = this.service.getOneTodo(id);
      reply.code(200).send(todo);
    } catch (err) {
      if (err instanceof DomainError) {
        console.error("Error retrieving todo data:", err.message);
        reply.code(400).send({ message: err.message });
      } else {
        console.error("Error retrieving todo data:", err);
        reply.code(500).send({ ok: false });
      }
    }
  }

  insertTodo(
    request: FastifyRequest<{ Body: TodoPayload }>,
    reply: FastifyReply,
  ) {
    try {
      const id = this.service.insertTodo(request.body);
      reply.code(201).header("Location", `/api/todos/${id}`).send();
    } catch (err) {
      if (err instanceof DomainError) {
        console.error("Error inserting todo data:", err.message);
        reply.code(400).send({ message: err.message });
      } else {
        console.error("Error inserting todo data:", err);
        reply.code(500).send({ ok: false });
      }
    }
  }

  deleteTodo(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      this.service.deleteTodo(id);
      reply.code(204).send();
    } catch (err) {
      if (err instanceof DomainError) {
        console.error("Error deleting todo data:", err.message);
        reply.code(400).send({ message: err.message });
      } else {
        console.error("Error deleting todo data:", err);
        reply.code(500).send({ ok: false });
      }
    }
  }

  changeTodoStatus(
    request: FastifyRequest<{
      Params: { id: string };
      Body: { status: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      const { status } = request.body;
      this.service.changeTodoStatus(id, status);
      reply.code(204).send();
    } catch (err) {
      if (err instanceof DomainError) {
        console.error("Error changing todo status:", err.message);
        reply.code(400).send({ message: err.message });
      } else {
        console.error("Error changing todo status:", err);
        reply.code(500).send({ ok: false });
      }
    }
  }
}
