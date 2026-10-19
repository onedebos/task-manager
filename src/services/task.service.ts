import type { Clock } from "../clock.js";
import {
  priority,
  status,
  type CreateTaskInput,
  type Priority,
  type Task,
} from "../models/task.model.js";
import {
  normalizeTitle,
  type TaskRepository,
} from "../repositories/task.repository.js";

const PRIORITIES: readonly Priority[] = [
  priority.high,
  priority.medium,
  priority.low,
];

export class TaskService {
  constructor(
    private readonly repository: TaskRepository,
    private readonly clock: Clock,
  ) {}

  createTask(input: CreateTaskInput): Task {
    const lookupKey = normalizeTitle(input.title);
    const title = input.title.replace(/^ +/, "").replace(/ +$/, "");

    if (lookupKey.replace(/[\t\n\r ]/g, "") === "") {
      throw new Error("Task title is required");
    }

    if (!PRIORITIES.includes(input.priority)) {
      throw new Error("Priority must be HIGH, MEDIUM, or LOW");
    }

    if (
      input.dueDate !== undefined &&
      Number.isNaN(input.dueDate.getTime())
    ) {
      throw new Error("Due date is invalid");
    }

    if (this.repository.findByTitle(lookupKey) !== undefined) {
      throw new Error("Task title already exists");
    }

    const task: Task = {
      title,
      priority: input.priority,
      status: status.pending,
    };

    if (input.dueDate !== undefined) {
      task.dueDate = new Date(input.dueDate.getTime());
    }

    this.repository.save(task);
    return task;
  }

  completeTask(title: string): Task {
    const existing = this.repository.findByTitle(title);

    if (existing === undefined) {
      throw new Error("Task not found");
    }

    if (existing.status === status.completed) {
      throw new Error("Task is already completed");
    }

    const completed: Task = {
      title: existing.title,
      priority: existing.priority,
      status: status.completed,
    };

    if (existing.dueDate !== undefined) {
      completed.dueDate = new Date(existing.dueDate.getTime());
    }

    this.repository.save(completed);
    return completed;
  }

  listPendingByPriority(priority: Priority): Task[] {
    throw new Error("Not implemented: listPendingByPriority");
  }

  listOverdueTasks(): Task[] {
    throw new Error("Not implemented: listOverdueTasks");
  }
}
