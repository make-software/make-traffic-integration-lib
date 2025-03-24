import React, {useEffect, useState} from "react";
import {Campaign, Events, getTaskManager} from "make-traffic-integration-core";
import {TaskManagerProvider} from "make-traffic-integration-react-wrapper";

// Custom Task Card Template
const TaskCard = (campaign: Campaign, actions: { go: () => void; claim: () => void }) => (
    <div className="task-card" key={campaign.task.id}>
        <div className="card-body">
            <h5 className="card-title">{campaign.task.name}</h5>
            <p className="card-text">
                Earn {campaign.settings.rewards[0].value} {campaign.settings.rewards[0].type}
            </p>
            <button className="btn-go" onClick={actions.go}>Custom Go Button</button>
            <button className="btn-claim" onClick={actions.claim}>Custom Claim Button</button>
        </div>
    </div>
);


export const App = () => {
    const onSuccess = (campaign: Campaign) => alert(`Successfully claimed task: ${campaign.task.name}`)
    const onFail = (campaign: Campaign) => alert(`Failed to claim task: ${campaign.task.name}`)

    useEffect(() => {
        try {
            const makeTrafficApp = getTaskManager();
            makeTrafficApp.subscribe(Events.TaskClaimSucceed, onSuccess);
            makeTrafficApp.subscribe(Events.TaskClaimFailed, onFail);
            return () => {
                makeTrafficApp.unsubscribe(Events.TaskClaimSucceed, onSuccess);
                makeTrafficApp.unsubscribe(Events.TaskClaimFailed, onFail);
            }
        } catch (e) {
            console.error("Task Manager is not initialized");
            return () => {};
        }
        }, []);

    // Filter out completed tasks
    const filterCampaigns = (campaign: Campaign) => campaign.isCompleted !== true;

    return (
        <TaskManagerProvider
            userID="user-123"
            template={TaskCard}
            className="flex flex-wrap gap-4 justify-center p-24" // Custom styling
            filterCampaigns={filterCampaigns} // Custom filtering
        />
    );
};

export default App;