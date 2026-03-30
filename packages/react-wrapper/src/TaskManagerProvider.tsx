import React, { useEffect, useState } from "react";
import { DefaultTaskCard } from "./DefaultTaskTemplate";
import {
    Task,
    TaskManagerApp,
    TaskFilters
} from "make-traffic-integration-core";


interface TaskManagerProviderProps {
    taskManagerApp: TaskManagerApp;
    userID: string;
    className?: string;
    /** Optional auth provider forwarded to goProcess / claimProcess. */
    authProvider?: string;
    /** Optional filters forwarded to getTasks. */
    filters?: TaskFilters;
    filterTasks?: (task: Task) => boolean;
    onError?: (error: Error) => void;
    template?: (task: Task, actions: { go: () => void; claim: () => void }) => React.ReactNode;
}

export const TaskManagerProvider: React.FC<TaskManagerProviderProps> = ({
    taskManagerApp,
    userID,
    className,
    authProvider,
    filters,
    filterTasks,
    onError,
    template,
}: TaskManagerProviderProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    const refreshTasks = () => {
        taskManagerApp.getTasks(userID, filters).then((result) => {
            setTasks(result.data || []);
        }).catch((err: Error) => {
            onError?.(err);
        });
    };

    useEffect(() => {
        taskManagerApp.init().then(() => {
            setIsInitialized(true);
        }).catch((err: Error) => {
            onError?.(err);
        });
    }, []);

    useEffect(() => {
        if (!isInitialized) return;
        refreshTasks();
    }, [isInitialized, userID]);

    const handleGoProcess = async (task: Task) => {
        const options = authProvider ? { authProvider } : undefined;
        return taskManagerApp.goProcess(userID, task, options);
    };

    const handleClaimProcess = async (task: Task) => {
        const options = authProvider ? { authProvider } : undefined;
        return taskManagerApp.claimProcess(userID, task, options).then(() => {
            refreshTasks();
        }).catch((err: Error) => {
            onError?.(err);
            return Promise.reject(err);
        });
    };

    return (
        <div className={className}>
            {tasks.filter(filterTasks ?? (() => true)).map((task: Task) => {
                const actions = {
                    go: () => handleGoProcess(task),
                    claim: () => handleClaimProcess(task),
                };
                return template
                    ? <React.Fragment key={task.id}>{template(task, actions)}</React.Fragment>
                    : DefaultTaskCard(task, actions);
            })}
        </div>
    );
};
