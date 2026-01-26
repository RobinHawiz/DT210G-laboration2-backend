import { diContainer } from "@fastify/awilix";
import { TodoEntity, TodoPayload } from "@models/todo.js";
import { DomainError } from "@errors/domainError.js";
import { TodoRepository } from "@repositories/todo.js";

export interface TodoService {
  // Returns all todos
  getAllTodos(): Array<TodoEntity>;
  // Returns one todo or throws DomainError("Todo not found")
  getOneTodo(id: string): TodoEntity;
  // Inserts and returns a new id
  insertTodo(todoPayload: TodoPayload): number | bigint;
  // Deletes if exists. Otherwise throws DomainError("Todo not found")
  deleteTodo(id: string): void;
  // Changes todo status. Otherwise throws DomainError("Todo not found")
  changeTodoStatus(id: string, status: string): void;
}

export class DefaultTodoService implements TodoService {
  private readonly repo: TodoRepository;

  constructor() {
    this.repo = diContainer.resolve("todoRepo");
  }

  getAllTodos() {
    return this.repo.findAllTodos();
  }

  getOneTodo(id: string) {
    const todo = this.repo.findOneTodo(id);

    if (!todo) {
      throw new DomainError(`Todo not found`);
    }

    return todo;
  }

  insertTodo(payload: TodoPayload) {
    return this.repo.insertTodo(payload);
  }

  deleteTodo(id: string) {
    const changes = this.repo.deleteTodo(id);

    if (changes === 0) {
      throw new DomainError(`Todo not found`);
    }
  }

  changeTodoStatus(id: string, status: string) {
    const todo = this.repo.findOneTodo(id);

    if (!todo) {
      throw new DomainError(`Todo not found`);
    }

    this.repo.changeTodoStatus(id, status);
  }
}
