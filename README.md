# Make Traffic Integration JS Library

Modular JavaScript libraries for managing tasks in a traffic exchange system.
Framework-agnostic core written in TypeScript, with a React wrapper for UI integration.

| Package | npm | Description |
|---------|-----|-------------|
| `make-traffic-integration-core` | [![npm](https://img.shields.io/npm/v/make-traffic-integration-core)](https://www.npmjs.com/package/make-traffic-integration-core) | Core library — framework-agnostic |
| `make-traffic-integration-react-wrapper` | [![npm](https://img.shields.io/npm/v/make-traffic-integration-react-wrapper)](https://www.npmjs.com/package/make-traffic-integration-react-wrapper) | React hook + provider |

---

## Examples

| Example | Stack | Complexity | README |
|---------|-------|-----------|--------|
| [`examples/native-js`](./examples/native-js/) | Vanilla JS, no build | Minimal | [README](./examples/native-js/README.md) |
| [`examples/native-ts`](./examples/native-ts/) | Vanilla TS, tsc | Minimal | [README](./examples/native-ts/README.md) |
| [`examples/react-app`](./examples/react-app/) | React 18, Tailwind | Simple → Full | [README](./examples/react-app/README.md) |

---

## Installation

```bash
# Core only (vanilla JS/TS)
npm install make-traffic-integration-core

# React projects
npm install make-traffic-integration-core make-traffic-integration-react-wrapper
```

---

## Quick Start

### Vanilla JS / TS

```ts
import { NewTaskManager, Events } from "make-traffic-integration-core";

const manager = await NewTaskManager({
    apiUrl: "https://integration.maketraffic.io",
    appKey: "<!--YourAppKey-->",
});

const { data: tasks } = await manager.getTasks("user-123");

manager.subscribe(Events.TaskClaimSucceed, (task) => {
    console.log("Claimed:", task.name, task.rewards);
});
```

### React

```tsx
import { useTaskManager } from "make-traffic-integration-react-wrapper";

const { tasks, isLoading, error, goProcess, claimProcess } = useTaskManager({
    taskManagerApp: app,
    userID: "user-123",
    authProvider: "telegram",
});
```

---

## Core API

### `NewTaskManager(config)` → `TaskManagerApp`
Initialises the library, loads plugin scripts, and stores the instance on `window.globalTaskManager`.
Prefer this over `new TaskManagerApp(config)` + `init()` in most cases.

### `getTasks(userID, filters?)` → `TasksList`
Fetches tasks for the user. Supports filtering by `isActive`, `categories`, `pluginIds`, `entityType`, `page`, `pageSize`, `authProvider`.

### `goProcess(userID, task, options?)` → `void`
Triggers the task's go/start action (e.g. opens a redirect). Emits `Events.ClickOnTaskGo`.

### `claimProcess(userID, task, options?)` → `void`
Claims the reward. On success emits `Events.TaskClaimSucceed`. On conflict (409) emits `Events.TaskClaimFailed` and rejects with an `HttpError` containing the server message.

### `subscribe(event, callback)` / `unsubscribe(event, callback)`
Event pub/sub. Always unsubscribe in cleanup (React `useEffect` return, component unmount).

---

## Events

| Event | Payload | When |
|-------|---------|------|
| `Events.TaskClaimSucceed` | `Task` | Reward successfully claimed |
| `Events.TaskClaimFailed` | `Task` | Claim rejected (e.g. task not completed) |
| `Events.ClickOnTaskGo` | `Task` | Go button triggered |
| `Events.ClickOnTaskClaim` | `Task` | Claim button triggered |
| `Events.ClaimModalOpen` | `ClaimModalOpenPayload` | Plugin needs a UI container |
| `Events.ClaimModalClosed` | `ClaimModalClosedPayload` | Modal dismissed |

---

## Best Practices

### Singleton manager

Initialise once outside the component tree and store on `window` so it is accessible before React mounts and across components without prop drilling.

```ts
// examples/react-app/src/examples/full/config.ts
NewTaskManager(APP_CONFIG).then((manager) => {
    window.globalTaskManager = manager;
});
```

[→ config.ts](./examples/react-app/src/examples/full/config.ts)

---

### List invalidation

Call `refresh()` explicitly after both `goProcess` and `claimProcess` succeed. Do not refresh on failure — the server state has not changed.

```ts
// After go
onGo={() => goProcess(task).then(refresh)}

// After claim
await claimProcess(task);
refresh();
```

[→ full/App.tsx](./examples/react-app/src/examples/full/App.tsx)

---

### Event subscriptions

Subscribe inside `useEffect` and always return the unsubscribe function. Use events for cross-cutting concerns (notifications, analytics) rather than coupling them to action handlers.

```ts
React.useEffect(() => {
    const manager = window.globalTaskManager;
    if (!manager) return;
    manager.subscribe(Events.TaskClaimSucceed, showSuccess);
    return () => manager.unsubscribe(Events.TaskClaimSucceed, showSuccess);
}, []);
```

[→ full/App.tsx](./examples/react-app/src/examples/full/App.tsx)

---

### Error handling

`claimProcess` rejects with `HttpError` on failure. Read `err.message` — the library parses the server's JSON error body so the message is human-readable (e.g. `"task has not been completed"`).

```ts
const handleClaim = async (task: Task) => {
    try {
        await claimProcess(task);
        refresh();
    } catch (err: any) {
        showError(err?.message || "Failed to claim task");
    }
};
```

[→ full/App.tsx](./examples/react-app/src/examples/full/App.tsx)

---

### Plugin modal host (quiz / survey tasks)

Some plugins (e.g. quiz) need a UI surface to render into. Place `TaskClaimModalHost` once near the root of your app. It listens for `ClaimModalOpen`, opens a modal shell, and hands a DOM container to the plugin via `provideHost`. The plugin owns what renders inside; the host owns open/close state and emits `ClaimModalClosed`.

```tsx
<TaskClaimModalHost taskManagerApp={window.globalTaskManager} />
```

[→ full/App.tsx](./examples/react-app/src/examples/full/App.tsx) · [→ TaskClaimModalHost.tsx](./packages/react-wrapper/src/TaskClaimModalHost.tsx)

---

### Task metadata

`task.customMetadata` is untyped (`object | null`). Use the plugin registry helpers to extract typed metadata, or cast locally for simple fields.

```ts
import { pluginRegistry, getRewardValue, getTaskIconUrl } from "make-traffic-integration-react-wrapper";

// Typed metadata for redirect plugin
const meta = pluginRegistry.redirect.getMetadata(task); // { url, secondsToClaim }

// Reward amount by type
const coins = getRewardValue(task.rewards, "coin");

// Icon URL with fallback to www.svg
const iconUrl = getTaskIconUrl(task, "/icons");
```

[→ TaskRow.tsx](./examples/react-app/src/components/TaskRow.tsx) · [→ utils.ts](./packages/react-wrapper/src/utils.ts)

---

### Auth provider

Pass `authProvider` to every call that reaches the API — `getTasks`, `goProcess`, `claimProcess`. Centralise it in config so it never diverges.

```ts
// config.ts
export const AUTH_PROVIDER = "telegram";

// useTaskManager / goProcess / claimProcess all forward it:
const { ... } = useTaskManager({ ..., authProvider: AUTH_PROVIDER });
```

[→ config.ts](./examples/react-app/src/examples/full/config.ts)

---

### Filters

Use `filters` in `getTasks` / `useTaskManager` to reduce payload size. Filter server-side by plugin type, category or active state rather than filtering the full list client-side.

```ts
useTaskManager({
    filters: {
        isActive: true,          // active tasks only (default)
        categories: ["default"], // specific categories
        pluginIds: [2, 4],       // specific plugins
    },
});
```

[→ full/App.tsx](./examples/react-app/src/examples/full/App.tsx) · [→ HttpClient.ts](./packages/core/src/services/HttpClient.ts)

---

## License

MIT
