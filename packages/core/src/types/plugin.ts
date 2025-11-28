import {Task} from "./task";

export interface Plugin {
    id: number
    name: string
    description: string
    resources: string[]
    scriptClassname: string
    scriptInitEndpoint: string
    scriptProcessEndpoint: string
    scriptVerifyEndpoint: string
}

export type PluginProcessMethod = (appKey: string, userID: string, task: Task) => Promise<object | void>;
