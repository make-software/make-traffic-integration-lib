export interface TaskReward {
    value: number
    type: string
}

export interface Task {
    id: string
    name: string
    description: string
    customMetadata: object | null
    icon: string
    pluginID: number
}
export interface Campaign {
    id: string
    task: Task
    settings: {
        rewards: TaskReward[]
    }
    isClaimAvailable?: boolean
    isCompleted?: boolean
}

export type CampaignList = Campaign[]