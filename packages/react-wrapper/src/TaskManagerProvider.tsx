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
    filterCampaigns?: (task: Task) => boolean;
    template?: (task: Task, actions: { go: () => void; claim: () => void }) => React.ReactNode; // Updated template type
}

export const TaskManagerProvider: React.FC<TaskManagerProviderProps> = (
    {
        taskManagerApp,
        userID,
        className,
        filterCampaigns,
        template,
    }: TaskManagerProviderProps
) => {
    const [campaigns, setCampaigns] = useState<Task[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);


    const refreshTasks = () => {
        taskManagerApp.getTasks(userID).then((tasks: Task[]) => {
            setCampaigns(tasks || []);
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

    // Fetch campaigns after initialization
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
            {campaigns.filter(filterCampaigns ?? (() => true)).map((task: Task) => {
                const actions = {
                    go: () => handleGoProcess(task),
                    claim: () => handleClaimProcess(task),
                };
                return template ? template(task, actions) : DefaultTaskCard(task, actions);
            })}
        </div>
    );
};