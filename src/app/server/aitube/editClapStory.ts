"use server"

import { ClapProject } from "@aitube/clap"
import { editClapStory as apiEditClapStory, ClapCompletionMode } from "@aitube/client"

import { getToken } from "./getToken"
import { Workaround } from "./types"

export async function editClapStory({
  clap,
  prompt,
  startTimeInMs,
  endTimeInMs,
  turbo = false,
}: {
  clap: ClapProject
  prompt?: string
  startTimeInMs?: number
  endTimeInMs?: number
  turbo?: boolean
}):  Workaround<ClapProject> {
  async function promise() {
    return await apiEditClapStory({
      clap,
      prompt,
      startTimeInMs,
      endTimeInMs,
      completionMode: ClapCompletionMode.MERGE,
      turbo,
      token: await getToken()
    })
  }

  return { 
    promise: promise()
  }
}