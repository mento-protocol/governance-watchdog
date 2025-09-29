import { eventRegistry } from ".";

/**
 * Auto-discover and register event handlers from config modules
 * This function scans for event config modules and registers them
 */

export async function initializeEventRegistry(): Promise<void> {
  // Import all event configs
  const proposalCreatedConfig = await import("../proposal-created/config.js");
  const proposalQueuedConfig = await import("../proposal-queued/config.js");
  const proposalExecutedConfig = await import("../proposal-executed/config.js");
  const proposalCanceledConfig = await import("../proposal-canceled/config.js");

  // Import handlers
  const handleProposalCreated = (await import("../proposal-created/index.js"))
    .default;
  const handleProposalQueued = (await import("../proposal-queued/index.js"))
    .default;
  const handleProposalExecuted = (await import("../proposal-executed/index.js"))
    .default;
  const handleProposalCanceled = (await import("../proposal-canceled/index.js"))
    .default;

  // Register proposal events
  eventRegistry.register(
    {
      ...proposalCreatedConfig.proposalCreatedConfig,
      deduplicationStrategy: "proposalId",
      requiresTimelockCalculation: true,
      priority: 10,
    },
    handleProposalCreated,
  );

  eventRegistry.register(
    {
      ...proposalQueuedConfig.proposalQueuedConfig,
      deduplicationStrategy: "proposalId",
      priority: 9,
    },
    handleProposalQueued,
  );

  eventRegistry.register(
    {
      ...proposalExecutedConfig.proposalExecutedConfig,
      deduplicationStrategy: "proposalId",
      priority: 8,
    },
    handleProposalExecuted,
  );

  eventRegistry.register(
    {
      ...proposalCanceledConfig.proposalCanceledConfig,
      deduplicationStrategy: "proposalId",
      priority: 7,
    },
    handleProposalCanceled,
  );

  // Register special handlers
  const handleHealthCheck = (await import("../health-check/index.js")).default;
  eventRegistry.registerSpecial("healthCheck", handleHealthCheck);

  console.log(
    `Event registry initialized with ${String(eventRegistry.getRegisteredEventTypes().length)} event types`,
  );
}
