import { newClap } from "./newClap"
import { serializeClap } from "./serializeClap"

let globalState: {
  blob?: Blob
} = {
  blob: undefined
}

export async function getEmptyClap(): Promise<Blob> {
  if (globalState.blob) { return globalState.blob }

  const clap = newClap()

  globalState.blob = await serializeClap(clap)

  return globalState.blob
}