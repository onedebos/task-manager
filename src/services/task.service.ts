import type { Clock } from "../clock.js";
import {
  PRIORITY,
  STATUS,
  type CreateTaskInput,
  type Priority,
  type Task,
} from "../models/task.model.js";
import {
  normalizeTitle,
  type TaskRepository,
} from "../repositories/task.repository.js";

const PRIORITIES: readonly Priority[] = [
  PRIORITY.high,
  PRIORITY.medium,
  PRIORITY.low,
];

function compareByDueDate(left: Task, right: Task): number {
  if (left.dueDate === undefined) {
    return right.dueDate === undefined ? 0 : 1;
  }

  if (right.dueDate === undefined) {
    return -1;
  }

  return left.dueDate.getTime() - right.dueDate.getTime();
}

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
      status: STATUS.pending,
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

    if (existing.status === STATUS.completed) {
      throw new Error("Task is already completed");
    }

    const completed: Task = {
      title: existing.title,
      priority: existing.priority,
      status: STATUS.completed,
    };

    if (existing.dueDate !== undefined) {
      completed.dueDate = new Date(existing.dueDate.getTime());
    }

    this.repository.save(completed);
    return completed;
  }

  listPendingByPriority(priority: Priority): Task[] {
    if (!PRIORITIES.includes(priority)) {
      throw new Error("Priority must be HIGH, MEDIUM, or LOW");
    }

    return this.repository
      .findAll()
      .filter(
        (task) => task.priority === priority && task.status === STATUS.pending,
      )
      .sort((left, right) => compareByDueDate(left, right));
  }

  listOverdueTasks(): Task[] {
    throw new Error("Not implemented: listOverdueTasks");
  }
}
