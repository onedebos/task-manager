import type { Clock } from "../clock.js";
import type {
  CreateTaskInput,
  Priority,
  Task,
} from "../models/task.model.js";
import type { TaskRepository } from "../repositories/task.repository.js";

export class TaskService {
  constructor(
    private readonly repository: TaskRepository,
    private readonly clock: Clock,
  ) {}

  /**
   * Create a task with a unique title, priority (HIGH, MEDIUM, or LOW),
   * and an optional due date.
   */
  createTask(input: CreateTaskInput): Task {
    throw new Error("Not implemented: createTask");
  }

  /**
   * Complete a task by title.
   */
  completeTask(title: string): Task {
    throw new Error("Not implemented: completeTask");
  }

  /**
   * List only PENDING tasks matching a given priority.
   */
  listPendingByPriority(priority: Priority): Task[] {
    throw new Error("Not implemented: listPendingByPriority");
  }

  /**
   * Return all PENDING tasks whose due date is before the current time.
   * Sort by priority (HIGH first), then by due date (earliest first).
   */
  listOverdueTasks(): Task[] {
    throw new Error("Not implemented: listOverdueTasks");
  }
}
