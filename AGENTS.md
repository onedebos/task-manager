# Task Manager — Agent Instructions

This repository is the TypeScript harness for a 90-minute collaborative coding interview.
The four Task Manager operations are intentionally unimplemented. Do not fill them in until the workflow below has been followed and the candidate has approved the plan.

## Architecture principles

- Models define data structures.
- Repositories manage storage and retrieval.
- Services implement business logic.
- Prefer simple, readable TypeScript.
- Avoid unnecessary abstractions and dependencies.
- Keep TypeScript strict mode enabled.

`TaskService` receives a `TaskRepository` and a `Clock` through its constructor. Use the injected clock for any "current time" decision so tests can control it. `SystemClock` is the production implementation.

The repository stores tasks in a private `Map` keyed by normalized title. It must not expose that map or return a mutable reference to a stored task. Copy tasks on the way in and on the way out, including a new `Date` for any due date.

## Business decisions and assumptions

These decisions are recorded so they are easy to change if the interviewers clarify the requirements. They are not implemented in `TaskService` yet.

- Titles are required and cannot be empty or whitespace-only.
- Titles must be unique, using case-insensitive comparison.
- Trim surrounding whitespace when normalizing titles.
- Preserve the submitted title for display, apart from surrounding whitespace.
- Priority is required and must be `HIGH`, `MEDIUM`, or `LOW`.
- Runtime validation is required even when TypeScript types exist.
- Due dates are optional.
- Invalid dates should be rejected.
- Valid dates in the past are allowed.
- New tasks start as `PENDING`.
- Overdue means `PENDING` with a defined due date strictly earlier than the current time.
- Sorting for overdue tasks is by priority first (`HIGH`, then `MEDIUM`, then `LOW`), then by due date ascending (earliest first).

Repository lookup keys use the title normalization above: trim surrounding whitespace, then compare case-insensitively. The repository does not enforce the other rules. Display titles are stored as given; trimming a title for display belongs in the service when `createTask` is implemented.

## AI collaboration workflow

For every interview requirement:

1. Let the candidate explain their proposed implementation first.
2. Review the approach and identify any gaps or assumptions.
3. Ask questions where requirements are ambiguous.
4. Propose a small implementation plan.
5. Wait for the candidate's approval before modifying code.
6. Write the tests for the agreed behaviour.
7. Run the tests and confirm they fail for the expected reason.
8. Implement only the approved functionality.
9. Run the tests and TypeScript checks.
10. Show the changes and explain how they satisfy the requirements.

Do not implement multiple interview requirements at once unless the candidate explicitly approves it.

The operations to implement, one at a time, are:

- `createTask(input: CreateTaskInput): Task`
- `completeTask(title: string): Task`
- `listPendingByPriority(priority: Priority): Task[]`
- `listOverdueTasks(): Task[]`

## Evaluation principles

For each implementation, help verify:

- Does it meet the requirements?
- Is the logic correct, including edge cases?
- Does it follow our architecture?
- Do the tests actually prove the expected behaviour?
- Have we introduced unnecessary complexity?

Never treat successful compilation or passing tests alone as proof that the implementation is correct.

## Commands

- `npm test` — run Vitest once.
- `npm run test:watch` — run Vitest in watch mode.
- `npm run typecheck` — run TypeScript without emitting files.
