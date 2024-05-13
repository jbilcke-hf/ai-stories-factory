
export function pick<T>(items: T[], defaultValue: T, {
  skipList = [],
  maxRetries = 10
}: {
  skipList?: T[]
  maxRetries?: number
} = {
  skipList: [],
  maxRetries: 10
}): T {
  let candidate: T | undefined = undefined
  for (let i = 0; i < maxRetries; i++) {
    candidate = items[Math.floor(Math.random() * items.length)] as T
    if (skipList.includes(candidate)) { continue }
  }
  if (typeof candidate === "undefined") {
    return defaultValue
  } else {
    return candidate
  }
}
