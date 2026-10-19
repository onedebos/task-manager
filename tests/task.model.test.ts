import { describe, expect, it } from "vitest";
import { PRIORITY, STATUS } from "../src/models/task.model.js";

describe("PRIORITY", () => {
  it("names each defined priority", () => {
    expect(PRIORITY.high).toBe("HIGH");
    expect(PRIORITY.medium).toBe("MEDIUM");
    expect(PRIORITY.low).toBe("LOW");
    expect(Object.keys(PRIORITY)).toEqual(["high", "medium", "low"]);
  });
});

describe("STATUS", () => {
  it("names each defined status", () => {
    expect(STATUS.pending).toBe("PENDING");
    expect(STATUS.completed).toBe("COMPLETED");
    expect(Object.keys(STATUS)).toEqual(["pending", "completed"]);
  });
});
