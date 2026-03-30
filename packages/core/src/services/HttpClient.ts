import {
    Task,
    TasksList,
    Plugin,
    PaginationResponseType,
    ClaimOptions,
    DefaultAuthProvider,
    TrackOptions,
    HttpError,
    TaskFilters,
} from "../types";
import { version as LIB_VERSION } from '../../package.json';

export class HttpClient {
    constructor(private apiUrl: string, private appKey: string) {
    }

    private buildUrl(path: string, extraParams?: Record<string, string>): string {
        const params = new URLSearchParams();
        params.set("app_key", this.appKey);

        if (extraParams) {
            for (const [key, value] of Object.entries(extraParams)) {
                if (value !== undefined && value !== null) {
                    params.set(key, value);
                }
            }
        }

        const query = params.toString();
        return `${this.apiUrl}${path}${query ? `?${query}` : ""}`;
    }

    private async request(url: string, options: RequestInit = {}) {
        const headers = new Headers(options.headers || {});
        headers.set("X-App-JsLib-Version", LIB_VERSION);
        return fetch(url, {
            ...options,
            headers,
        });
    }

    private async extractErrorMessage(response: Response, fallback: string): Promise<string> {
        try {
            const json = await response.json();
            return json?.error?.message || json?.message || fallback;
        } catch {
            return fallback;
        }
    }

    getTasks = async (userID: string, filters?: TaskFilters): Promise<TasksList> => {
        const params = new URLSearchParams();
        params.set("user_id", userID);
        params.set("app_key", this.appKey);

        // ---- New filters (optional) ----
        // Legacy behavior: default to active-only when filters are not provided.
        const isActive = filters?.isActive ?? true;
        if (isActive !== "all") {
            params.set("is_active", isActive ? "1" : "0");
        }
        if (filters?.entityType && filters.entityType !== "all") {
            params.set("entity_type", filters.entityType); // 'task' | 'deal'
        }
        if (filters?.pluginIds?.length) {
            // If your backend expects repeated params use: for (id of pluginIds) params.append('plugin_ids', String(id))
            params.set("plugin_ids", filters.pluginIds.join(","));
        }
        if (filters?.categories?.length) {
            params.set("categories", filters.categories.join(","));
        }
        params.set("pageSize", String(filters?.pageSize ?? 100));
        params.set("currentPage", String(filters?.page ?? 1));
        params.set("auth_provider", filters?.authProvider || DefaultAuthProvider);

        const url = `${this.apiUrl}/v1/tasks?${params.toString()}`;
        const response = await this.request(url);
        if (!response.ok) {
            const message = await this.extractErrorMessage(response, `Failed to get list of tasks: ${response.statusText}`);
            return Promise.reject(new HttpError(message, response.status));
        }

        return await response.json();
    }

    getPlugins = async (): Promise<PaginationResponseType<Plugin>> => {
        const url = this.buildUrl("/v1/plugins");
        const response = await this.request(url);
        if (!response.ok) {
            const message = await this.extractErrorMessage(response, `Failed to get list of plugins: ${response.statusText}`);
            return Promise.reject(new HttpError(message, response.status));
        }

        return await response.json();
    }

    trackEvent = async (event: string, taskID: string, userID: string, options?: TrackOptions) => {
        const url = this.buildUrl("/v1/track-task-action", {
            action: event,
            task_id: taskID,
            user_id: userID,
            auth_provider: options?.authProvider || DefaultAuthProvider,
        });
        const response = await this.request(url);
        if (!response.ok) {
            const message = await this.extractErrorMessage(response, `Failed to track event: ${response.statusText}`);
            return Promise.reject(new HttpError(message, response.status));
        }
    }

    claimProcess = async (appKey: string, userID: string, task: Task, options?: ClaimOptions) => {
        const url = this.buildUrl("/v1/action/claim", {
            task_id: task.id,
            user_id: userID,
            auth_provider: options?.authProvider || DefaultAuthProvider,
        });
        const response = await this.request(url);
        if (!response.ok) {
            const message = await this.extractErrorMessage(response, `Failed to process claim: ${response.statusText}`);
            return Promise.reject(new HttpError(message, response.status));
        }
    }
}