import { describe, expect, it } from "vitest";
import { priority, status, type Task } from "../src/models/task.model.js";
import { InMemoryTaskRepository } from "../src/repositories/task.repository.js";

const DUE_DATE = new Date("2026-01-15T00:00:00.000Z");

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    title: "Write spec",
    priority: priority.high,
    status: status.pending,
    dueDate: new Date(DUE_DATE.getTime()),
    ...overrides,
  };
}

describe("InMemoryTaskRepository", () => {
  it("saves and retrieves a task by title", () => {
    const repository = new InMemoryTaskRepository();
    const task = makeTask();

    repository.save(task);

    expect(repository.findByTitle("Write spec")).toEqual(task);
  });

  it("returns undefined when the title does not exist", () => {
    const repository = new InMemoryTaskRepository();

    expect(repository.findByTitle("missing")).toBeUndefined();

    repository.save(makeTask());

    expect(repository.findByTitle("other task")).toBeUndefined();
  });

  it("looks up tasks by trimmed, case-insensitive title", () => {
    const repository = new InMemoryTaskRepository();
    repository.save(makeTask({ title: "  Write spec  " }));

    expect(repository.findByTitle("write spec")).toEqual(
      makeTask({ title: "  Write spec  " }),
    );
    expect(repository.findByTitle("  WRITE SPEC  ")).toEqual(
      makeTask({ title: "  Write spec  " }),
    );
  });

  it("lists every stored task", () => {
    const repository = new InMemoryTaskRepository();
    const first = makeTask({ title: "First" });
    const second = makeTask({ title: "Second", priority: priority.low });

    repository.save(first);
    repository.save(second);

    expect(repository.findAll()).toEqual([first, second]);
  });

  it("returns copies so callers cannot mutate stored tasks or their due dates", () => {
    const repository = new InMemoryTaskRepository();
    const originalDueDate = new Date(DUE_DATE.getTime());
    const task = makeTask({ dueDate: originalDueDate });

    repository.save(task);
    originalDueDate.setFullYear(1999);
    task.title = "Mutated input";
    task.dueDate?.setFullYear(1998);

    const found = repository.findByTitle("Write spec");
    expect(found).toEqual(makeTask());
    expect(found?.dueDate).not.toBe(originalDueDate);

    if (found?.dueDate === undefined) {
      throw new Error("Expected the stored task to have a due date");
    }

    found.title = "Changed";
    found.priority = priority.low;
    found.status = status.completed;
    found.dueDate.setFullYear(1999);

    const listed = repository.findAll();
    const listedTask = listed[0];
    if (listedTask?.dueDate === undefined) {
      throw new Error("Expected the listed task to have a due date");
    }

    listedTask.title = "Also changed";
    listedTask.dueDate.setMonth(0);
    listed.pop();

    expect(repository.findByTitle("Write spec")).toEqual(makeTask());
    expect(repository.findAll()).toEqual([makeTask()]);
  });
});
