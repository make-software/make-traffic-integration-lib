/**
 * Simple example — read in under a minute.
 *
 * Uses TaskManagerProvider — the quickest way to render a task list.
 * No hooks, no state management. Pass a template and you're done.
 *
 * For a hook-based minimal setup see examples/hook/App.tsx.
 * For production usage with error handling and notifications see examples/full/App.tsx.
 */
import React from "react";
import { TaskManagerApp, Task } from "make-traffic-integration-core";
import { TaskManagerProvider } from "make-traffic-integration-react-wrapper";

const app = new TaskManagerApp({
    apiUrl: "https://integration.maketraffic.io",
    appKey: "<!--YourAppKey-->",
});

const TaskCard = (task: Task, actions: { go: () => void; claim: () => void }) => (
    <div style={{ padding: 12, borderBottom: "1px solid #333" }}>
        <strong style={{ color: "#fff" }}>{task.name}</strong>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            {!task.userState.isRewarded && <button onClick={actions.go}>Go</button>}
            {task.userState.isClaimAvailable && <button onClick={actions.claim}>Claim</button>}
            {task.userState.isRewarded && <span style={{ color: "#4ade80" }}>Done ✓</span>}
        </div>
    </div>
);

export default function SimpleApp() {
    return (
        <div style={{ maxWidth: 480, margin: "40px auto", background: "#18181b", borderRadius: 12 }}>
            <TaskManagerProvider
                taskManagerApp={app}
                userID="user-123"
                authProvider="telegram"
                template={TaskCard}
                onError={(err) => console.error(err)}
            />
        </div>
    );
}
