export interface TaskReward {
    value: number
    type: string
}

export interface TaskPlugin {
    id: number
    name: string
    metadata: object | null
}

export interface TaskUserState {
    isCompleted: boolean;
    isClaimAvailable: boolean;
    isRewarded: boolean;
    isStarted: boolean;
    startedAt: string | null;
    pluginStateData: any;
}

export interface Task {
    id: string
    name: string
    description: string
    customMetadata: object | null
    category: string
    dealType: string
    priority: number
    plugin: TaskPlugin
    rewards: TaskReward[],
    userState: TaskUserState
}

export interface PaginationResponseType<T> {
    item_count: number;
    page_count: number;
    data: T[] | null;
}

export type TasksList = PaginationResponseType<Task>;