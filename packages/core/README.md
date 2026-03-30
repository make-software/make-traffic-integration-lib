# make-traffic-integration-core

Framework-agnostic TypeScript library for managing tasks in a traffic exchange system.

[![npm](https://img.shields.io/npm/v/make-traffic-integration-core)](https://www.npmjs.com/package/make-traffic-integration-core)

## Installation

```bash
npm install make-traffic-integration-core
```

---

## Quick Start

```ts
import { NewTaskManager, Events } from "make-traffic-integration-core";

const manager = await NewTaskManager({
    apiUrl: "https://integration.maketraffic.io",
    appKey: "YOUR_APP_KEY",
});

const { data: tasks } = await manager.getTasks("user-123");
tasks.forEach(task => console.log(task.name));

manager.subscribe(Events.TaskClaimSucceed, (task) => {
    console.log("Claimed:", task.name, task.rewards);
});
```

---

## API

### `NewTaskManager(config)` → `Promise<TaskManagerApp>`

Preferred initialiser. Creates an instance, loads plugin scripts, and stores it on `window.globalTaskManager`.

```ts
const manager = await NewTaskManager({ apiUrl, appKey });
```

> For advanced use you can also instantiate manually: `new TaskManagerApp(config)` + `await manager.init()`.

---

### `getTasks(userID, filters?)` → `Promise<TasksList>`

Fetches the task list for a user. `TasksList` is a paginated object — use `.data` for the array of tasks.

```ts
const { data: tasks, total } = await manager.getTasks("user-123", {
    isActive: true,
    categories: ["default"],
    pluginIds: [2, 4],
    authProvider: "telegram",
});
```

**`TaskFilters`**

| Field | Type | Description |
|-------|------|-------------|
| `isActive` | `boolean \| "all"` | Filter active tasks (default: all) |
| `entityType` | `"task" \| "deal" \| "all"` | Entity type filter |
| `pluginIds` | `number[]` | Specific plugin IDs |
| `categories` | `string[]` | Category slugs |
| `page` | `number` | Page number |
| `pageSize` | `number` | Items per page |
| `authProvider` | `string` | Auth provider (e.g. `"telegram"`) |

---

### `goProcess(userID, task, options?)` → `Promise<void>`

Triggers the task's go/start action (e.g. opens a redirect). Emits `Events.ClickOnTaskGo`.

```ts
await manager.goProcess("user-123", task, { authProvider: "telegram" });
```

---

### `claimProcess(userID, task, options?)` → `Promise<void>`

Claims the reward. On success emits `Events.TaskClaimSucceed`. On failure throws `HttpError` with a human-readable `message` parsed from the server response body.

```ts
try {
    await manager.claimProcess("user-123", task, { authProvider: "telegram" });
} catch (err) {
    if (err instanceof HttpError) {
        console.error(err.message); // e.g. "task has not been completed"
    }
}
```

---

### `subscribe(event, callback)` / `unsubscribe(event, callback)`

Event pub/sub. Always unsubscribe in cleanup to avoid memory leaks.

```ts
const handler = (task) => console.log("Claimed:", task);
manager.subscribe(Events.TaskClaimSucceed, handler);

// cleanup
manager.unsubscribe(Events.TaskClaimSucceed, handler);
```

---

## Events

| Event | Payload | When |
|-------|---------|------|
| `Events.TaskClaimSucceed` | `Task` | Reward successfully claimed |
| `Events.TaskClaimFailed` | `Task` | Claim rejected (e.g. task not completed) |
| `Events.ClickOnTaskGo` | `Task` | Go action triggered |
| `Events.ClickOnTaskClaim` | `Task` | Claim action triggered |
| `Events.ClaimModalOpen` | `ClaimModalOpenPayload` | Plugin needs a UI container |
| `Events.ClaimModalClosed` | `ClaimModalClosedPayload` | Modal dismissed |

---

## Types

```ts
import {
    Task,
    TasksList,
    TaskFilters,
    EntityType,
    HttpError,
    Events,
} from "make-traffic-integration-core";
```

---

## Examples

| Example | Stack | Link |
|---------|-------|------|
| Vanilla JS | No build step | [examples/native-js](../../examples/native-js/) |
| Vanilla TS | tsc, ESNext modules | [examples/native-ts](../../examples/native-ts/) |
| React | React 18, Tailwind | [examples/react-app](../../examples/react-app/) |

---

## License

MIT
