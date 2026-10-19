import { describe, expect, it } from "vitest";
import { priority, status } from "../src/models/task.model.js";

describe("priority", () => {
  it("names each defined priority", () => {
    expect(priority.high).toBe("HIGH");
    expect(priority.medium).toBe("MEDIUM");
    expect(priority.low).toBe("LOW");
    expect(Object.keys(priority)).toEqual(["high", "medium", "low"]);
  });
});

describe("status", () => {
  it("names each defined status", () => {
    expect(status.pending).toBe("PENDING");
    expect(status.completed).toBe("COMPLETED");
    expect(Object.keys(status)).toEqual(["pending", "completed"]);
  });
});
