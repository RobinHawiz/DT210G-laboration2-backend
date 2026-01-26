import { diContainer } from "@fastify/awilix";
import { Database } from "better-sqlite3";
import { TodoEntity, TodoPayload } from "@models/todo.js";

export interface TodoRepository {
  // Returns all todos
  findAllTodos(): Array<TodoEntity>;
  // Returns one todo
  findOneTodo(id: string): TodoEntity;
  // Inserts a todo and returns the id
  insertTodo(payload: TodoPayload): number | bigint;
  // Deletes a todo and returns affected rows
  deleteTodo(id: string): number;
  // Changes todo status
  changeTodoStatus(id: string, status: string): void;
}

export class SQLiteTodoRepository implements TodoRepository {
  private readonly db: Database;

  constructor() {
    this.db = diContainer.resolve("db");
  }

  findAllTodos() {
    return this.db
      .prepare(
        `select id, title, status
         from todo
         order by id DESC`,
      )
      .all() as Array<TodoEntity>;
  }

  findOneTodo(id: string) {
    return this.db
      .prepare(
        `select id, title, status
         from todo
         where id = @id`,
      )
      .get({ id }) as TodoEntity;
  }

  insertTodo(payload: TodoPayload) {
    return this.db
      .prepare(
        `insert into todo (title, status)
         values(@title, @status)`,
      )
      .run(payload).lastInsertRowid;
  }

  deleteTodo(id: string): number {
    return this.db.prepare(`delete from todo where id = @id`).run({ id })
      .changes;
  }

  changeTodoStatus(id: string, status: string) {
    return this.db
      .prepare(
        `update todo
         set status = @status
         where id = @id`,
      )
      .run({ id, status });
  }
}
