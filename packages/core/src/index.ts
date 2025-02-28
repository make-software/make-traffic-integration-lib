export * from "./types/index";
import {Config} from "./types";
import {HttpClient} from "./services/HttpClient";
import {EventRegister} from "./services/EventRegister";
import {TaskProcessor} from "./services/TaskProcessor";
import {Campaign, CampaignList, Events} from "./types";
import {PluginsManager} from "./services/PluginsManager";

export class TaskManagerApp {
    private readonly pluginsManager: PluginsManager;
    private readonly httpClient: HttpClient;
    private readonly eventRegister: EventRegister;
    private readonly taskProcessor: TaskProcessor;

    constructor(cfg: Config) {
        this.httpClient = new HttpClient(cfg.apiUrl, cfg.appKey);
        this.pluginsManager = new PluginsManager(cfg.apiUrl, cfg.appKey, this.httpClient);
        this.eventRegister = new EventRegister();
        this.taskProcessor = new TaskProcessor(this.httpClient, cfg.appKey, this.eventRegister, this.pluginsManager);
    }

    init = async () => {
        return this.pluginsManager.initPluginScripts()
    }

    getCampaigns = async (userID: string): Promise<CampaignList> => {
        return this.httpClient.getCampaigns(userID);
    }

    goProcess = async (userID: string, task: Campaign) => {
        return this.taskProcessor.goProcess(userID, task);
    }

    claimProcess = async (userID: string, task: Campaign) => {
        return this.taskProcessor.claimProcess(userID, task);
    }

    subscribe = (event: Events, callback: (task: Campaign) => void) => {
        this.eventRegister.subscribe(event, callback);
    }

    unsubscribe = (event: Events, callback: (task: Campaign) => void) => {
        this.eventRegister.unsubscribe(event, callback);
    }
}

export const app = (cfg: Config) => new TaskManagerApp(cfg);
