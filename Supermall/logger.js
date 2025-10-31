// logger.js
export function logEvent(eventType, details) {
  console.log(`[${new Date().toISOString()}] ${eventType}:`, details);
}
