import { Events, EventPayloadMap } from "../types";

export class EventRegister {
    private events: Map<Events, Function[]> = new Map();

    public subscribe<K extends Events>(
      event: K,
      callback: (payload: EventPayloadMap[K]) => void
    ): void {
        if (!this.events.has(event)) {
            this.events.set(event, [callback]);
            return;
        }
        this.events.get(event)!.push(callback);
    }

    public unsubscribe<K extends Events>(
      event: K,
      callback: (payload: EventPayloadMap[K]) => void
    ): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
            this.events.set(
              event,
              callbacks.filter((cb) => cb !== callback)
            );
        }
    }

    public emit<K extends Events>(event: K, payload: EventPayloadMap[K]): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
            callbacks.forEach((cb) => cb(payload));
        }
    }
}