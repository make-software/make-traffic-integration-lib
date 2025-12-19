import {Task} from "./task";
import {ClaimOptions, ProcessMethodOptions} from './options';

export interface Plugin {
    id: number
    name: string
    description: string
    resources: string[]
    scriptClassname: string
    scriptInitEndpoint: string
    scriptProcessEndpoint: string
    scriptVerifyEndpoint?: string
}

export type PluginProcessMethod = (appKey: string, userID: string, task: Task, options?: ProcessMethodOptions) => Promise<object | void>;
export type PluginVerifyMethod = (appKey: string, userID: string, task: Task, options?: ClaimOptions) => Promise<object | void>;
