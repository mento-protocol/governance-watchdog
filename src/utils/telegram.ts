/**
 * Creates a formatted Telegram message with HTML formatting
 * @param title The title to display at the top of the message
 * @param msgData Object containing key-value pairs to format
 * @returns Formatted message string with HTML tags
 */
export function createFormattedMessage(
  title: string,
  msgData: Record<string, string | number>,
) {
  let message = `<b>${escapeHTML(title)}</b>\n\n`;
  for (const [key, value] of Object.entries(msgData)) {
    message += `<b>${escapeHTML(key)}:</b> ${escapeHTML(String(value))}\n\n`;
  }
  return message;
}

/**
 * Escapes HTML special characters in a string
 * @param text String to escape
 * @returns Escaped string safe for HTML
 */
export function escapeHTML(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
