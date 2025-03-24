import React, {useEffect, useState} from "react";
import {DefaultTaskCard} from "./DefaultTaskTemplate";
import {
    Campaign,
    CampaignList, getTaskManager,
    TaskManagerApp,
} from "make-traffic-integration-core";

interface TaskManagerProviderProps {
    userID: string;
    className?: string;
    filterCampaigns?: (campaign: Campaign) => boolean;
    template?: (campaign: Campaign, actions: { go: () => void; claim: () => void }) => React.ReactNode; // Updated template type
}

export const TaskManagerProvider: React.FC<TaskManagerProviderProps> = (
    {
        userID,
        className,
        filterCampaigns,
        template,
    }: TaskManagerProviderProps
) => {
    const [campaigns, setCampaigns] = useState<CampaignList>([]);
    const [taskManagerApp, setTaskManager] = useState<TaskManagerApp|null>(null);

    useEffect(() => {
        const manager = getTaskManager();
        if (manager) {
            setTaskManager(manager);
        } else {
            console.error("Task Manager is not initialized");
        }
    }, []);

    if (!taskManagerApp) {
        return <p>Loading...</p>; // Wait until TaskManager is available
    }

    const refreshTasks = () => {
        taskManagerApp.getCampaigns(userID).then((campaignList: CampaignList) => {
            setCampaigns(campaignList || []);
        });
    };

    // Fetch campaigns after initialization
    useEffect(() => {
        refreshTasks();
    }, [userID]);

    const handleGoProcess = async (campaign: Campaign) => {
        return taskManagerApp.goProcess(userID, campaign);
    };

    const handleClaimProcess = async (campaign: Campaign) => {
        return taskManagerApp.claimProcess(userID, campaign).then(() => {
            refreshTasks();
        })
    };

    return (
        <div className={className}>
            {campaigns.filter(filterCampaigns ?? (() => true)).map((campaign: Campaign) => {
                const actions = {
                    go: () => handleGoProcess(campaign),
                    claim: () => handleClaimProcess(campaign),
                };
                return template ? template(campaign, actions) : DefaultTaskCard(campaign, actions);
            })}
        </div>
    );
};