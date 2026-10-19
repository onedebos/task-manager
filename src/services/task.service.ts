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

  createTask(input: CreateTaskInput): Task {
    throw new Error("Not implemented: createTask");
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
