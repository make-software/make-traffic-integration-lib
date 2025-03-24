# Make Traffic Integration React Example

This example demonstrates how to use the [
`make-traffic-integration-core`](https://www.npmjs.com/package/make-traffic-integration-core)
and [`make-traffic-integration-react-wrapper`](https://www.npmjs.com/package/make-traffic-integration-react-wrapper)
libraries in a React component.

Check the [React Example](./src/App.tsx) for the complete code.

Run the example on localhost:

```bash
git clone git@github.com:koltsov-iv/make-traffic-integration-lib.git

cd make-traffic-integration-lib/examples/react-app

npm install

env PORT=3033 npm start
```

Replace the PORT value with the desired port number from your Traffic source settings.

Replace the `<!--YourAppKey-->` placeholder in the `appConfig` object with your application key
from [Make Traffic console](https://make-traffic-console.dev.make.services/).

## Usage

```tsx
import React from "react";
import { TaskManagerProvider } from "make-traffic-integration-react-wrapper";
import {Campaign, Events, initTaskManager, getTaskManager} from "make-traffic-integration-core";

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

const App = () => (
    <TaskManagerProvider
        userID="user123"
        template={MyCustomTemplate}
    />
);

export default App;
```