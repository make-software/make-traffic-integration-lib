import {Campaign, Events} from "../types";
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

    goProcess = async (userID: string, campaign: Campaign) => {
        const processMethod = this.pluginsManager.getProcessEndpointByID(campaign.task.pluginID);
        return processMethod(this.appKey, userID, campaign)
    }

    claimProcess = async (userID: string, campaign: Campaign) => {
        return this.httpClient.claimProcess(userID, campaign).then(
            () => this.eventRegister.emit(Events.TaskClaimSucceed, campaign),
        ).catch(err => {
            if (err.name === 'HttpError') {
                if (err.statusCode === 409) {
                    this.eventRegister.emit(Events.TaskClaimFailed, campaign)
                }
            }
            return Promise.reject(err)
        })
    }
}