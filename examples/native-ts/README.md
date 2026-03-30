# Native TS Example

Vanilla TypeScript integration. Compiled with `tsc` to plain ESM — no bundler required.

## Install & Run

```bash
cd examples/native-ts
npm install
npm run build      # tsc — compiles index.ts → dist/index.js
npx serve .        # serve index.html
```

Open `http://localhost:3000` in the browser.

Watch mode during development:

```bash
npm run dev        # tsc --watch
```

> **Note:** The browser resolves `make-traffic-integration-core` via an [import map](./index.html) pointing to `node_modules`. The compiled output in `dist/` retains the bare specifier — the import map handles resolution at runtime.

## Configuration

Edit `index.ts`:

```ts
const manager = await NewTaskManager({
    apiUrl: "https://integration.maketraffic.io",
    appKey: "<!--YourAppKey-->",
});

const USER_ID = "user-123";
```

## What the code does

| Lines | What happens |
|-------|-------------|
| 1–9   | `NewTaskManager` initialises the library and loads plugin scripts. Top-level `await` (requires `"module": "ESNext"` in tsconfig) means the rest of the script runs only after init is complete. |
| 13–22 | Subscribe to `TaskClaimSucceed` and `TaskClaimFailed` events. Types are inferred from the `Events` enum — the callback receives a fully typed `Task`. |
| 25–60 | `renderTasks` fetches the task list, clears the DOM and rebuilds it. Re-called after every action to reflect the updated task state. |
| 63–69 | `notify` — typed `color: "green" | "red"` parameter prevents invalid values at compile time. |

## Files

```
native-ts/
  index.html    — markup + import map + styles
  index.ts      — all application logic (~65 lines)
  tsconfig.json — ESNext module output, strict mode
  package.json  — make-traffic-integration-core + typescript
```
