# TaskManagerProvider

`make-traffic-integration-react-wrapper` is a React component that integrates with `make-traffic-integration-core` 
to manage and display traffic exchange deals. It fetches and displays tasks, allowing users to claim and 
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

## Props

### `taskManagerApp: TaskManagerApp`
Instance of `TaskManagerApp` for managing task tasks.

### `userID: string`
Unique identifier for the user.

### `className?: string`
Optional CSS class for styling the provider container.

### `filterTasks?: (task: Task) => boolean`
Optional function to filter tasks before displaying them.

### `template?: (task: Task, actions: { go: () => void; claim: () => void }) => React.ReactNode`
Optional custom template for rendering task tasks. Defaults to `DefaultTaskCard`.

## Events

The provider listens to and handles updates from `make-traffic-integration-core`.

## License
MIT

