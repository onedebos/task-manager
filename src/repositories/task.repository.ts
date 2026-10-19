import type { Task } from "../models/task.model.js";

export interface TaskRepository {
  findByTitle(title: string): Task | undefined;
  findAll(): Task[];
  save(task: Task): void;
}

/**
 * Storage key for a title. Trims surrounding whitespace and compares
 * case-insensitively. This is a lookup key only; uniqueness and display
 * formatting stay in the service.
 */
function normalizeTitle(title: string): string {
  return title.trim().toLowerCase();
}

function copyTask(task: Task): Task {
  const copy: Task = {
    title: task.title,
    priority: task.priority,
    status: task.status,
  };

  if (task.dueDate !== undefined) {
    copy.dueDate = new Date(task.dueDate.getTime());
  }

  return copy;
}

export class InMemoryTaskRepository implements TaskRepository {
  private readonly tasks = new Map<string, Task>();

  findByTitle(title: string): Task | undefined {
    const task = this.tasks.get(normalizeTitle(title));
    return task === undefined ? undefined : copyTask(task);
  }

  findAll(): Task[] {
    return Array.from(this.tasks.values(), (task) => copyTask(task));
  }

  save(task: Task): void {
    this.tasks.set(normalizeTitle(task.title), copyTask(task));
  }
}
