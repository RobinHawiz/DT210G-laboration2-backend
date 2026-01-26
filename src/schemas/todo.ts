import { JSONSchemaType } from "ajv";
import { Status, TodoPayload } from "@models/todo.js";

/**
 * Params validation schema for routes with `:id`.
 *
 * - `id`: positive number
 * - Path params are strings but Ajv by default coerces to number,
 * so handlers can safely use `id: number`.
 *
 */
export const todoIdParamSchema: JSONSchemaType<{ id: number }> = {
  type: "object",
  properties: {
    id: { type: "integer", minimum: 1 },
  },
  required: ["id"],
};

/**
 * Validation schema for todo payload (create)
 *
 * Validates the request body to ensure required fields are present and formatted correctly.
 *
 * - `title`: string, minimum 3 characters, max 100 characters
 * - `status`: string, accepted values: `NOT_STARTED`, `IN_PROGRESS` or `COMPLETED`
 */
export const todoPayloadSchema: JSONSchemaType<TodoPayload> = {
  type: "object",
  properties: {
    title: { type: "string", maxLength: 100, minLength: 1 },
    status: {
      type: "string",
      enum: [Status.NotStarted, Status.InProgress, Status.Completed],
    },
  },
  required: ["title", "status"],
  additionalProperties: false,
};

/**
 * Validation schema for changing todo status.
 *
 * - `status`: enum, accepted values: `NOT_STARTED`, `IN_PROGRESS` or `COMPLETED`
 */
export const todoChangeStatusSchema: JSONSchemaType<{ status: string }> = {
  type: "object",
  properties: {
    status: {
      type: "string",
      enum: [Status.NotStarted, Status.InProgress, Status.Completed],
    },
  },
  required: ["status"],
  additionalProperties: false,
};
