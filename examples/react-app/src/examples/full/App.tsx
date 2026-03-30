import React from "react";
import { Task, Events } from "make-traffic-integration-core";
import { useTaskManager, TaskClaimModalHost } from "make-traffic-integration-react-wrapper";

import { USER_ID, AUTH_PROVIDER, ASSETS_URL } from "./config";
import Toast from "../../components/Toast";
import TaskRow from "../../components/TaskRow";
import SkeletonRow from "../../components/SkeletonRow";

// ---------------------------------------------------------------------------
// App
//
// This file wires together the three main features of the integration:
//
//   1. Task list  — fetched via useTaskManager, displayed as a scrollable list.
//   2. Notifications — success toast (on claim) and error toast (on failure).
//   3. Modal host — bottom sheet for plugin-rendered UI (e.g. quiz tasks).
//
// All visual sub-components live in src/components/.
// Configuration and the singleton task manager live in src/config.ts.
// ---------------------------------------------------------------------------

const TOAST_DURATION_MS = 4000;

export const App = () => {
    // -----------------------------------------------------------------------
    // 1. Task list
    //
    // useTaskManager handles initialisation, fetching and go/claim actions.
    // `refresh` is called explicitly after a successful go or claim so the
    // list reflects the updated task state immediately.
    // -----------------------------------------------------------------------
    const { tasks, isLoading, error, goProcess, claimProcess, refresh } = useTaskManager({
        taskManagerApp: window.globalTaskManager,
        userID: USER_ID,
        authProvider: AUTH_PROVIDER,
        filters: { isActive: true },
    });

    // -----------------------------------------------------------------------
    // 2. Notifications
    //
    // Success — subscribe to TaskClaimSucceed to receive the rewarded task
    //           with its full rewards array for display in the toast.
    //
    // Error   — catch claim rejections and surface the server error message.
    //           The list is left unchanged on failure (task state did not change).
    // -----------------------------------------------------------------------
    const [claimSuccess, setClaimSuccess] = React.useState<Task | null>(null);
    const [claimError,   setClaimError]   = React.useState<string | null>(null);

    const successTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const errorTimer   = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const showSuccess = (task: Task) => {
        setClaimSuccess(task);
        if (successTimer.current) clearTimeout(successTimer.current);
        successTimer.current = setTimeout(() => setClaimSuccess(null), TOAST_DURATION_MS);
    };

    const showError = (message: string) => {
        setClaimError(message);
        if (errorTimer.current) clearTimeout(errorTimer.current);
        errorTimer.current = setTimeout(() => setClaimError(null), TOAST_DURATION_MS);
    };

    React.useEffect(() => {
        const manager = window.globalTaskManager;
        if (!manager) return;
        manager.subscribe(Events.TaskClaimSucceed, showSuccess);
        return () => manager.unsubscribe(Events.TaskClaimSucceed, showSuccess);
    }, []);

    const handleClaim = async (task: Task) => {
        try {
            await claimProcess(task);
            refresh();
        } catch (err: any) {
            showError(err?.message || "Failed to claim task");
        }
    };

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-zinc-900 flex justify-center">
            <div className="w-full max-w-md">

                <header className="px-4 pt-10 pb-4">
                    <h1 className="text-2xl font-bold text-white">Tasks</h1>
                </header>

                {/* Inline error banner for initialisation / fetch failures */}
                {error && (
                    <div className="mx-4 mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error.message}
                    </div>
                )}

                <ul className="rounded-2xl bg-zinc-800 border border-zinc-700/50 mx-4 divide-y divide-zinc-700/50 overflow-hidden">
                    {isLoading ? (
                        <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
                    ) : tasks.length === 0 ? (
                        <li className="px-4 py-8 text-center text-zinc-500 text-sm">No tasks available</li>
                    ) : (
                        tasks.map((task) => (
                            <TaskRow
                                key={task.id}
                                task={task}
                                assetsUrl={ASSETS_URL}
                                onGo={() => goProcess(task).then(refresh)}
                                onClaim={() => handleClaim(task)}
                            />
                        ))
                    )}
                </ul>

            </div>

            {/* Success toast — shows rewarded task name and reward amounts */}
            {claimSuccess && (
                <Toast color="green">
                    <span>User {USER_ID} rewarded:</span>
                    {claimSuccess.rewards.map((r) => (
                        <span key={r.type} className="flex items-center gap-1">
                            <img src={`${ASSETS_URL}/${r.type === "coin" ? "gold" : r.type}.png`} alt={r.type} className="w-4 h-4" />
                            {r.value} {r.type}
                        </span>
                    ))}
                </Toast>
            )}

            {/* Error toast — surfaces claim rejection messages from the API */}
            {claimError && (
                <Toast color="red">{claimError}</Toast>
            )}

            {/* 3. Modal host
                Listens for ClaimModalOpen events from the core library.
                When a plugin (e.g. quiz) needs a UI surface it calls provideHost,
                which receives a DOM container to render into and a close() callback.
                The modal emits ClaimModalClosed when dismissed. */}
            <TaskClaimModalHost taskManagerApp={window.globalTaskManager} />

        </div>
    );
};

export default App;
