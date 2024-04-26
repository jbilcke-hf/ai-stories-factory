"use server"

import { ClapProject } from "@aitube/clap"
import * as aitube from "@aitube/client"

export async function extendClap({
  clap,
}: {
  clap: ClapProject
}): Promise<ClapProject> {
  return aitube.extendClap({ clap })
}