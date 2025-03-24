import './tailwind.css';
import './styles.css';
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {initTaskManager} from "make-traffic-integration-core";

initTaskManager({
    apiUrl: 'https://console-api.maketraffic.io',
    appKey: 'your-app-key'
}).then(
    () => console.log('Task manager initialized'),
    (error) => console.error('Failed to initialize task manager', error)
);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
