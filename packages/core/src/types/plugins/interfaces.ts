import { redirectTimeoutPlugin } from './redirect-timeout';
import { customPlugin } from './custom';
import {actionBasedPlugin} from "./action-based";
import {Task, TaskUserState} from "../task";

export interface TaskPluginDescriptor<TMetadata = any, TState = any> {
  pluginID: number;

  getMetadata(task: Task): TMetadata;

  getPluginState(data: TaskUserState): TState;
}

export const pluginRegistry = {
  redirect: redirectTimeoutPlugin,
  custom: customPlugin,
  actionBased: actionBasedPlugin,
} as const;