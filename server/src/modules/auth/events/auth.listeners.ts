import { eventBus } from "../../../shared/events/eventBus.js";
import { AuthEvents } from "./auth.events.js";
import type { AuthRegisteredPayload, AuthLoggedInPayload } from "./auth.events.js";
import { enqueueActivity } from "../../../infrastructure/queue/queues/activity.queue.js";

eventBus.on(AuthEvents.REGISTERED, async (payload: AuthRegisteredPayload) => {
  console.log("[auth] registered", payload);
  await enqueueActivity({
    userId: payload.userId,
    type: "USER_REGISTERED",
    metadata: { username: payload.username },
  }).catch((e) => console.error("Failed to enqueue activity for REGISTERED", e));
});

eventBus.on(AuthEvents.LOGGED_IN, async (payload: AuthLoggedInPayload) => {
  console.log("[auth] logged in", payload);
});

eventBus.on(AuthEvents.LOGGED_OUT, async (payload: { userId: string }) => {
  console.log("[auth] logged out", payload);
});

eventBus.on(AuthEvents.REFRESHED, async (payload: { userId: string }) => {
  console.log("[auth] token refreshed", payload);
});

export const registerAuthListeners = () => {
  // listeners are registered on import; keep for explicit init
};
