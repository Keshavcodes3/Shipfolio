import { eventBus } from "../../../shared/events/eventBus.js";
import { ActivityEvents } from "./activity.events.js";
import type { ActivityCreatedPayload } from "./activity.events.js";
import { createLogger } from "../../../shared/logger.js";

const log = createLogger("activity-listeners");

eventBus.on(ActivityEvents.CREATED, (payload: ActivityCreatedPayload) => {
  log.debug({ activityId: payload.activityId, type: payload.type }, "Activity created");
});

eventBus.on(ActivityEvents.UPDATED, (payload) => {
  log.debug(payload, "Activity updated");
});

eventBus.on(ActivityEvents.DELETED, (payload) => {
  log.debug(payload, "Activity deleted");
});

export const registerActivityListeners = () => {};
