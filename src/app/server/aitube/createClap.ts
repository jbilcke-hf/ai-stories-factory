"use server"

import { ClapProject, ClapMediaOrientation } from "@aitube/clap"
import { createClap as apiCreateClap } from "@aitube/client"

import { getToken } from "./getToken"
import { RESOLUTION_LONG, RESOLUTION_SHORT } from "./config"

export async function createClap({
  prompt = "",
  orientation = ClapMediaOrientation.PORTRAIT,
}: {
  prompt: string
  orientation: ClapMediaOrientation
}): Promise<ClapProject> {
  const clap: ClapProject = await apiCreateClap({
    prompt,

    height: orientation === ClapMediaOrientation.PORTRAIT ? RESOLUTION_LONG : RESOLUTION_SHORT,
    width: orientation === ClapMediaOrientation.PORTRAIT ? RESOLUTION_SHORT : RESOLUTION_LONG,

    token: await getToken()
  })

  return clap
}
