export * from "./types/index";
import { HttpClient, TaskFilters} from "./services/HttpClient";
import {EventRegister} from "./services/EventRegister";
import {TaskProcessor} from "./services/TaskProcessor";
import {Config, EventPayloadMap, Task, TasksList, Events, ProcessMethodOptions, ClaimOptions} from "./types";
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

    goProcess = async (userID: string, task: Task, options?: ProcessMethodOptions) => {
        return this.taskProcessor.goProcess(userID, task, options);
    }

    claimProcess = async (userID: string, task: Task, options?: ClaimOptions) => {
        return this.taskProcessor.claimProcess(userID, task, options);
    }

    subscribe = <K extends Events>(
      event: K, callback: (payload: EventPayloadMap[K]) => void
    ) => {
        this.eventRegister.subscribe(event, callback);
    }

    unsubscribe = <K extends Events>(
      event: K, callback: (payload: EventPayloadMap[K]) => void
    ) => {
        this.eventRegister.unsubscribe(event, callback);
    }

    emit = <K extends Events>(
      event: K, payload: EventPayloadMap[K]
    ) => {
        this.eventRegister.emit(event, payload);
    }
}

export const NewTaskManager = async (cfg: Config) => {
    const appInstance = new TaskManagerApp(cfg);
    ;(window as any).globalTaskManager = appInstance;
    await appInstance.init();
    return appInstance;
}
