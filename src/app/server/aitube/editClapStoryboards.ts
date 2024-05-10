"use server"

import { ClapProject } from "@aitube/clap"
import { editClapStoryboards as apiEditClapStoryboards, ClapCompletionMode } from "@aitube/client"

import { getToken } from "./getToken"
import { Workaround } from "./types"

export async function editClapStoryboards({
  clap,
  turbo = false,
}: {
  clap: ClapProject
  turbo?: boolean
}): Workaround<ClapProject> {
  async function promise() {
    return await apiEditClapStoryboards({
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