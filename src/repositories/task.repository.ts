import type { Task } from "../models/task.model.js";

export interface TaskRepository {
  findByTitle(title: string): Task | undefined;
  findAll(): Task[];
  save(task: Task): void;
}

/**
 * Removes ordinary spaces from both ends, collapses repeated spaces to a
 * single space, and lowercases the title. Tabs and newlines are kept.
 * The repository uses this as its lookup key. Display titles stay in the
 * service.
 */
export function normalizeTitle(title: string): string {
  return title
    .replace(/^ +/, "")
    .replace(/ +$/, "")
    .replace(/ {2,}/g, " ")
    .toLowerCase();
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
