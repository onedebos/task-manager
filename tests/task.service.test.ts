import { describe, expect, it } from "vitest";
import type { Clock } from "../src/clock.js";
import {
  priority,
  status,
  type CreateTaskInput,
} from "../src/models/task.model.js";
import { InMemoryTaskRepository } from "../src/repositories/task.repository.js";
import { TaskService } from "../src/services/task.service.js";

const NOW = new Date("2026-10-19T12:00:00.000Z");

function createService(repository = new InMemoryTaskRepository()): {
  service: TaskService;
  repository: InMemoryTaskRepository;
} {
  const clock: Clock = {
    now: () => new Date(NOW.getTime()),
  };

  return {
    service: new TaskService(repository, clock),
    repository,
  };
}

describe("TaskService", () => {
  it("can be constructed with a repository and an injected clock", () => {
    const { service } = createService();

    expect(service).toBeInstanceOf(TaskService);
  });

  describe("createTask", () => {
    it.each(["", "   ", "\t", "\n"])(
      "rejects an empty or whitespace-only title: %j",
      (title) => {
        const { service, repository } = createService();

        expect(() => service.createTask({ title, priority: priority.high })).toThrow(
          "Task title is required",
        );
        expect(repository.findAll()).toEqual([]);
      },
    );

    it.each([
      ["  Write Spec  ", "Write Spec"],
      ["Write  Spec", "Write  Spec"],
    ] as const)(
      "keeps %j for display and looks the task up by its lowercase key",
      (title, displayTitle) => {
        const { service, repository } = createService();

        const task = service.createTask({ title, priority: priority.high });

        expect(task).toEqual({
          title: displayTitle,
          priority: priority.high,
          status: status.pending,
        });
        expect(repository.findByTitle("write spec")).toEqual(task);
        expect(repository.findByTitle("WRITE SPEC")).toEqual(task);
      },
    );

    it("rejects a title with the same normalized lookup key", () => {
      const { service, repository } = createService();

      service.createTask({ title: "Write Spec", priority: priority.high });

      expect(() =>
        service.createTask({ title: "  write   spec  ", priority: priority.low }),
      ).toThrow("Task title already exists");
      expect(repository.findByTitle("write spec")).toEqual({
        title: "Write Spec",
        priority: priority.high,
        status: status.pending,
      });
    });

    it("rejects a priority outside the defined set", () => {
      const { service, repository } = createService();
      const input = {
        title: "shipnotes",
        priority: "URGENT",
      } as unknown as CreateTaskInput;

      expect(() => service.createTask(input)).toThrow(
        "Priority must be HIGH, MEDIUM, or LOW",
      );
      expect(repository.findAll()).toEqual([]);
    });

    it("starts every new task as pending", () => {
      const { service } = createService();

      const task = service.createTask({
        title: "shipnotes",
        priority: priority.low,
      });

      expect(task.status).toBe(status.pending);
    });

    it("rejects an invalid due date", () => {
      const { service, repository } = createService();

      expect(() =>
        service.createTask({
          title: "shipnotes",
          priority: priority.high,
          dueDate: new Date("invalid"),
        }),
      ).toThrow("Due date is invalid");
      expect(repository.findAll()).toEqual([]);
    });

    it("allows a due date in the past and keeps the task pending", () => {
      const { service } = createService();
      const dueDate = new Date("2026-10-01T00:00:00.000Z");

      expect(dueDate.getTime()).toBeLessThan(NOW.getTime());

      const task = service.createTask({
        title: "shipnotes",
        priority: priority.high,
        dueDate,
      });

      expect(task).toEqual({
        title: "shipnotes",
        priority: priority.high,
        status: status.pending,
        dueDate,
      });
    });

    it("returns a copy so later mutations do not change the stored task", () => {
      const { service, repository } = createService();
      const dueDate = new Date("2026-12-01T00:00:00.000Z");

      const task = service.createTask({
        title: "shipnotes",
        priority: priority.high,
        dueDate,
      });

      expect(task.dueDate).not.toBe(dueDate);

      dueDate.setFullYear(1999);
      task.title = "Changed";
      task.priority = priority.low;
      task.status = status.completed;
      if (task.dueDate === undefined) {
        throw new Error("Expected the created task to have a due date");
      }
      task.dueDate.setFullYear(1998);

      expect(repository.findByTitle("shipnotes")).toEqual({
        title: "shipnotes",
        priority: priority.high,
        status: status.pending,
        dueDate: new Date("2026-12-01T00:00:00.000Z"),
      });
    });
  });

  describe("completeTask", () => {
    it.each(["missing", ""])(
      "throws when the title does not exist: %j",
      (title) => {
        const { service, repository } = createService();

        expect(() => service.completeTask(title)).toThrow("Task not found");
        expect(repository.findAll()).toEqual([]);
      },
    );

    it("marks a pending task completed and keeps its other fields", () => {
      const { service, repository } = createService();
      const dueDate = new Date("2026-12-01T00:00:00.000Z");

      service.createTask({
        title: "Write Spec",
        priority: priority.high,
        dueDate,
      });

      const completed = service.completeTask("Write Spec");

      expect(completed).toEqual({
        title: "Write Spec",
        priority: priority.high,
        status: status.completed,
        dueDate,
      });
      expect(repository.findByTitle("Write Spec")).toEqual(completed);
    });

    it("finds the task by its normalized lookup key", () => {
      const { service, repository } = createService();

      service.createTask({ title: "Write Spec", priority: priority.medium });

      const completed = service.completeTask("  WRITE SPEC  ");

      expect(completed).toEqual({
        title: "Write Spec",
        priority: priority.medium,
        status: status.completed,
      });
      expect(repository.findByTitle("write spec")).toEqual(completed);
    });

    it("rejects completing a task that is already completed", () => {
      const { service, repository } = createService();

      service.createTask({ title: "Write Spec", priority: priority.high });
      service.completeTask("Write Spec");

      expect(() => service.completeTask("write spec")).toThrow(
        "Task is already completed",
      );
      expect(repository.findByTitle("write spec")).toEqual({
        title: "Write Spec",
        priority: priority.high,
        status: status.completed,
      });
    });
  });
});
