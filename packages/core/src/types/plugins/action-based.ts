import {TaskUserState} from "../task";
import {TaskPluginDescriptor} from "./interfaces";

export interface ActionBasedTaskMetadata {
    action: string;
    target: number;
}

export interface ActionBasedPluginState {
    completedCount: number; // Total number of actions completed
}

export const actionBasedPlugin: TaskPluginDescriptor<ActionBasedTaskMetadata, ActionBasedPluginState>= {
    pluginID: 4,
    getMetadata: (task) => task.plugin.metadata as ActionBasedTaskMetadata,
    getPluginState: (data: TaskUserState) => data.pluginStateData as ActionBasedPluginState,
};