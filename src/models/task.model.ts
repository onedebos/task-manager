export type Priority = "HIGH" | "MEDIUM" | "LOW";

export type TaskStatus = "PENDING" | "COMPLETED";

export interface Task {
  title: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: Date;
}

export interface CreateTaskInput {
  title: string;
  priority: Priority;
  dueDate?: Date;
}
