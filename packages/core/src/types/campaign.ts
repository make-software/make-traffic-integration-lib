export interface TaskReward {
    value: number
    type: string
}

export interface Task {
    id: string
    name: string
    description: string
    customMetadata: object | null
    pluginID: number
    pluginMetadata: object | null
}

export interface CampaignUserState {
    isCompleted: boolean;
    isClaimAvailable: boolean;
    isRewarded: boolean;
    isStarted: boolean;
    startedAt: string | null;
    pluginStateData: any;
}

export interface Campaign {
    id: string
    title: string
    category: string
    dealType: string
    priority: number
    task: Task
    settings: {
        rewards: TaskReward[]
    }
    userState: CampaignUserState
}

export type CampaignList = Campaign[]