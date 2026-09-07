import { eventBus } from "../../../shared/events/eventBus.js";
import { ProfileEvents } from "./profiles.events.js";

eventBus.on(ProfileEvents.CREATED, async (payload: unknown) => {
  console.log("[profiles] created", payload);
});

export const registerProfileListeners = () => {};
