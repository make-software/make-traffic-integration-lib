import {Task} from './task';

export enum Events {
    AppInit = 'appInit',
    ClickOnTaskGo = 'clickOnTaskGo',
    ClickOnTaskClaim = 'clickOnTaskClaim',
    TaskClaimSucceed = 'taskClaimSucceed',
    TaskClaimFailed = 'taskClaimFailed',
    ClaimModalOpen = 'claimModalOpen',
    ClaimModalClosed = 'claimModalClosed',
}

export interface ClaimModalOpenPayload {
    task: Task;
    // host tells plugin where/how to render
    provideHost: (host: { container: HTMLElement; close: () => void }) => void;
}

export interface ClaimModalClosedPayload {
    task: Task;
    reason: "completed" | "user_closed" | "error";
}

export interface EventPayloadMap {
    [Events.AppInit]: Task;
    [Events.ClickOnTaskGo]: Task;
    [Events.ClickOnTaskClaim]: Task;
    [Events.TaskClaimSucceed]: Task;
    [Events.TaskClaimFailed]: Task;
    [Events.ClaimModalOpen]: ClaimModalOpenPayload;
    [Events.ClaimModalClosed]: ClaimModalClosedPayload;
}