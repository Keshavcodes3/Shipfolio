import { eventBus } from "../../../shared/events/eventBus.js";
import { UserEvents } from "./users.events.js";

eventBus.on(UserEvents.CREATED, async (payload: unknown) => {
  console.log("[users] created", payload);
});

export const registerUserListeners = () => {};
