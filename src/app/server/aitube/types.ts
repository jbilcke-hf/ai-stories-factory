  // "Server Actions are designed for mutations that update server-side state; they are not recommended for data fetching. Accordingly, frameworks implementing Server Actions typically process one action at a time and do not have a way to cache the return value."
  // well, lol
  // https://www.youtube.com/watch?v=CDZg3maL9q0
  export type Workaround<T> = Promise<{ promise: Promise<T> }>

