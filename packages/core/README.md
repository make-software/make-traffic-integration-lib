# TaskManagerApp

`make-traffic-integration-core` is a task management library designed for traffic exchange systems. 
It provides an interface to handle campaigns, process tasks, and manage event subscriptions. A single instance should be created globally.
Check [Github repository](https://github.com/koltsov-iv/make-traffic-integration-lib) for more examples.

## Installation
```sh
npm install make-traffic-integration-core
```

## Usage
```typescript
import {TaskManagerApp, initTaskManager, getTaskManager} from "make-traffic-integration-core";

const config = {
    apiUrl: 'https://api.example.com',
    appKey: 'your-app-key'
};

await initTaskManager(config);

const taskMagnager = getTaskManager()

taskMagnager.getCampaigns("user-id").then(campaigns => {
    console.log(campaigns);
});
```

## Methods of TaskManagerApp

### `async init(): Promise<void>`
Initializes the task manager. Should be run once before using other methods.

### `async getCampaigns(userID: string): Promise<CampaignList>`
Fetches the list of campaigns available for the specified user.

### `async goProcess(userID: string, task: Campaign): Promise<void>`
Processes the specified campaign task.

### `async claimProcess(userID: string, task: Campaign): Promise<void>`
Claims the specified campaign task for the user.

### `subscribe(event: Events, callback: (task: Campaign) => void): void`
Subscribes to a specific event related to campaign tasks.

### `unsubscribe(event: Events, callback: (task: Campaign) => void): void`
Unsubscribes from a previously subscribed event.

## Events

### `Events.CampaignClaimSucceed`
Triggered when a campaign is successfully claimed.

### `Events.CampaignClaimFailed`
Triggered when claiming a campaign fails.

### `Events.CampaignProcessed`
Triggered when a campaign has been successfully processed.

## Example
```typescript
const onCampaignClaimed = (task: Campaign) => {
    console.log('Campaign claimed:', task);
};

taskManager.subscribe(Events.CampaignClaimSucceed, onCampaignClaimed);

taskManager.getCampaigns('user123').then(campaigns => {
    if (campaigns.length > 0) {
        taskManager.claimProcess('user123', campaigns[0]);
    }
});
```

## License
MIT

