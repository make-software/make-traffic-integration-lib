import {Task, Events} from "../types";
import {PluginsManager} from "./PluginsManager";
import {EventRegister} from "./EventRegister";
import {HttpClient} from "./HttpClient";

export class TaskProcessor {
    constructor(
        private httpClient: HttpClient,
        private appKey: string,
        private eventRegister: EventRegister,
        private pluginsManager: PluginsManager,
    ) {
    }

    goProcess = async (userID: string, task: Task) => {
        const processMethod = this.pluginsManager.getProcessEndpointByID(task.plugin.id);
        return processMethod(this.appKey, userID, task)
    }

    claimProcess = async (userID: string, task: Task) => {
        return this.httpClient.claimProcess(userID, task).then(
            () => this.eventRegister.emit(Events.TaskClaimSucceed, task),
        ).catch(err => {
            if (err.name === 'HttpError') {
                if (err.statusCode === 409) {
                    this.eventRegister.emit(Events.TaskClaimFailed, task)
                }
            }
            return Promise.reject(err)
        })
    }
}