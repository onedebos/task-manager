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
