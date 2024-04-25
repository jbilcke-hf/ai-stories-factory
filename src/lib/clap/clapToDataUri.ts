
import { blobToDataUri } from "@/lib/base64/blobToDataUri"

import { serializeClap } from "./serializeClap"
import { ClapProject } from "./types"

export async function clapToDataUri(clap: ClapProject): Promise<string> {
  const archive = await serializeClap(clap)
  const dataUri = await blobToDataUri(archive, "application/x-gzip")
  return dataUri
}