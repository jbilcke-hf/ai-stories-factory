"use server"

import { ClapProject } from "@aitube/clap"
import { createClap as apiCreateClap } from "@aitube/client"

import { VideoOrientation } from "../../types"

import { getToken } from "./getToken"
import { RESOLUTION_LONG, RESOLUTION_SHORT } from "./config"

export async function createClap({
  prompt = "",
  orientation = VideoOrientation.PORTRAIT,
}: {
  prompt: string
  orientation: VideoOrientation
}): Promise<ClapProject> {
  const clap: ClapProject = await apiCreateClap({
    prompt,

    height: orientation === VideoOrientation.PORTRAIT ? RESOLUTION_LONG : RESOLUTION_SHORT,
    width: orientation === VideoOrientation.PORTRAIT ? RESOLUTION_SHORT : RESOLUTION_LONG,

    token: await getToken()
  })

  return clap
}
