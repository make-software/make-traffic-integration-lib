# Native JS Example

Minimal vanilla JavaScript integration. No build step, no framework — just an ES module loaded directly in the browser.

## Install & Run

```bash
cd examples/native-js
npm install
npx serve .
```

Open `http://localhost:3000` in the browser.

> **Note:** The browser resolves `make-traffic-integration-core` via an [import map](./index.html) pointing to `node_modules`. Run `npm install` before serving.

## Configuration

Edit `index.js`:

```js
const manager = await NewTaskManager({
    apiUrl: "https://integration.maketraffic.io",
    appKey: "<!--YourAppKey-->",
});

const USER_ID = "user-123";
```

## What the code does

| Lines | What happens |
|-------|-------------|
| 1–9   | `NewTaskManager` initialises the library and loads plugin scripts. Top-level `await` means the rest of the script runs only after init is complete. |
| 13–22 | Subscribe to `TaskClaimSucceed` and `TaskClaimFailed` events to show a notification banner without polling. |
| 25–60 | `renderTasks` fetches the task list and rebuilds the DOM. It is called once on load and again after every Go / Claim action to keep state in sync. |
| 63–69 | `notify` shows a timed banner at the top of the screen and hides it after 4 s. |

## Files

```
native-js/
  index.html   — markup + import map + styles
  index.js     — all application logic (~60 lines)
  package.json — single dependency: make-traffic-integration-core
```
