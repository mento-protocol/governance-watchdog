import { createEventHandler } from "../utils/event-handler.js";
import { proposalQueuedConfig } from "./config.js";

export default createEventHandler(proposalQueuedConfig);
