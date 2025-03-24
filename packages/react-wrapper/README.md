# TaskManagerProvider

`make-traffic-integration-react-wrapper` is a React component that integrates with `make-traffic-integration-core` 
to manage and display traffic exchange campaigns. It fetches and displays campaign tasks, allowing users to claim and 
process tasks via customizable templates.
Check [Github repository](https://github.com/koltsov-iv/make-traffic-integration-lib) for more examples.


## Installation

```sh
npm install make-traffic-integration-react-wrapper
```

## Usage

```tsx
import React from "react";
import { TaskManagerProvider } from "make-traffic-integration-react-wrapper";
import {TaskManagerApp, initTaskManager, getTaskManager} from "make-traffic-integration-core";


const config = {
    apiUrl: 'https://console-api.maketraffic.io',
    appKey: 'your-app-key'
};

initTaskManager(config).then(
    () => console.log('Task manager initialized'),
    (error) => console.error('Failed to initialize task manager', error)
);

const MyCustomTemplate = (campaign, actions) => (
    <div>
        <h3>{campaign.name}</h3>
        <button onClick={actions.go}>Go</button>
        <button onClick={actions.claim}>Claim</button>
    </div>
);

const App = () => {
    const taskMagnager = getTaskManager()
    
    return (
        <TaskManagerProvider
            userID="user123"
            template={MyCustomTemplate}
        />
    );
}

export default App;
```

## Props

### `taskManagerApp: TaskManagerApp`
Instance of `TaskManagerApp` for managing campaign tasks.

### `userID: string`
Unique identifier for the user.

### `className?: string`
Optional CSS class for styling the provider container.

### `filterCampaigns?: (campaign: Campaign) => boolean`
Optional function to filter campaigns before displaying them.

### `template?: (campaign: Campaign, actions: { go: () => void; claim: () => void }) => React.ReactNode`
Optional custom template for rendering campaign tasks. Defaults to `DefaultTaskCard`.

## Events

The provider listens to and handles updates from `make-traffic-integration-core`.

## License
MIT

