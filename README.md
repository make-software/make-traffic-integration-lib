# Make Traffic Integration JS Library

The project contains modular JavaScript libraries designed for managing tasks in a traffic exchange system. 
It consists of a [core npm package](https://www.npmjs.com/package/make-traffic-integration-core) and framework-specific 
wrappers for popular frameworks. 
The core library is framework-agnostic, written in TypeScript, and compiled to JavaScript.

---

## **Installation**

```bash
npm install make-traffic-integration-core
```

---

### **Initialization**
To use the library, initialize the `TaskManagerApp` instance with your app's configuration:

```javascript
import {getTaskManager, initTaskManager, Events} from "make-traffic-integration-core";

initTaskManager({
    apiUrl: 'https://api.example.com',
    appKey: 'your-app-key'
}).then(
    () => {
        const taskMagnager = getTaskManager()

        const onCampaignClaimed = (task: Campaign) => {
            console.log('Campaign claimed:', task);
        };

        taskManager.subscribe(Events.CampaignClaimSucceed, onCampaignClaimed);

        taskManager.getCampaigns('user123').then(campaigns => {
            console.log('Campaigns:', campaigns);
        });       
    },
    (error) => console.error('Failed to initialize task manager', error)
)

```


### **React Example with wrapper library **
```bash
  npm install make-traffic-integration-react-wrapper
```

Check [React Example](./examples/react-app/README.md)

#### Code Example

```tsx
import React from "react";
import {TaskManagerProvider} from "make-traffic-integration-react-wrapper";
import {initTaskManager} from "make-traffic-integration-core";

initTaskManager({
    apiUrl: 'https://api.example.com',
    appKey: 'your-app-key'
});

const MyCustomTemplate = (campaign, actions) => (
    <div>
        <h3>{campaign.name}</h3>
        <button onClick={actions.go}>Go</button>
        <button onClick={actions.claim}>Claim</button>
    </div>
);

const App = () => (
    <TaskManagerProvider
        userID="user123"
        template={MyCustomTemplate}
    />
);

export default App;
```

## Core Methods

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

## License
MIT

