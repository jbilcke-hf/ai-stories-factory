export function isRateLimitError(something: unknown) {
  // yeah this is a very crude implementation
  return `${something || ""}`.includes("Rate Limit Reached")
}