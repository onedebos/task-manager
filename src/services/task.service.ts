import type { Clock } from "../clock.js";
import type {
  CreateTaskInput,
  Priority,
  Task,
} from "../models/task.model.js";
import type { TaskRepository } from "../repositories/task.repository.js";

/**
 * Business rules are documented in AGENTS.md and are intentionally not
 * implemented yet. Each method below is a placeholder for the interview.
 */
export class TaskService {
  constructor(
    private readonly repository: TaskRepository,
    private readonly clock: Clock,
  ) {}

  createTask(input: CreateTaskInput): Task {
    // TODO: Validate and create a PENDING task. See AGENTS.md.
    throw new Error("Not implemented: createTask");
  }

  completeTask(title: string): Task {
    // TODO: Mark an existing task COMPLETED. See AGENTS.md.
    throw new Error("Not implemented: completeTask");
  }

  listPendingByPriority(priority: Priority): Task[] {
    // TODO: Return PENDING tasks with the given priority. See AGENTS.md.
    throw new Error("Not implemented: listPendingByPriority");
  }

  listOverdueTasks(): Task[] {
    // TODO: Return overdue PENDING tasks, sorted by priority then due date. See AGENTS.md.
    throw new Error("Not implemented: listOverdueTasks");
  }
}
