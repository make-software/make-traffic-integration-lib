# React Example

Demonstrates three levels of React integration, from minimal to production-ready.
All examples share the same components in `src/components/`.

## Install & Run

```bash
cd examples/react-app
npm install
PORT=3033 npm start
```

Open `http://localhost:3033` in the browser.

Replace `<!--YourAppKey-->` in the active example's config with your key from the [Make Traffic console](https://make-traffic-console.dev.make.services/).

## Switching Examples

Uncomment the import you want in [`src/index.tsx`](./src/index.tsx):

```ts
// 1. Simple — TaskManagerProvider, no hooks, ~35 lines
import App from "./examples/simple/App";

// 2. Hook — useTaskManager, minimal hook usage, ~35 lines
import App from "./examples/hook/App";

// 3. Full — hook + error handling + toasts + modal host
import App from "./examples/full/App";
import "./examples/full/config";  // remove for examples 1 & 2
```

---

## Example 1 — Simple [`examples/simple/App.tsx`](./src/examples/simple/App.tsx)

Uses `TaskManagerProvider`. Pass a `template` function and the provider handles everything else — init, fetching, go/claim actions.

```
TaskManagerProvider
  ↳ template(task, { go, claim })   ← you render this
```

No state, no hooks, no event subscriptions needed.

---

## Example 2 — Hook [`examples/hook/App.tsx`](./src/examples/hook/App.tsx)

Uses `useTaskManager`. Full control over rendering with `isLoading` and `error` states exposed. Same amount of code as the simple example.

```
useTaskManager → { tasks, isLoading, error, goProcess, claimProcess }
```

---

## Example 3 — Full [`examples/full/App.tsx`](./src/examples/full/App.tsx)

Production-ready setup. See the [Best Practices](../../README.md#best-practices) section in the main README for a detailed breakdown with links to the relevant code.

**Features:**
- Singleton manager initialised outside React ([`config.ts`](./src/examples/full/config.ts))
- Explicit list refresh after go and claim actions
- `TaskClaimSucceed` event subscription for reward notifications
- Error surfacing with auto-dismiss toasts
- `TaskClaimModalHost` for plugin-rendered UI (quiz tasks, surveys)
- Shared components: `TaskRow`, `SkeletonRow`, `Toast`

---

## Project Structure

```
src/
  index.tsx                   ← entry point — switch examples here
  components/
    TaskRow.tsx               ← task row: icon / name+rewards / action button
    SkeletonRow.tsx           ← animated loading placeholder
    Toast.tsx                 ← fixed top-centre notification pill
  examples/
    simple/App.tsx            ← TaskManagerProvider approach
    hook/App.tsx              ← useTaskManager, minimal
    full/
      config.ts               ← credentials, singleton manager init
      App.tsx                 ← full production example
```
