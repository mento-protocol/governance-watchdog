/**
 * Safely parses JSON that may contain unescaped control characters
 * @param jsonString The JSON string to parse
 * @returns Parsed object or null if parsing fails
 */
export function safeJsonParse(jsonString: string): unknown {
  try {
    return JSON.parse(jsonString);
  } catch {
    // If parsing fails, try multiple repair strategies
    const repairStrategies = [
      // Strategy 1: Fix control characters only
      (str: string) =>
        str
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t")
          .replace(/\f/g, "\\f")
          .replace(/\b/g, "\\b")
          .replace(/\v/g, "\\v"),

      // Strategy 2: Fix control characters + basic quote escaping
      (str: string) =>
        str
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t")
          .replace(/\f/g, "\\f")
          .replace(/\b/g, "\\b")
          .replace(/\v/g, "\\v")
          .replace(/([^\\])"([^,}\]:\s\\])/g, '$1\\"$2'),

      // Strategy 3: More aggressive quote fixing
      (str: string) =>
        str
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t")
          .replace(/\f/g, "\\f")
          .replace(/\b/g, "\\b")
          .replace(/\v/g, "\\v")
          .replace(/([^\\])"([^,}\]:\s\\])/g, '$1\\"$2')
          .replace(/"([^"]*)"([^,}\]:\s\\])/g, '"$1\\"$2'),
    ];

    for (const strategy of repairStrategies) {
      try {
        const cleaned = strategy(jsonString);
        return JSON.parse(cleaned);
      } catch {
        // Try next strategy
        continue;
      }
    }

    console.error("Failed to parse JSON with all repair strategies");
    return null;
  }
}

/**
 * Safely parses JSON and extracts a specific property
 * @param jsonString The JSON string to parse
 * @param property The property to extract
 * @returns The property value or null if parsing fails or property doesn't exist
 */
export function safeJsonParseProperty(
  jsonString: string,
  property: string,
): unknown {
  const parsed = safeJsonParse(jsonString);
  if (parsed && typeof parsed === "object") {
    return (parsed as Record<string, unknown>)[property] ?? null;
  }
  return null;
}
