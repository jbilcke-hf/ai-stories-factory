"use server"

import { ClapProject } from "@aitube/clap"
import * as aitube from "@aitube/client"

export async function generateClap({
  prompt = "",
}: {
  prompt: string
}): Promise<ClapProject> {
  return aitube.generateClap({ prompt })
}