"use server"

import { ClapProject } from "@aitube/clap"
import * as aitube from "@aitube/client"

export async function exportClap({
  clap,
}: {
  clap: ClapProject
}): Promise<string> {
  return aitube.exportClap({ clap })
}