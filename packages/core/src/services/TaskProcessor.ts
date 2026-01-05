import {Task, Events, ProcessMethodOptions, ClaimOptions} from "../types";
import {PluginsManager} from "./PluginsManager";
import {EventRegister} from "./EventRegister";
import { HttpClient} from "./HttpClient";

export class TaskProcessor {
  constructor(
    private httpClient: HttpClient,
    private appKey: string,
    private eventRegister: EventRegister,
    private pluginsManager: PluginsManager
  ) {
  }

  goProcess = async (userID: string, task: Task, options?: ProcessMethodOptions) => {
    const processMethod = this.pluginsManager.getProcessEndpointByID(task.plugin.id);
    return processMethod(this.appKey, userID, task, options)
  }

  claimProcess = async (userID: string, task: Task, options?: ClaimOptions) => {
    const run = this.pluginsManager.hasVerifyEndpointByID(task.plugin.id)
      ? this.pluginsManager.getVerifyEndpointByID(task.plugin.id)
      : this.httpClient.claimProcess.bind(this.httpClient);

    return run(this.appKey, userID, task, options).then(
      () => this.eventRegister.emit(Events.TaskClaimSucceed, task),
    ).catch((err) => {
      if (err.name === 'HttpError' && err.statusCode === 409) {
        this.eventRegister.emit(Events.TaskClaimFailed, task);
      }
      return Promise.reject(err)
    });
  };
}