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
