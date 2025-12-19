import {
    Task,
    TasksList,
    Plugin,
    PaginationResponseType,
    ClaimOptions,
    DefaultAuthProvider,
    TrackOptions
} from "../types";
import { version as LIB_VERSION } from '../../package.json';

export class HttpError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = 'HttpError';
    }
}

export type EntityType = "task" | "deal" | "all";
export interface TaskFilters {
    /** Default keeps legacy behavior (active only). Use 'all' to not filter by active state. */
    isActive?: boolean | "all";           // default: true (legacy)
    entityType?: EntityType;              // default: 'all'
    pluginIds?: number[];                 // e.g., [1,2,3]
    categories?: string[];                // e.g., ['default','partners']
    page?: number;
    pageSize?: number;
    authProvider?: string;
}

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
            return Promise.reject(new HttpError(`Failed to get list of tasks: ${response.statusText}`, response.status));
        }

        return await response.json();
    }

    getPlugins = async (): Promise<PaginationResponseType<Plugin>> => {
        const url = this.buildUrl("/v1/plugins");
        const response = await this.request(url);
        if (!response.ok) {
            return Promise.reject(new HttpError(`Failed to get list of plugins: ${response.statusText}`, response.status));
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
            return Promise.reject(new HttpError(`Failed to track event: ${response.statusText}`, response.status));
        }
    }

    claimProcess = async (appKey: string, userID: string, task: Task, options?: ClaimOptions) => {
        const url = this.buildUrl("/v1/action/claim", {
            task_id: task.id,
            user_id: userID,
            auth_provider: options?.authProvider || DefaultAuthProvider,
        });
        const response = await this.request(url);
        if (!response.ok && response.status === 409) {
            try {
                const json = await response.json();
                if (json && json.error.message) {
                    return Promise.reject(new HttpError(json.error.message, response.status))
                }
            } catch (e) {
                // Ignore JSON parse error
            }
            return Promise.reject(new HttpError(`Failed to process claim ${response.statusText}`, response.status))
        }
        if (!response.ok) {
            return Promise.reject(new HttpError(`Failed to process claim ${response.statusText}`, response.status))
        }
    }
}