import { describe, expect, it } from "vitest";
import type { Clock } from "../src/clock.js";
import type { CreateTaskInput, Priority } from "../src/models/task.model.js";
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
    it("rejects a duplicate title after trimming, collapsing whitespace, and ignoring case", () => {
      const { service, repository } = createService();

      service.createTask({ title: "Release Notes", priority: "HIGH" });

      expect(() =>
        service.createTask({ title: "  RELEASE   NOTES  ", priority: "LOW" }),
      ).toThrow("Task title already exists");
      expect(repository.findByTitle("release notes")).toEqual({
        title: "release notes",
        priority: "HIGH",
        status: "PENDING",
      });
    });

    it.each([
      "  Write Spec  ",
      "write  spec",
      "write\tspec",
      "write\nspec",
      "  write \t  spec \n",
    ])("trims and collapses whitespace in %j", (title) => {
      const { service } = createService();

      const task = service.createTask({ title, priority: "HIGH" });

      expect(task).toEqual({
        title: "write spec",
        priority: "HIGH",
        status: "PENDING",
      });
    });

    it.each(["", "   ", "\t", "\n"])("rejects an empty title: %j", (title) => {
      const { service, repository } = createService();

      expect(() => service.createTask({ title, priority: "HIGH" })).toThrow(
        "Task title is required",
      );
      expect(repository.findAll()).toEqual([]);
    });

    it("stores the title in lowercase", () => {
      const { service } = createService();

      const task = service.createTask({
        title: "WriteSpec",
        priority: "HIGH",
      });

      expect(task).toEqual({
        title: "writespec",
        priority: "HIGH",
        status: "PENDING",
      });
    });

    it.each([
      ["Release2", "release2"],
      ["  Release 2  ", "release 2"],
    ] as const)(
      "accepts a number when the title does not start with one: %j",
      (title, expectedTitle) => {
        const { service } = createService();

        const task = service.createTask({
          title,
          priority: "MEDIUM",
        });

        expect(task).toEqual({
          title: expectedTitle,
          priority: "MEDIUM",
          status: "PENDING",
        });
      },
    );

    it.each(["2release", "  2release", "  2 release  "])(
      "rejects a title that starts with a number: %j",
      (title) => {
        const { service, repository } = createService();

        expect(() =>
          service.createTask({ title, priority: "HIGH" }),
        ).toThrow("Task title must not start with a number");
        expect(repository.findAll()).toEqual([]);
      },
    );

    it("starts every new task as pending", () => {
      const { service } = createService();

      const task = service.createTask({
        title: "ShipNotes",
        priority: "LOW",
      });

      expect(task.status).toBe("PENDING");
    });

    it.each(["HIGH", "MEDIUM", "LOW"] as const)(
      "stores the %s priority",
      (priority: Priority) => {
        const { service } = createService();

        const task = service.createTask({ title: "shipnotes", priority });

        expect(task.priority).toBe(priority);
      },
    );

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

    it("stores a due date when one is provided", () => {
      const { service } = createService();
      const dueDate = new Date("2026-12-01T00:00:00.000Z");

      const task = service.createTask({
        title: "shipnotes",
        priority: "HIGH",
        dueDate,
      });

      expect(task.dueDate).toEqual(dueDate);
    });

    it("omits the due date when one is not provided", () => {
      const { service } = createService();

      const task = service.createTask({
        title: "shipnotes",
        priority: "HIGH",
      });

      expect(task.dueDate).toBeUndefined();
    });

    it("allows a due date in the past", () => {
      const { service } = createService();
      const dueDate = new Date("2026-10-01T00:00:00.000Z");

      expect(dueDate.getTime()).toBeLessThan(NOW.getTime());

      const task = service.createTask({
        title: "shipnotes",
        priority: "HIGH",
        dueDate,
      });

      expect(task).toEqual({
        title: "shipnotes",
        priority: "HIGH",
        status: "PENDING",
        dueDate,
      });
    });
  });
});
