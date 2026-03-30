import "./tailwind.css";
import React from "react";
import ReactDOM from "react-dom";

// ---------------------------------------------------------------------------
// Switch between examples by uncommenting the one you want to run.
// ---------------------------------------------------------------------------

// 1. Simple   — TaskManagerProvider, no hooks, ~35 lines.
// import App from "./examples/simple/App";

// 2. Hook     — useTaskManager, minimal hook usage, ~35 lines.
// import App from "./examples/hook/App";

// 3. Full     — hook + error handling + toasts + modal host, best practices.
import App from "./examples/full/App";
import "./examples/full/config"; // singleton manager — remove for examples 1 & 2

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
