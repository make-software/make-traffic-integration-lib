import React, {useEffect, useRef, useState} from "react";
import {DefaultTaskCard} from "./DefaultTaskTemplate";
import {
    Task,
    TaskManagerApp,
} from "make-traffic-integration-core";

interface TaskManagerProviderProps {
    taskManagerApp: TaskManagerApp;
    userID: string;
    className?: string;
    filterTasks?: (task: Task) => boolean;
    template?: (task: Task, actions: { go: () => void; claim: () => void }) => React.ReactNode; // Updated template type
}

export const TaskManagerProvider: React.FC<TaskManagerProviderProps> = (
    {
        taskManagerApp,
        userID,
        className,
        filterTasks,
        template,
    }: TaskManagerProviderProps
) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);


    const refreshTasks = () => {
        taskManagerApp.getTasks(userID).then((tasks: Task[]) => {
            setTasks(tasks || []);
        });
    };

    // Register event listeners and initialize task manager app
    useEffect(() => {
        taskManagerApp.init().then(() => {
            setIsInitialized(true);
        }).catch((error) => {
            console.error("Failed to initialize Task Manager App", error);
        });
    }, []);

    // Fetch tasks after initialization
    useEffect(() => {
        if (!isInitialized) return;
        refreshTasks();

    }, [isInitialized, userID]);

    const handleGoProcess = async (task: Task) => {
        return taskManagerApp.goProcess(userID, task);
    };

    const handleClaimProcess = async (task: Task) => {
        return taskManagerApp.claimProcess(userID, task).then(() => {
            refreshTasks();
        })
    };

    return (
        <div className={className}>
            {tasks.filter(filterTasks ?? (() => true)).map((task: Task) => {
                const actions = {
                    go: () => handleGoProcess(task),
                    claim: () => handleClaimProcess(task),
                };
                return template ? template(task, actions) : DefaultTaskCard(task, actions);
            })}
        </div>
    );
};