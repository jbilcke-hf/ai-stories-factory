"use server"

import { ClapProject } from "@aitube/clap"
import { editClapVideos as apiEditClapVideos, ClapCompletionMode } from "@aitube/client"

import { getToken } from "./getToken"

export async function editClapVideos({
  clap,
  turbo = false,
}: {
  clap: ClapProject
  turbo?: boolean
}): Promise<ClapProject> {
  const newClap: ClapProject = await apiEditClapVideos({
    clap,
    completionMode: ClapCompletionMode.MERGE,
    turbo,
    token: await getToken()
  })

  return newClap
}