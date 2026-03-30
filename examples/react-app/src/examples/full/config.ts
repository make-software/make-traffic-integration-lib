import { TaskManagerApp, NewTaskManager } from "make-traffic-integration-core";

// ---------------------------------------------------------------------------
// App credentials
// Replace with your own values from the Make Traffic dashboard.
// ---------------------------------------------------------------------------
export const APP_CONFIG = {
    apiUrl: 'http://127.0.0.1:8585',
    appKey: '<!--YourAppKey-->',
};

// Base URL for task icon assets (e.g. gold.png, energy.png, www.svg …)
export const ASSETS_URL = '/icons';

// User identifier passed to every task manager call.
// In a real app this comes from your auth layer.
export const USER_ID = 'user-123';

// Auth provider forwarded to the Make Traffic API.
export const AUTH_PROVIDER = 'telegram';

// ---------------------------------------------------------------------------
// Singleton task manager
//
// NewTaskManager initialises the core library and loads plugin scripts.
// It stores the instance on window.globalTaskManager so it is accessible
// before React mounts (e.g. for event subscriptions outside components).
// ---------------------------------------------------------------------------
declare global {
    interface Window {
        globalTaskManager?: TaskManagerApp;
    }
}

NewTaskManager(APP_CONFIG).then((manager) => {
    window.globalTaskManager = manager;
});
