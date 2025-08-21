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
import { TaskManagerApp } from "make-traffic-integration-core";

const appConfig = {
    apiUrl: 'https://make-traffic-integration.dev.make.services',
    appKey: '<!--YourAppKey-->',
};

const taskManager = new TaskManagerApp(appConfig);
taskManager.init(); // Initialize the library
```

---

### Example

```typescript

const onTaskClaimed = (task: Task) => {
  console.log('Task claimed:', task);
};

taskManager.subscribe(Events.TaskClaimSucceed, onTaskClaimed);

taskManager.getTasks('user123').then(tasks => {
  console.log('Tampaigns:', tasks);
});
```


### **React Example with wrapper library **
```bash
  npm install make-traffic-integration-react-wrapper
```

Check [React Example](./examples/react-app/README.md)

#### Code Example

```tsx
import React from "react";
import { TaskManagerProvider } from "make-traffic-integration-react-wrapper";
import {TaskManagerApp} from "make-traffic-integration-core";

const taskManagerApp = TaskManagerApp({
    apiUrl: "https://api.example.com",
    appKey: "your-app-key",
});

const MyCustomTemplate = (task, actions) => (
    <div>
        <h3>{task.name}</h3>
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

## Core Methods

### `async init(): Promise<void>`
Initializes the task manager. Should be run once before using other methods.

### `async getTasks(userID: string): Promise<TaskList>`
Fetches the list of tasks available for the specified user.

### `async goProcess(userID: string, task: Task): Promise<void>`
Processes the specified task task.

### `async claimProcess(userID: string, task: Task): Promise<void>`
Claims the specified task for the user.

### `subscribe(event: Events, callback: (task: Task) => void): void`
Subscribes to a specific event related to tasks.

### `unsubscribe(event: Events, callback: (task: Task) => void): void`
Unsubscribes from a previously subscribed event.

## Events

### `Events.TaskClaimSucceed`
Triggered when a task is successfully claimed.

### `Events.TaskClaimFailed`
Triggered when claiming a task fails.

### `Events.TaskProcessed`
Triggered when a task has been successfully processed.

## License
MIT

