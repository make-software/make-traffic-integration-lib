import { useCallback, useEffect, useRef, useState } from "react";
import {
    Task,
    TaskManagerApp,
    TaskFilters,
    ProcessMethodOptions,
    ClaimOptions, HttpError
} from "make-traffic-integration-core";

export interface UseTaskManagerOptions {
    taskManagerApp: TaskManagerApp;
    userID: string;
    /** Optional auth provider forwarded to goProcess / claimProcess / getTasks. */
    authProvider?: string;
    /** Optional filters forwarded to getTasks. */
    filters?: TaskFilters;
}

export interface UseTaskManagerResult {
    tasks: Task[];
    isLoading: boolean;
    error: Error | null;
    /** Re-fetches the task list. */
    refresh: () => void;
    /** Triggers the go/process action for the given task. */
    goProcess: (task: Task) => Promise<void>;
    /** Claims the reward for the given task and refreshes the list on success. */
    claimProcess: (task: Task) => Promise<void>;
}

/**
 * React hook for consuming the Make Traffic task manager without Redux.
 * Handles initialization, fetching, and go/claim actions.
 *
 * @example
 * ```tsx
 * const { tasks, isLoading, goProcess, claimProcess } = useTaskManager({
 *   taskManagerApp,
 *   userID: "user-123",
 *   authProvider: "telegram",
 * });
 * ```
 */
export const useTaskManager = ({
    taskManagerApp,
    userID,
    authProvider,
    filters,
}: UseTaskManagerOptions): UseTaskManagerResult => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const isInitializedRef = useRef(false);

    const fetchTasks = useCallback(() => {
        setIsLoading(true);
        setError(null);
        const tasksFilters: TaskFilters = authProvider
            ? { ...filters, authProvider }
            : filters ?? {};
        taskManagerApp.getTasks(userID, tasksFilters)
            .then((result) => {
                setTasks(result.data || []);
            })
            .catch((err: Error) => {
                setError(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [taskManagerApp, userID, authProvider, filters]);

    useEffect(() => {
        if (isInitializedRef.current) return;
        isInitializedRef.current = true;

        taskManagerApp.init()
            .then(() => fetchTasks())
            .catch((err: Error) => {
                setError(err);
            });
    }, []);

    useEffect(() => {
        if (!isInitializedRef.current) return;
        fetchTasks();
    }, [userID]);

    const goProcess = useCallback(async (task: Task): Promise<void> => {
        const options: ProcessMethodOptions | undefined = authProvider ? { authProvider } : undefined;
        await taskManagerApp.goProcess(userID, task, options);
    }, [taskManagerApp, userID, authProvider]);

    const claimProcess = useCallback(async (task: Task): Promise<void> => {
        const options: ClaimOptions | undefined = authProvider ? { authProvider } : undefined;
        await taskManagerApp.claimProcess(userID, task, options);
        fetchTasks();
    }, [taskManagerApp, userID, authProvider, fetchTasks]);

    return {
        tasks,
        isLoading,
        error,
        refresh: fetchTasks,
        goProcess,
        claimProcess,
    };
};
