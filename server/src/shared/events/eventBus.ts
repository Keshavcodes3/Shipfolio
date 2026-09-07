import { EventEmitter } from "node:events";
import { createLogger } from "../logger.js";

const log = createLogger("event-bus");

class EventBus extends EventEmitter {
  emit(event: string | symbol, ...args: any[]): boolean {
    // Wrap emit to catch synchronous listener errors and prevent process crashes
    try {
      return super.emit(event, ...args);
    } catch (err) {
      log.error({ event: String(event), err }, "Event listener threw an error");
      return false;
    }
  }
}

export const eventBus = new EventBus();

// Increase listeners limit for modular architecture
eventBus.setMaxListeners(50);

export const emitEvent = (event: string, payload: unknown): boolean => eventBus.emit(event, payload);

export const onEvent = (event: string, listener: (...args: any[]) => void): void => {
  eventBus.on(event, listener);
};

export default eventBus;
