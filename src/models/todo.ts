// Represents a single todo entry stored in the database
export type TodoEntity = {
  id: number;
  title: string;
  status: Status;
};

export type TodoPayload = Omit<TodoEntity, "id">;

export enum Status {
  NotStarted = "NOT_STARTED",
  InProgress = "IN_PROGRESS",
  Completed = "COMPLETED",
}
