import React, {useEffect} from "react";
import {Events, Task, TaskManagerApp} from "make-traffic-integration-core";
import {TaskManagerProvider} from "make-traffic-integration-react-wrapper";

const appConfig = {
    apiUrl: 'https://make-traffic-integration.dev.make.services',
    appKey: '<!--YourAppKey-->',
};

const makeTrafficApp = new TaskManagerApp(appConfig);

// Custom Task Card Template
const TaskCard = (task: Task, actions: { go: () => void; claim: () => void }) => (
    <div className="task-card" key={task.id}>
        <div className="card-body">
            <h5 className="card-title">{task.name}</h5>
            <p className="card-text">
                Earn {task.rewards[0].value} {task.rewards[0].type}
            </p>
            <button className="btn-go" onClick={actions.go}>Custom Go Button</button>
            <button className="btn-claim" onClick={actions.claim}>Custom Claim Button</button>
        </div>
    </div>
);


export const App = () => {
    const onSuccess = (task: Task) => alert(`Successfully claimed task: ${task.name}`)
    const onFail = (task: Task) => alert(`Failed to claim task: ${task.name}`)

    useEffect(() => {
        makeTrafficApp.subscribe(Events.TaskClaimSucceed, onSuccess);
        makeTrafficApp.subscribe(Events.TaskClaimFailed, onFail);

        return () => {
            makeTrafficApp.unsubscribe(Events.TaskClaimSucceed, onSuccess);
            makeTrafficApp.unsubscribe(Events.TaskClaimFailed, onFail);
        }
    }, []);


// Filter out completed tasks
    const filterTasks = (task: Task) => task.userState.isRewarded !== true;

    return (
        <TaskManagerProvider
            taskManagerApp={makeTrafficApp}
            userID="user-123"
            template={TaskCard}
            className="flex flex-wrap gap-4 justify-center p-24" // Custom styling
            filterTasks={filterTasks} // Custom filtering
        />
    );
};

export default App;