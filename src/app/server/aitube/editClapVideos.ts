"use server"

import { ClapProject, ClapCompletionMode } from "@aitube/clap"
import { editClapVideos as apiEditClapVideos } from "@aitube/client"

import { getToken } from "./getToken"
import { Workaround } from "./types"

export async function editClapVideos({
  clap,
  turbo = false,
}: {
  clap: ClapProject
  turbo?: boolean
}): Workaround<ClapProject> {
  async function promise() {
    return await apiEditClapVideos({
      clap,
      completionMode: ClapCompletionMode.MERGE,
      turbo,
      token: await getToken()
    })
  }
  return {
    promise: promise()
  }
}