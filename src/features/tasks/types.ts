export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";
export type TaskType = "task" | "bug" | "feature";

export interface Task {
  id: string;
  title: string;
  description: string;
  taskStatus: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  labels: string[];
  comments: string[];
  type: TaskType;
  storyPoints: number;
}
// src/features/tasks/types.ts
export interface ITask {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  type: "FEATURE" | "BUG" | "TASK" | "DOCUMENTATION";
}

export interface ICreateTaskPayload {
  title: string;
  description: string;
  status: string;
  priority: string;
  type: string;
  projectId: string;
}
