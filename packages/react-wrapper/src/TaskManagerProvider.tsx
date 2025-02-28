import React, {useEffect, useRef, useState} from "react";
import {DefaultTaskCard} from "./DefaultTaskTemplate";
import {
    Campaign,
    CampaignList, Events,
    TaskManagerApp,
} from "make-traffic-integration-core";

interface TaskManagerProviderProps {
    taskManagerApp: TaskManagerApp;
    userID: string;
    className?: string;
    filterCampaigns?: (campaign: Campaign) => boolean;
    template?: (campaign: Campaign, actions: { go: () => void; claim: () => void }) => React.ReactNode; // Updated template type
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
    const [campaigns, setCampaigns] = useState<CampaignList>([]);
    const [isInitialized, setIsInitialized] = useState(false);


    const refreshTasks = () => {
        taskManagerApp.getCampaigns(userID).then((campaignList: CampaignList) => {
            setCampaigns(campaignList || []);
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