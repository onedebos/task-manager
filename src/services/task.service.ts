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
   * Create a task with a required, non-blank, unique title and valid priority.
   * Compare titles case-insensitively after trimming surrounding whitespace,
   * but preserve the user's capitalization for display.
   * Due date is optional; reject invalid dates and allow dates in the past.
   * New tasks start PENDING. Save and return the created task.
   */
  createTask(input: CreateTaskInput): Task {
    throw new Error("Not implemented: createTask");
  }

  /**
   * Find a task by title (case-insensitive, ignoring surrounding whitespace).
   * Mark a pending task COMPLETED, preserving its other fields, then save
   * and return it. Confirm expected behaviour for missing/already-completed
   * tasks before implementing.
   */
  completeTask(title: string): Task {
    throw new Error("Not implemented: completeTask");
  }

  /**
   * Return only PENDING tasks matching the requested HIGH/MEDIUM/LOW priority.
   * Confirm whether ordering is required; do not add sorting by assumption.
   * An empty result is an empty array unless the interviewer specifies otherwise.
   */
  listPendingByPriority(priority: Priority): Task[] {
    throw new Error("Not implemented: listPendingByPriority");
  }

  /**
   * Return PENDING tasks with a due date strictly earlier than the current time.
   * Use the injected clock. Exclude completed, undated, future and due-now tasks.
   * Sort HIGH -> MEDIUM -> LOW, then earliest due date within each priority.
   * Return [] when no tasks match unless specified otherwise.
   */
  listOverdueTasks(): Task[] {
    throw new Error("Not implemented: listOverdueTasks");
  }
}
