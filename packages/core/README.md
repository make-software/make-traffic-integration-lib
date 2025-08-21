# TaskManagerApp

`make-traffic-integration-core` is a task management library designed for traffic exchange systems. 
It provides an interface to handle deals, process tasks, and manage event subscriptions. A single instance should be created globally.
Check [Github repository](https://github.com/koltsov-iv/make-traffic-integration-lib) for more examples.

## Installation
```sh
npm install make-traffic-integration-core
```

## Usage
```typescript
import {TaskManagerApp} from "make-traffic-integration-core";

const config = {
    apiUrl: 'https://api.example.com',
    appKey: 'your-app-key'
};

const taskManager = new TaskManagerApp(config);
await taskManager.init();

// Render list of tasks
taskManager.getTasks('user123').then(tasks => {
    tasks.map(one => {console.log(one.name)})
});

// subscribe on succesfull claim event
taskManager.subscribe(Events.TaskClaimSucceed, (task: Task) => {
  console.log('Task claimed:', task);
});
```

## License
MIT

