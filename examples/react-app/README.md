# Make Traffic Integration React Example

This example demonstrates how to use the [
`make-traffic-integration-core`](https://www.npmjs.com/package/make-traffic-integration-core)
and [`make-traffic-integration-react-wrapper`](https://www.npmjs.com/package/make-traffic-integration-react-wrapper)
libraries in a React component.

Check the [React Example](./src/App.tsx) for the complete code.

Run the example:

```bash
git clone git@github.com:koltsov-iv/make-traffic-integration-lib.git

cd make-traffic-integration-lib/examples/react-app

npm install

npm start
```

Replace the `<!--YourAppKey-->` placeholder in the `appConfig` object with your application key
from [Make Traffic console](https://make-traffic-console.dev.make.services/).

## Usage

```tsx
import React from "react";
import { TaskManagerProvider } from "make-traffic-integration-react-wrapper";
import {TaskManagerApp} from "make-traffic-integration-core";

const taskManagerApp = TaskManagerApp({
    apiUrl: "https://api.example.com",
    appKey: "your-app-key",
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
        taskManagerApp={taskManagerApp}
        userID="user123"
        template={MyCustomTemplate}
    />
);

export default App;
```