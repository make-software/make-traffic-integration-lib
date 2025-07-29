import { TaskPluginDescriptor } from './interfaces';

export interface TaskMetadataRedirectTimeout {
  url: string;
  secondsToClaim: number;
}

export const redirectTimeoutPlugin: TaskPluginDescriptor<
  TaskMetadataRedirectTimeout,
  any
> = {
  pluginID: 2,
  getMetadata: (task) => task.plugin.metadata as TaskMetadataRedirectTimeout,
  getPluginState: (data) => data.pluginStateData
};
