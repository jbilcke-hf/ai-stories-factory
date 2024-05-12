"use server"

import { ClapProject, ClapMediaOrientation } from "@aitube/clap"
import { createClap as apiCreateClap } from "@aitube/client"

import { getToken } from "./getToken"
import { RESOLUTION_LONG, RESOLUTION_SHORT } from "./config"

export async function createClap({
  prompt = "",
  orientation = ClapMediaOrientation.PORTRAIT,
  turbo = false,
}: {
  prompt: string
  orientation?: ClapMediaOrientation
  turbo?: boolean
}): Promise<ClapProject> {
  const clap: ClapProject = await apiCreateClap({
    prompt: prompt.slice(0, 512),

    height: orientation === ClapMediaOrientation.PORTRAIT ? RESOLUTION_LONG : RESOLUTION_SHORT,
    width: orientation === ClapMediaOrientation.PORTRAIT ? RESOLUTION_SHORT : RESOLUTION_LONG,

    turbo,

    token: await getToken()
  })

  return clap
}
