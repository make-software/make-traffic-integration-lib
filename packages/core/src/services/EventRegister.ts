import {Events, Campaign} from "../types";

export class EventRegister {
    private events: Map<Events, Function[]> = new Map();

    public subscribe(event: Events, callback: (campaign: Campaign) => void): void {
        if (!this.events.has(event)) {
            this.events.set(event, [callback]);
            return
        }
        this.events.get(event)?.push(callback);
    }

    public unsubscribe(event: Events, callback: (task: Campaign) => void): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
            this.events.set(event, callbacks.filter(cb => cb !== callback));
        }
    }

    public emit(event: Events, task: Campaign): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
            callbacks.forEach(cb => cb(task));
        }
    }
}