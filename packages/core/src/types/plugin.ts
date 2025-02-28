import {Campaign} from "./campaign";

export interface Plugin {
    id: number
    name: string
    description: string
    resources: string[]
    scriptClassname: string
    scriptInitEndpoint: string
    scriptProcessEndpoint: string
}

export type PluginProcessMethod = (appKey: string, userID: string, campaign: Campaign) => Promise<void>;
