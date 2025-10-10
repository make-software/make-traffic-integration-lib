export * from "./types/index";
import {Config} from "./types";
import {HttpClient, TaskFilters} from "./services/HttpClient";
import {EventRegister} from "./services/EventRegister";
import {TaskProcessor} from "./services/TaskProcessor";
import {Task, TasksList, Events} from "./types";
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

    getTasks = async (userID: string,  filters?: TaskFilters): Promise<TasksList> => {
        return this.httpClient.getTasks(userID, filters);
    }

    goProcess = async (userID: string, task: Task) => {
        return this.taskProcessor.goProcess(userID, task);
    }

    claimProcess = async (userID: string, task: Task) => {
        return this.taskProcessor.claimProcess(userID, task);
    }

    subscribe = (event: Events, callback: (task: Task) => void) => {
        this.eventRegister.subscribe(event, callback);
    }

    unsubscribe = (event: Events, callback: (task: Task) => void) => {
        this.eventRegister.unsubscribe(event, callback);
    }
}

export const app = (cfg: Config) => new TaskManagerApp(cfg);
