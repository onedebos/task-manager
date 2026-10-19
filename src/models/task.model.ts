export const priority = {
  high: "HIGH",
  medium: "MEDIUM",
  low: "LOW",
} as const;

export type Priority = (typeof priority)[keyof typeof priority];

export const status = {
  pending: "PENDING",
  completed: "COMPLETED",
} as const;

export type TaskStatus = (typeof status)[keyof typeof status];

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
