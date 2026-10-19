export const PRIORITY = {
  high: "HIGH",
  medium: "MEDIUM",
  low: "LOW",
} as const;

export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY];

export const STATUS = {
  pending: "PENDING",
  completed: "COMPLETED",
} as const;

export type TaskStatus = (typeof STATUS)[keyof typeof STATUS];

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
