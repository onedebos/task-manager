import { describe, expect, it } from "vitest";
import type { Clock } from "../src/clock.js";
import { InMemoryTaskRepository } from "../src/repositories/task.repository.js";
import { TaskService } from "../src/services/task.service.js";

describe("TaskService", () => {
  it("can be constructed with a repository and an injected clock", () => {
    const fixedNow = new Date("2026-10-19T12:00:00.000Z");
    const clock: Clock = {
      now: () => new Date(fixedNow.getTime()),
    };

    const service = new TaskService(new InMemoryTaskRepository(), clock);

    expect(service).toBeInstanceOf(TaskService);
  });
});
