/**
 * Simple example — read in under a minute.
 *
 * For production usage with error handling, notifications and modal support
 * see examples/full/App.tsx.
 */
import React from "react";
import { TaskManagerApp } from "make-traffic-integration-core";
import { useTaskManager } from "make-traffic-integration-react-wrapper";

const app = new TaskManagerApp({
    apiUrl: "https://integration.maketraffic.io",
    appKey: "<!--YourAppKey-->",
});

export default function SimpleApp() {
    const { tasks, isLoading, error, goProcess, claimProcess } = useTaskManager({
        taskManagerApp: app,
        userID: "user-123",
        authProvider: "telegram",
    });

    if (isLoading) return <p>Loading…</p>;
    if (error)     return <p>Error: {error.message}</p>;

    return (
        <ul>
            {tasks.map((task) => (
                <li key={task.id}>
                    <strong>{task.name}</strong>
                    {!task.userState.isRewarded && (
                        <button onClick={() => goProcess(task)}>Go</button>
                    )}
                    {task.userState.isClaimAvailable && (
                        <button onClick={() => claimProcess(task)}>Claim</button>
                    )}
                    {task.userState.isRewarded && <span>Done ✓</span>}
                </li>
            ))}
        </ul>
    );
}
