import assert from "assert/strict";
import { EmbedBuilder } from "discord.js";
import sendDiscordNotification from "../send-discord-notification.js";
import sendTelegramNotification from "../send-telegram-notification.js";
import { QuicknodeEvent } from "../types.js";

/**
 * Configuration interface for event handlers
 */
export interface EventHandlerConfig<T extends QuicknodeEvent> {
  eventType: string;
  eventName: string;
  validateEvent: (event: unknown) => event is T;
  composeDiscordMessage: (event: T) => { content: string; embed: EmbedBuilder };
  composeTelegramMessage: (event: T) => Record<string, string>;
  discordEmoji: string;
  telegramEmoji: string;
}

/**
 * Creates a generic event handler that eliminates code duplication
 */
export function createEventHandler<T extends QuicknodeEvent>(
  config: EventHandlerConfig<T>,
) {
  return async function handleEvent(event: QuicknodeEvent): Promise<void> {
    assert(
      config.validateEvent(event),
      `Expected ${config.eventName} event but was ${JSON.stringify(event)}`,
    );

    console.info(`${config.eventName} event found at block`, event.blockNumber);

    // Send Discord notification
    try {
      console.info(
        `🌀 Sending Discord notification for ${config.eventName} event...`,
      );
      const discordMsg = config.composeDiscordMessage(event);
      await sendDiscordNotification(discordMsg.content, discordMsg.embed);
      console.info(
        `✅ Successfully sent Discord notification for ${config.eventName} event`,
      );
    } catch (error) {
      console.error(
        `❌ Failed to send Discord notification for ${config.eventName} event:`,
        error,
      );
    }

    // Send Telegram notification
    try {
      console.info(
        `🌀 Sending Telegram notification for ${config.eventName} event...`,
      );
      const msgData = config.composeTelegramMessage(event);
      await sendTelegramNotification(config.telegramEmoji, msgData);
      console.info(
        `✅ Successfully sent Telegram notification for ${config.eventName} event`,
      );
    } catch (error) {
      console.error(
        `❌ Failed to send Telegram notification for ${config.eventName} event:`,
        error,
      );
    }
  };
}
