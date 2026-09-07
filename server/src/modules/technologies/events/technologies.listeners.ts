import { eventBus } from "../../../shared/events/eventBus.js";
import { TechnologyEvents } from "./technologies.events.js";

eventBus.on(TechnologyEvents.CREATED, async (payload: unknown) => {
  console.log("[technologies] created", payload);
});

export const registerTechnologyListeners = () => {};
