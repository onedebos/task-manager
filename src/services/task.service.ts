import type { Clock } from "../clock.js";
import type {
  CreateTaskInput,
  Priority,
  Task,
} from "../models/task.model.js";
import {
  normalizeTitle,
  type TaskRepository,
} from "../repositories/task.repository.js";

const PRIORITIES: readonly Priority[] = ["HIGH", "MEDIUM", "LOW"];

export class TaskService {
  constructor(
    private readonly repository: TaskRepository,
    private readonly clock: Clock,
  ) {}

  createTask(input: CreateTaskInput): Task {
    const title = normalizeTitle(input.title);

    if (title === "") {
      throw new Error("Task title is required");
    }

    if (/^[0-9]/.test(title)) {
      throw new Error("Task title must not start with a number");
    }

    if (!PRIORITIES.includes(input.priority)) {
      throw new Error("Priority must be HIGH, MEDIUM, or LOW");
    }

    if (this.repository.findByTitle(title) !== undefined) {
      throw new Error("Task title already exists");
    }

    const task: Task = {
      title,
      priority: input.priority,
      status: "PENDING",
    };

    if (input.dueDate !== undefined) {
      task.dueDate = new Date(input.dueDate.getTime());
    }

    this.repository.save(task);
    return task;
  }

  completeTask(title: string): Task {
    throw new Error("Not implemented: completeTask");
  }

  listPendingByPriority(priority: Priority): Task[] {
    throw new Error("Not implemented: listPendingByPriority");
  }

  listOverdueTasks(): Task[] {
    throw new Error("Not implemented: listOverdueTasks");
  }
}
