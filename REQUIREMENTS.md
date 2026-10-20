# Multiverse Candidate Brief — Task Manager Requirements

Source: **Senior Software Engineer: Candidate Brief – AI Task**, pages 1–2. This is a faithful summary of the supplied brief, not an expanded product specification.

## Interview format

- **90-minute working session** with two panelists: one focused on architecture and one on code and trade-offs.
- **0–20 minutes:** Scaffold walkthrough — what was built, why it was structured that way, AI steering context, and what would change with more time.
- **20–80 minutes:** Collaborative working session to extend the scaffold against core requirements. Expect detours and hypothetical scope changes.
- **80–90 minutes:** Candidate Q&A.

## Starter scaffold expected before the interview

- **Functional in-memory storage foundation:** Choose a suitable structure for the access patterns, such as a Map or List.
- **Clear module boundaries:** Separate storage logic from query/business logic.
- **Automated tests:** A few foundational tests covering happy paths and basic error handling.
- **AI steering context:** Bring actual prompts, instructions, conventions, or documents used to direct AI tools.
- A brief specification or design note is optional.

## Problem: Task Manager

Build a system for creating, managing, and querying tasks.

### Task attributes

- **Title:** Unique; acts as the identifier.
- **Priority:** `HIGH`, `MEDIUM`, or `LOW`.
- **Due Date:** Optional.
- **Status:** `PENDING` or `COMPLETE`.

### Core functional requirements

1. **Create a task** with a title, priority, and optional due date.
2. **Complete a task** by title.
3. **List by priority**, returning only `PENDING` tasks matching a given priority.
4. **Get overdue tasks**, returning all `PENDING` tasks whose due date is before the current time, sorted by priority (`HIGH` first), then by due date (earliest first).

## Technical guardrails and non-functional requirements

- **Testability / injectable time:** Avoid hardcoding `Date.now()` within business logic; make time injectable so time-sensitive operations can be verified.
- **Input validation and integrity:** Handle unexpected inputs or states cleanly, including enforcing unique titles and validating requests for non-existent tasks.
- **State encapsulation:** Do not leak mutable internal collections; return copies or safe abstractions from query methods.
- **Logical rigor:** Verify fundamental logic, including ordering priority by severity rather than alphabetically.

## AI collaboration and evaluation

- Use any AI coding tools you are comfortable with; Multiverse uses Claude Code internally.
- The focus is on using AI to deliver clean, maintainable, future-friendly code, **not** on building AI systems.
- Panelists evaluate problem decomposition, iterative prompting, and judgment about AI use versus manual edits.
- Expect discussion of architecture, engineering logic, trade-offs, and how the design adapts to new requirements.

## Not specified by the brief

The document does **not** define title whitespace/case-normalization rules, whether completing an already-completed task is an error, empty-list return semantics, or additional ordering for the pending-by-priority list. Treat these as questions or explicit assumptions, not as requirements.
