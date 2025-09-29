import { createEventHandler } from "../utils/event-handler.js";
import { proposalCreatedConfig } from "./config.js";

export default createEventHandler(proposalCreatedConfig);
