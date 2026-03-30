# make-traffic-integration-react-wrapper

React hook and provider for the Make Traffic task manager.

[![npm](https://img.shields.io/npm/v/make-traffic-integration-react-wrapper)](https://www.npmjs.com/package/make-traffic-integration-react-wrapper)

## Installation

```bash
npm install make-traffic-integration-core make-traffic-integration-react-wrapper
```

> `make-traffic-integration-core` is a peer dependency — install it alongside this package.

---

## Quick Start

```tsx
import { useTaskManager } from "make-traffic-integration-react-wrapper";

const { tasks, isLoading, error, goProcess, claimProcess } = useTaskManager({
    taskManagerApp: app,
    userID: "user-123",
    authProvider: "telegram",
});
```

---

## API

### `useTaskManager(options)` → `UseTaskManagerResult`

React hook. Initialises the manager once, fetches tasks, and exposes go/claim actions.

```tsx
const {
    tasks,        // Task[]
    isLoading,    // boolean
    error,        // Error | null
    refresh,      // () => void — re-fetch task list
    goProcess,    // (task: Task) => Promise<void>
    claimProcess, // (task: Task) => Promise<void>
} = useTaskManager({
    taskManagerApp,           // TaskManagerApp instance
    userID: "user-123",
    authProvider: "telegram", // forwarded to all API calls
    filters: {                // forwarded to getTasks
        isActive: true,
        categories: ["default"],
    },
});
```

Call `refresh()` explicitly after `goProcess` and `claimProcess` to keep the list in sync.

[→ examples/react-app/src/examples/full/App.tsx](../../examples/react-app/src/examples/full/App.tsx)

---

### `TaskManagerProvider`

Declarative alternative to `useTaskManager`. Pass a `template` render function — the provider handles init, fetching, and actions.

```tsx
import { TaskManagerProvider } from "make-traffic-integration-react-wrapper";

<TaskManagerProvider
    taskManagerApp={app}
    userID="user-123"
    authProvider="telegram"
    template={(task, { go, claim }) => (
        <div key={task.id}>
            <span>{task.name}</span>
            <button onClick={go}>Go</button>
            <button onClick={claim}>Claim</button>
        </div>
    )}
/>
```

[→ examples/react-app/src/examples/simple/App.tsx](../../examples/react-app/src/examples/simple/App.tsx)

---

### `TaskClaimModalHost`

Required for plugin-rendered UI (e.g. quiz or survey tasks). Place once near the app root. Subscribes to `ClaimModalOpen`, renders a modal shell, and passes a DOM container to the plugin via `provideHost`. Emits `ClaimModalClosed` on dismiss.

```tsx
import { TaskClaimModalHost } from "make-traffic-integration-react-wrapper";

// Minimal — uses built-in styles
<TaskClaimModalHost taskManagerApp={window.globalTaskManager} />

// Custom styles via props
<TaskClaimModalHost
    taskManagerApp={window.globalTaskManager}
    style={{ maxWidth: "480px" }}
    overlayStyle={{ backdropFilter: "blur(4px)" }}
    contentStyle={{ padding: 24 }}
/>
```

**Props**

| Prop | Type | Description |
|------|------|-------------|
| `taskManagerApp` | `TaskManagerApp` | Required. The manager instance. |
| `overlayClassName` | `string` | Class added to the backdrop. |
| `overlayStyle` | `CSSProperties` | Inline style merged into the backdrop. |
| `className` | `string` | Class added to the modal panel. |
| `style` | `CSSProperties` | Inline style merged into the modal panel (e.g. `maxWidth`, `background`). |
| `contentClassName` | `string` | Class added to the inner content div. |
| `contentStyle` | `CSSProperties` | Inline style merged into the inner content div. |

[→ examples/react-app/src/examples/full/App.tsx](../../examples/react-app/src/examples/full/App.tsx)

---

### `getRewardValue(rewards, type)` → `number`

Extracts a reward amount by type from a task's reward list.

```ts
import { getRewardValue } from "make-traffic-integration-react-wrapper";

const coins = getRewardValue(task.rewards, "coin");
const energy = getRewardValue(task.rewards, "energy");
```

---

### `getTaskIconUrl(task, assetsPath?)` → `string`

Resolves the icon URL for a task. Uses `customMetadata.icon` when present; falls back to `www.svg`. Absolute URLs are passed through unchanged.

```ts
import { getTaskIconUrl } from "make-traffic-integration-react-wrapper";

const iconUrl = getTaskIconUrl(task, "/icons"); // "/icons/redirect.svg" or "/icons/www.svg"
const iconUrl = getTaskIconUrl(task);           // "redirect.svg" or "www.svg"
```

[→ examples/react-app/src/components/TaskRow.tsx](../../examples/react-app/src/components/TaskRow.tsx)

---

### `pluginRegistry`

Typed helpers to extract plugin-specific metadata from `task.customMetadata`.

```ts
import { pluginRegistry } from "make-traffic-integration-react-wrapper";

const meta = pluginRegistry.redirect.getMetadata(task);
// { url: string, secondsToClaim: number }
```

---

## Error Handling

`claimProcess` rejects with `HttpError` (from `make-traffic-integration-core`) when the server returns an error. The message is parsed from the JSON response body.

```tsx
import { HttpError } from "make-traffic-integration-core";

try {
    await claimProcess(task);
    refresh();
} catch (err) {
    if (err instanceof HttpError) {
        showError(err.message); // e.g. "task has not been completed"
    }
}
```

[→ examples/react-app/src/examples/full/App.tsx](../../examples/react-app/src/examples/full/App.tsx)

---

## Event Subscriptions

Subscribe inside `useEffect` and always return the unsubscribe function.

```ts
import { Events } from "make-traffic-integration-core";

React.useEffect(() => {
    const manager = window.globalTaskManager;
    if (!manager) return;
    const handler = (task) => showSuccess(`Claimed: ${task.name}`);
    manager.subscribe(Events.TaskClaimSucceed, handler);
    return () => manager.unsubscribe(Events.TaskClaimSucceed, handler);
}, []);
```

---

## Examples

| Example | What it shows |
|---------|--------------|
| [full](../../examples/react-app/src/examples/full/) | Production setup: singleton, refresh, events, modal host, toasts |
| [hook](../../examples/react-app/src/examples/hook/) | `useTaskManager` minimal usage |
| [simple](../../examples/react-app/src/examples/simple/) | `TaskManagerProvider` declarative approach |

---

## License

MIT
