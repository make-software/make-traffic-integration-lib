import {Campaign, CampaignList, Plugin} from "../types";

export class HttpError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = 'HttpError';
    }
}

export class HttpClient {
    constructor(private apiUrl: string, private appKey: string) {
    }

    getCampaigns = async (userID: string): Promise<CampaignList> => {
        const response = await fetch(this.apiUrl + `/campaigns?app_key=${this.appKey}&user_id=${userID}`);
        if (!response.ok) {
            return Promise.reject(new HttpError(`Failed to get list of campaigns: ${response.statusText}`, response.status));
        }

        return await response.json();
    }

    getPlugins = async (): Promise<Plugin[]> => {
        const response = await fetch(this.apiUrl + '/plugins?app_key=' + this.appKey);
        if (!response.ok) {
            return Promise.reject(new HttpError(`Failed to get list of plugins: ${response.statusText}`, response.status));
        }

        return await response.json();
    }

    trackEvent = async (event: string, taskID: string, userID: string) => {
        const response = await fetch(`${this.apiUrl}/track-task-action?action=${event}&task_id=${taskID}&user_id=${userID}`)
        if (!response.ok) {
            return Promise.reject(new HttpError(`Failed to track event: ${response.statusText}`, response.status));
        }
    }

    claimProcess = async (userID: string, campaign: Campaign) => {
        const response = await fetch(`${this.apiUrl}/action/claim?campaign_id=${campaign.id}&user_id=${userID}&app_key=${this.appKey}`)
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