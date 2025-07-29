import { TaskPluginDescriptor } from './interfaces';

export interface TaskStateCustom {
  latestStartedAt?: string; // ISO timestamp, optional
  completionCountTotal: number;
  latestCompletedAt?: string; // ISO timestamp, optional
  latestClaimedAt?: string; // ISO timestamp, optional
  completionCountSinceLastClaim: number;
}

export const customPlugin: TaskPluginDescriptor<TaskStateCustom, any> = {
  pluginID: 3,
  getMetadata: (task) => task.plugin.metadata as any,
  getPluginState: (data) => data.pluginStateData as TaskStateCustom
};
