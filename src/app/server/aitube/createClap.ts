"use server"

import { ClapProject } from "@aitube/clap"
import { createClap as apiCreateClap } from "@aitube/client"

import { VideoOrientation } from "../../types"
import { getToken } from "./getToken"

// initially I used 1024x512 (a 2:1 ratio)
// but that is a bit too extreme, most phones only take 16:9
const RESOLUTION_LONG = 1024
const RESOLUTION_SHORT = 576

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
