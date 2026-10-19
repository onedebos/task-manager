import type { Task } from "../models/task.model.js";

export interface TaskRepository {
  findByTitle(title: string): Task | undefined;
  findAll(): Task[];
  save(task: Task): void;
}

/**
 * Trims surrounding whitespace, collapses internal whitespace to a single
 * space, and lowercases the title. The repository uses this as its lookup
 * key. The service uses it for the stored display title as well.
 */
export function normalizeTitle(title: string): string {
  return title.trim().replace(/\s+/g, " ").toLowerCase();
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
